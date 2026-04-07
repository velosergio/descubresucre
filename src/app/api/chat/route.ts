import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPublicOriginFromRequest } from "@/lib/site-url";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(32_000),
});

const postBodySchema = z.object({
  sessionKey: z.string().max(128).optional(),
  messages: z.array(messageSchema).min(1).max(100),
});

async function getWebhookUrl(): Promise<string | null> {
  const row = await prisma.chatbotSettings.findUnique({ where: { id: "singleton" } });
  const url = row?.n8nWebhookUrl?.trim();
  return url || null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = postBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const webhookUrl = await getWebhookUrl();
  if (!webhookUrl) {
    return NextResponse.json(
      {
        error:
          "El webhook de chat no está configurado. Un administrador debe añadir la URL en Configuración.",
      },
      { status: 503 },
    );
  }

  const secret = process.env.N8N_CALLBACK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "N8N_CALLBACK_SECRET no está definido en el servidor." },
      { status: 503 },
    );
  }

  const origin = getPublicOriginFromRequest(request);
  const callbackUrl = `${origin}/api/chat/n8n-callback`;

  const job = await prisma.chatJob.create({
    data: { status: "PENDING" },
  });

  const payload = {
    jobId: job.id,
    sessionKey: parsed.data.sessionKey ?? null,
    messages: parsed.data.messages,
    callbackUrl,
    secret,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!n8nRes.ok) {
      await prisma.chatJob.update({
        where: { id: job.id },
        data: {
          status: "ERROR",
          errorMessage: `Webhook n8n respondió ${n8nRes.status}`,
        },
      });
      return NextResponse.json(
        { error: "El webhook no aceptó la solicitud", jobId: job.id },
        { status: 502 },
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error de red hacia n8n";
    await prisma.chatJob.update({
      where: { id: job.id },
      data: {
        status: "ERROR",
        errorMessage: msg,
      },
    });
    return NextResponse.json(
      { error: "No se pudo contactar el webhook", jobId: job.id },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  return NextResponse.json({ jobId: job.id });
}

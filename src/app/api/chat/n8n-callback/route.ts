import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const callbackSchema = z.object({
  jobId: z.string().min(1).max(64),
  secret: z.string().min(1).optional(),
  reply: z.string().max(200_000).optional(),
  output: z.string().max(200_000).optional(),
  error: z.string().max(2000).optional(),
});

function getExpectedSecret(): string | null {
  return process.env.N8N_CALLBACK_SECRET?.trim() || null;
}

export async function POST(request: Request) {
  const expected = getExpectedSecret();
  if (!expected) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const headerSecret = request.headers.get("x-n8n-secret")?.trim();
  const bodySecret = parsed.data.secret?.trim();
  const provided = headerSecret || bodySecret;
  if (!provided || provided !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const job = await prisma.chatJob.findUnique({ where: { id: parsed.data.jobId } });
  if (!job) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  if (job.status !== "PENDING") {
    return NextResponse.json({ ok: true });
  }

  const errText = parsed.data.error?.trim();
  if (errText) {
    await prisma.chatJob.update({
      where: { id: parsed.data.jobId },
      data: { status: "ERROR", errorMessage: errText },
    });
    return NextResponse.json({ ok: true });
  }

  const text = (parsed.data.reply ?? parsed.data.output ?? "").trim();
  if (!text) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.chatJob.update({
    where: { id: parsed.data.jobId },
    data: {
      status: "DONE",
      assistantReply: text,
    },
  });

  return NextResponse.json({ ok: true });
}

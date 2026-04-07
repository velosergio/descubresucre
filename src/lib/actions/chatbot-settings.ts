"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdminAction } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const urlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((s) => s === "" || URL.canParse(s), "URL inválida")
  .refine(
    (s) => s === "" || /^https:/i.test(s) || /^http:\/\/localhost(?::\d+)?/i.test(s),
    "En producción usa https; en local solo http://localhost está permitido",
  );

const saveSchema = z.object({
  n8nWebhookUrl: urlSchema,
});

export async function saveChatbotWebhookAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const url = parsed.data.n8nWebhookUrl;

  try {
    await prisma.chatbotSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", n8nWebhookUrl: url || null },
      update: { n8nWebhookUrl: url || null },
    });
    revalidatePath("/admin/configuracion");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "No se pudo guardar la configuración" };
  }
}

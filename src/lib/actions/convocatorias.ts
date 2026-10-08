"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAction } from "@/lib/auth-helpers";
import { convocatoriaSchema } from "@/lib/convocatoria-schema";
import { prisma } from "@/lib/prisma";

function revalidateConvocatoriaPaths() {
  revalidatePath("/");
  revalidatePath("/admin/personalizar/convocatorias");
}

function writeData(raw: ReturnType<typeof convocatoriaSchema.parse>) {
  return {
    title: raw.title,
    description: raw.description,
    audience: raw.audience,
    type: raw.type,
    deadline: raw.deadline,
    externalUrl: raw.externalUrl,
    published: raw.published,
  };
}

export async function createConvocatoriaAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = convocatoriaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    const row = await prisma.convocatoria.create({ data: writeData(parsed.data) });
    revalidateConvocatoriaPaths();
    return { ok: true as const, id: row.id };
  } catch (e) {
    console.error("createConvocatoriaAction", e);
    return { ok: false as const, error: "No se pudo crear la convocatoria." };
  }
}

export async function updateConvocatoriaAction(id: string, input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  const parsed = convocatoriaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.convocatoria.findUnique({ where: { id } });
  if (!existing) return { ok: false as const, error: "Convocatoria no encontrada." };

  try {
    await prisma.convocatoria.update({ where: { id }, data: writeData(parsed.data) });
    revalidateConvocatoriaPaths();
    return { ok: true as const };
  } catch (e) {
    console.error("updateConvocatoriaAction", id, e);
    return { ok: false as const, error: "No se pudo actualizar la convocatoria." };
  }
}

export async function deleteConvocatoriaAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  try {
    const existing = await prisma.convocatoria.findUnique({ where: { id } });
    if (!existing) return { ok: false as const, error: "Convocatoria no encontrada." };

    await prisma.convocatoria.delete({ where: { id } });
    revalidateConvocatoriaPaths();
    return { ok: true as const };
  } catch (e) {
    console.error("deleteConvocatoriaAction", id, e);
    return { ok: false as const, error: "No se pudo eliminar." };
  }
}

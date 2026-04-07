"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdminAction } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const nameSchema = z.string().trim().min(1, "Nombre requerido").max(64);

const createSchema = z.object({ name: nameSchema });
const updateSchema = z.object({ id: z.string().min(1), name: nameSchema });
const deleteSchema = z.object({ id: z.string().min(1) });

export async function createRoleAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await prisma.role.create({ data: { name: parsed.data.name } });
    revalidatePath("/admin/roles");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "No se pudo crear (¿nombre duplicado?)" };
  }
}

export async function updateRoleAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await prisma.role.update({
      where: { id: parsed.data.id },
      data: { name: parsed.data.name },
    });
    revalidatePath("/admin/roles");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "No se pudo actualizar" };
  }
}

export async function deleteRoleAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Id inválido" };
  }

  const role = await prisma.role.findUnique({
    where: { id: parsed.data.id },
    include: { _count: { select: { users: true } } },
  });
  if (!role) return { ok: false as const, error: "Rol no encontrado" };
  if (role._count.users > 0) {
    return { ok: false as const, error: "Hay usuarios asignados a este rol" };
  }

  await prisma.role.delete({ where: { id: parsed.data.id } });
  revalidatePath("/admin/roles");
  return { ok: true as const };
}

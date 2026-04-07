"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";
import { assertAdminAction } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const accountStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().max(120).optional(),
  password: z.string().min(8, "Mínimo 8 caracteres").max(128),
  roleIds: z.array(z.string()),
});

const updateSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().trim().max(120).optional(),
  password: z.string().max(128).optional(),
  roleIds: z.array(z.string()),
  accountStatus: accountStatusSchema,
});

const deleteSchema = z.object({ id: z.string().min(1) });

const idSchema = z.object({ id: z.string().min(1) });

export async function createUserAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const hash = await bcrypt.hash(parsed.data.password, 12);
  const roleConnect =
    parsed.data.roleIds.length > 0 ? { connect: parsed.data.roleIds.map((id) => ({ id })) } : undefined;
  try {
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name || null,
        password: hash,
        accountStatus: "APPROVED",
        ...(roleConnect ? { roles: roleConnect } : {}),
      },
    });
    revalidatePath("/admin/users");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "No se pudo crear (¿email duplicado?)" };
  }
}

export async function updateUserAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const pwd = parsed.data.password?.trim();
  const data: {
    email: string;
    name: string | null;
    password?: string;
    accountStatus: z.infer<typeof accountStatusSchema>;
    roles: { set: { id: string }[] };
  } = {
    email: parsed.data.email,
    name: parsed.data.name?.trim() || null,
    accountStatus: parsed.data.accountStatus,
    roles: { set: parsed.data.roleIds.map((id) => ({ id })) },
  };

  if (pwd) {
    data.password = await bcrypt.hash(pwd, 12);
  }

  try {
    await prisma.user.update({
      where: { id: parsed.data.id },
      data,
    });
    revalidatePath("/admin/users");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "No se pudo actualizar" };
  }
}

export async function deleteUserAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Id inválido" };
  }

  if (parsed.data.id === gate.user.id) {
    return { ok: false as const, error: "No puedes eliminar tu propio usuario" };
  }

  try {
    await prisma.user.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/users");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "No se pudo eliminar" };
  }
}

export async function approveUserAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Id inválido" };
  }

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: { accountStatus: "APPROVED" },
  });
  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function rejectUserAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Id inválido" };
  }

  if (parsed.data.id === gate.user.id) {
    return { ok: false as const, error: "No puedes rechazar tu propio usuario" };
  }

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: { accountStatus: "REJECTED" },
  });
  revalidatePath("/admin/users");
  return { ok: true as const };
}

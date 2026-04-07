"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email("Correo no válido"),
  name: z.string().trim().max(120).optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(128),
});

export async function registerUserAction(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const taken = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (taken) {
    return { ok: false as const, error: "Ya existe una cuenta con ese correo" };
  }

  const editor = await prisma.role.findUnique({ where: { name: "editor" } });
  if (!editor) {
    return { ok: false as const, error: "El sitio no está configurado para registro (falta el rol editor)." };
  }

  const hash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name?.trim() || null,
      password: hash,
      accountStatus: "PENDING",
      roles: { connect: { id: editor.id } },
    },
  });

  return { ok: true as const };
}

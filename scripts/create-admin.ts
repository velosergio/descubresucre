/**
 * Crea o actualiza un usuario con rol admin (y cuenta aprobada).
 * Ejecuta en terminal interactiva:
 *   npm run admin:create
 */

import "dotenv/config";
import bcrypt from "bcrypt";
import prompts from "prompts";
import { prisma } from "../src/lib/prisma";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

async function main() {
  if (!process.stdin.isTTY) {
    console.error("Ejecuta este comando en una terminal interactiva (no se puede automatizar sin TTY).");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Falta DATABASE_URL en el entorno (p. ej. en .env).");
    process.exit(1);
  }

  const onCancel = () => {
    console.info("\nCancelado.");
    process.exit(0);
  };

  const answers = await prompts(
    [
      {
        type: "text",
        name: "email",
        message: "Correo electrónico",
        validate: (v) => {
          const s = String(v ?? "").trim();
          if (!s) return "El correo es obligatorio";
          if (!isEmail(s)) return "Introduce un correo válido";
          return true;
        },
      },
      {
        type: "password",
        name: "password",
        message: "Contraseña (mín. 8 caracteres)",
        mask: "*",
        validate: (v) => {
          const s = String(v ?? "");
          if (s.length < 8) return "La contraseña debe tener al menos 8 caracteres";
          return true;
        },
      },
      {
        type: "password",
        name: "confirm",
        message: "Confirmar contraseña",
        mask: "*",
        validate: (v) => (String(v ?? "").length > 0 ? true : "Confirma la contraseña"),
      },
    ],
    { onCancel },
  );

  const email = String(answers.email ?? "").trim();
  const password = String(answers.password ?? "");
  const confirm = String(answers.confirm ?? "");

  if (!email || !password || !confirm) {
    onCancel();
  }

  if (password !== confirm) {
    console.error("Las contraseñas no coinciden.");
    process.exit(1);
  }

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  await prisma.role.upsert({
    where: { name: "editor" },
    update: {},
    create: { name: "editor" },
  });

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hash,
      accountStatus: "APPROVED",
      roles: { set: [{ id: adminRole.id }] },
    },
    create: {
      email,
      name: "Administrador",
      password: hash,
      accountStatus: "APPROVED",
      roles: { connect: [{ id: adminRole.id }] },
    },
  });

  console.info("\nUsuario admin listo:", email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

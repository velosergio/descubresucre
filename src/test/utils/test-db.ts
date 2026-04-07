import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

function getDbUrl() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL no está definida.");
  return url;
}

export function createTestPrisma() {
  const adapter = new PrismaMariaDb(getDbUrl());
  return new PrismaClient({ adapter });
}

export async function resetTestDatabase(prisma: PrismaClient) {
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.chatJob.deleteMany();
  await prisma.chatbotSettings.deleteMany();
}

export async function seedBaseRoles(prisma: PrismaClient) {
  const admin = await prisma.role.upsert({
    where: { name: "admin" },
    create: { name: "admin" },
    update: {},
  });
  const editor = await prisma.role.upsert({
    where: { name: "editor" },
    create: { name: "editor" },
    update: {},
  });
  return { admin, editor };
}

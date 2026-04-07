import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL no está definida");
  }
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * En desarrollo no reutilizamos el singleton global: tras `prisma generate` o nuevos modelos,
 * un cliente cacheado puede quedar sin delegados (p. ej. `chatbotSettings`) y falla con
 * "Cannot read properties of undefined (reading 'findUnique')".
 */
export const prisma =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : createPrismaClient();

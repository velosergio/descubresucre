/**
 * Seed de producción: roles + Sucre Natural + Qué hacer.
 * Idempotente (no duplica slugs; no pisa seedManaged=false).
 *
 * Local: npm run db:seed
 * EasyPanel (cwd /app, tras el deploy): node scripts/seed.mjs
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import "dotenv/config";

const bundled = join(dirname(fileURLToPath(import.meta.url)), "seed.prod.mjs");

if (!existsSync(bundled)) {
  console.error(
    "Falta scripts/seed.prod.mjs (se genera en el build Docker). En local usa: npm run db:seed",
  );
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(1);
}

await import(pathToFileURL(bundled).href);

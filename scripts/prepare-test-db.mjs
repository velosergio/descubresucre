import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import process from "node:process";

const testDbUrl = process.env.TEST_DATABASE_URL;
if (!testDbUrl) {
  console.error("Falta TEST_DATABASE_URL. Copia la sección Tests de .env.example a .env.test.");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: testDbUrl };
const require = createRequire(import.meta.url);
const prismaCli = require.resolve("prisma/build/index.js");

function runPrisma(...args) {
  const result = spawnSync(process.execPath, [prismaCli, ...args], {
    stdio: "inherit",
    env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

runPrisma("migrate", "deploy");
runPrisma("db", "seed");

console.info("Base de datos de pruebas lista.");

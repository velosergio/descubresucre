import { spawnSync } from "node:child_process";
import process from "node:process";

const testDbUrl = process.env.TEST_DATABASE_URL;
if (!testDbUrl) {
  console.error("Falta TEST_DATABASE_URL. Define .env.test antes de preparar DB.");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: testDbUrl };

const migrate = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: true,
  env,
});
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

const seed = spawnSync("npm", ["run", "db:seed"], {
  stdio: "inherit",
  shell: true,
  env,
});
if (seed.status !== 0) process.exit(seed.status ?? 1);

console.info("Base de datos de pruebas lista.");

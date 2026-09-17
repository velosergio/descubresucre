/**
 * Empaqueta prisma/seed.ts → scripts/seed.prod.mjs (Node ESM, sin tsx).
 * Lo corre el build Docker; no hace falta ejecutarlo en local.
 */
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outfile = join(root, "scripts/seed.prod.mjs");

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, "prisma/seed.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile,
  legalComments: "none",
  banner: {
    js: 'import { createRequire as __seedCreateRequire } from "node:module";\nconst require = __seedCreateRequire(import.meta.url);',
  },
  external: ["sharp"],
  plugins: [
    {
      name: "seed-prisma-cjs",
      setup(build) {
        build.onResolve({ filter: /^dotenv(\/config)?$/ }, () => ({
          path: "seed-dotenv-stub",
          namespace: "seed-stub",
        }));
        build.onLoad({ filter: /.*/, namespace: "seed-stub" }, () => ({
          contents: "export {}",
          loader: "js",
        }));
        build.onLoad({ filter: /[\\/]src[\\/]lib[\\/]prisma\.ts$/ }, () => ({
          contents: `
            import { createRequire } from "node:module";
            import { fileURLToPath } from "node:url";
            import { PrismaMariaDb } from "@prisma/adapter-mariadb";
            const { PrismaClient } = createRequire(import.meta.url)(
              fileURLToPath(new URL("../src/generated/prisma/index.js", import.meta.url)),
            );
            function createPrismaClient() {
              const url = process.env.DATABASE_URL;
              if (!url) throw new Error("DATABASE_URL no está definida");
              return new PrismaClient({ adapter: new PrismaMariaDb(url) });
            }
            export const prisma = createPrismaClient();
          `,
          loader: "js",
        }));
      },
    },
  ],
});

console.info("Seed de producción generado:", outfile);

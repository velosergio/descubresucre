import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appDir = path.resolve(import.meta.dirname, "../../app");

function readApp(rel: string) {
  return readFileSync(path.join(appDir, rel), "utf8");
}

const FORCE_DYNAMIC = 'export const dynamic = "force-dynamic"';

describe("rutas públicas que consultan Prisma", () => {
  it("optan a render dinámico para que next build no hable con MariaDB (imagen Docker)", () => {
    expect(readApp("page.tsx")).toContain(FORCE_DYNAMIC);
    expect(readApp("sucre-natural/layout.tsx")).toContain(FORCE_DYNAMIC);
    expect(readApp("sitemap.ts")).toContain(FORCE_DYNAMIC);
  });
});

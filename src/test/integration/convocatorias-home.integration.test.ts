import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestPrisma, resetTestDatabase, seedBaseRoles } from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("getConvocatoriasForHome", () => {
  beforeAll(async () => {
    await prisma!.$connect();
  });

  afterAll(async () => {
    await prisma!.$disconnect();
  });

  beforeEach(async () => {
    await resetTestDatabase(prisma!);
    await seedBaseRoles(prisma!);
  });

  it("solo devuelve publicadas vigentes, ordenadas por deadline y createdAt", async () => {
    const now = new Date("2026-10-07T12:00:00.000Z");
    await prisma!.convocatoria.create({
      data: {
        title: "Vencida",
        description: "d",
        audience: "a",
        type: "Arte",
        deadline: new Date("2026-10-01T00:00:00.000Z"),
        externalUrl: "https://a.example/1",
        published: true,
      },
    });
    await prisma!.convocatoria.create({
      data: {
        title: "Borrador",
        description: "d",
        audience: "a",
        type: "Arte",
        deadline: new Date("2026-12-01T00:00:00.000Z"),
        externalUrl: "https://a.example/2",
        published: false,
      },
    });
    await prisma!.convocatoria.create({
      data: {
        title: "Primera mismo día",
        description: "d",
        audience: "a",
        type: "Formación",
        deadline: new Date("2026-11-15T00:00:00.000Z"),
        externalUrl: "https://a.example/4",
        published: true,
        createdAt: new Date("2026-09-01T00:00:00.000Z"),
      },
    });
    await prisma!.convocatoria.create({
      data: {
        title: "Segunda",
        description: "d",
        audience: "a",
        type: "Turismo",
        deadline: new Date("2026-11-15T00:00:00.000Z"),
        externalUrl: "https://a.example/3",
        published: true,
        createdAt: new Date("2026-09-02T00:00:00.000Z"),
      },
    });
    await prisma!.convocatoria.create({
      data: {
        title: "Hoy vigente",
        description: "d",
        audience: "a",
        type: "Música",
        deadline: new Date("2026-10-07T00:00:00.000Z"),
        externalUrl: "https://a.example/5",
        published: true,
      },
    });

    const { getConvocatoriasForHome } = await import("@/lib/get-convocatorias-home");
    const payload = await getConvocatoriasForHome(now);

    expect(payload.items.map((i) => i.title)).toEqual([
      "Hoy vigente",
      "Primera mismo día",
      "Segunda",
    ]);
    expect(payload.items.every((i) => i.externalUrl.startsWith("https://"))).toBe(true);
  });

  it("lista vacía cuando no hay vigentes", async () => {
    const { getConvocatoriasForHome } = await import("@/lib/get-convocatorias-home");
    const payload = await getConvocatoriasForHome(new Date("2026-10-07T12:00:00.000Z"));
    expect(payload).toEqual({ items: [] });
  });
});

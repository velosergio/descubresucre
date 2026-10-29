import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestPrisma, resetTestDatabase, seedBaseRoles } from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";
import { QUE_HACER_TEMAS_SEED } from "../../../prisma/data/que-hacer-temas-seed";
import { seedQueHacer } from "../../../prisma/seed";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("seed Qué hacer", () => {
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

  it("crea un tema por slug canónico y reejecutar no duplica", async () => {
    const expected = QUE_HACER_TEMAS_SEED.length;
    await seedQueHacer(prisma!);
    const acts = await prisma!.queHacerActivity.findMany();
    expect(acts).toHaveLength(expected);
    const slugs = acts.map((a) => a.slug).toSorted();
    expect(slugs).toEqual(QUE_HACER_TEMAS_SEED.map((i) => i.slug).toSorted());
    expect(new Set(slugs).size).toBe(expected);
    expect(acts.every((a) => a.published)).toBe(true);

    await seedQueHacer(prisma!);
    expect(await prisma!.queHacerActivity.count()).toBe(expected);
  });

  it("no pisa contenido si seedManaged es false", async () => {
    await seedQueHacer(prisma!);
    await prisma!.queHacerActivity.update({
      where: { slug: "playas" },
      data: { title: "Editado a mano", seedManaged: false },
    });
    await seedQueHacer(prisma!);
    const row = await prisma!.queHacerActivity.findUnique({ where: { slug: "playas" } });
    expect(row?.title).toBe("Editado a mano");
  });
});

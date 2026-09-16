import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestPrisma, resetTestDatabase, seedBaseRoles } from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";
import { QUE_HACER_SEED_ITEMS } from "../../../prisma/data/que-hacer-seed";
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

  it("crea 5 slugs únicos y reejecutar no duplica", async () => {
    await seedQueHacer(prisma!);
    const acts = await prisma!.queHacerActivity.findMany();
    const cats = await prisma!.queHacerCategory.findMany();
    expect(acts).toHaveLength(5);
    expect(cats).toHaveLength(5);
    const slugs = acts.map((a) => a.slug).toSorted();
    expect(slugs).toEqual(QUE_HACER_SEED_ITEMS.map((i) => i.slug).toSorted());
    expect(new Set(slugs).size).toBe(5);
    expect(acts.every((a) => a.published)).toBe(true);

    await seedQueHacer(prisma!);
    expect(await prisma!.queHacerActivity.count()).toBe(5);
    expect(await prisma!.queHacerCategory.count()).toBe(5);
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

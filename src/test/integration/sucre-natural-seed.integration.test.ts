import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestPrisma, resetTestDatabase, seedBaseRoles } from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";
import { SEED_DESTINATIONS } from "../../../prisma/data/sucre-natural-seed";
import { seedSucreNatural } from "../../../prisma/seed";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("seed Sucre Natural", () => {
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

  it("crea destinos únicos, Mojana una vez, showOnHome false y published true", async () => {
    await seedSucreNatural(prisma!);
    const dests = await prisma!.imperdibleDestination.findMany();
    expect(dests.length).toBeGreaterThanOrEqual(20);
    expect(dests.filter((d) => d.slug === "paisaje-de-la-mojana")).toHaveLength(1);
    expect(dests.every((d) => d.published)).toBe(true);
    expect(dests.every((d) => !d.showOnHome)).toBe(true);
    expect(dests.some((d) => d.slug === "archipielago-de-san-bernardo")).toBe(false);
    const slugs = dests.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(SEED_DESTINATIONS).toHaveLength(24);

    const sanguare = dests.find((d) => d.slug === "reserva-natural-sanguare");
    const hubs = await prisma!.imperdibleDestinationHub.findMany({
      where: { destinationId: sanguare!.id },
    });
    expect(hubs.map((h) => h.hubId).sort()).toEqual(["paisajes", "senderos"]);

    await seedSucreNatural(prisma!);
    expect(await prisma!.imperdibleDestination.count()).toBe(dests.length);
  });

  it("no pisa contenido si seedManaged es false", async () => {
    await seedSucreNatural(prisma!);
    await prisma!.imperdibleDestination.update({
      where: { slug: "playa-el-frances" },
      data: { title: "Editado a mano", seedManaged: false },
    });
    await seedSucreNatural(prisma!);
    const row = await prisma!.imperdibleDestination.findUnique({
      where: { slug: "playa-el-frances" },
    });
    expect(row?.title).toBe("Editado a mano");
  });
});

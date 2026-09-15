import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTestPrisma,
  resetTestDatabase,
  seedBaseRoles,
  seedSucreNaturalHubs,
} from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("lecturas públicas Sucre Natural", () => {
  beforeAll(async () => {
    await prisma!.$connect();
  });

  afterAll(async () => {
    await prisma!.$disconnect();
  });

  beforeEach(async () => {
    await resetTestDatabase(prisma!);
    await seedBaseRoles(prisma!);
    await seedSucreNaturalHubs(prisma!);
    vi.resetModules();
  });

  it("lista destinos publicados de un hub válido", async () => {
    await prisma!.imperdibleDestination.create({
      data: {
        slug: "playa-el-frances",
        title: "Playa El Francés",
        subtitle: "Arena blanca",
        bodyMarkdown: "",
        published: true,
        municipality: "Tolú",
        hubs: { create: { hubId: "playas" } },
      },
    });
    const { getHubPage } = await import("@/lib/get-sucre-natural-public");
    const page = await getHubPage("playas");
    expect(page).not.toBeNull();
    expect(page?.destinations.map((d) => d.slug)).toContain("playa-el-frances");
  });

  it("hub id inválido es 404 conceptual", async () => {
    const { getHubPage } = await import("@/lib/get-sucre-natural-public");
    expect(await getHubPage("playa")).toBeNull();
    expect(await getHubPage("archipielago")).toBeNull();
  });

  it("destino unpublished no aparece en detalle público", async () => {
    await prisma!.imperdibleDestination.create({
      data: {
        slug: "oculto",
        title: "Oculto",
        subtitle: "No",
        bodyMarkdown: "",
        published: false,
        municipality: "Tolú",
        hubs: { create: { hubId: "playas" } },
      },
    });
    const { getImperdibleBySlug } = await import("@/lib/get-imperdible-detail");
    const { getHubPage } = await import("@/lib/get-sucre-natural-public");
    expect(await getImperdibleBySlug("oculto")).toBeNull();
    const page = await getHubPage("playas");
    expect(page?.destinations.map((d) => d.slug)).not.toContain("oculto");
  });
});

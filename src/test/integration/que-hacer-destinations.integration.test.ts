import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTestPrisma,
  ensureQueHacerTestPhoto,
  QUE_HACER_TEST_PHOTO_URL,
  resetTestDatabase,
  seedBaseRoles,
  seedSucreNaturalHubs,
} from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("Qué hacer destinos publicados", () => {
  beforeAll(async () => {
    await prisma!.$connect();
    await ensureQueHacerTestPhoto();
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

  it("omite destinos unpublished y lista actividades visibles en el destino", async () => {
    const pub = await prisma!.imperdibleDestination.create({
      data: {
        slug: "playa-viva",
        title: "Playa viva",
        subtitle: "Sí",
        bodyMarkdown: "",
        published: true,
        municipality: "Tolú",
        hubs: { create: { hubId: "playas" } },
      },
    });
    const hidden = await prisma!.imperdibleDestination.create({
      data: {
        slug: "playa-oculta",
        title: "Playa oculta",
        subtitle: "No",
        bodyMarkdown: "",
        published: false,
        municipality: "Tolú",
        hubs: { create: { hubId: "playas" } },
      },
    });
    await prisma!.queHacerActivity.create({
      data: {
        slug: "careteo",
        title: "Careteo",
        description: "Aguas claras",
        iconKey: "waves",
        published: true,
        photos: { create: { publicUrl: QUE_HACER_TEST_PHOTO_URL, sortOrder: 0, isCover: true } },
        destinations: {
          create: [
            { destinationId: pub.id, sortOrder: 0 },
            { destinationId: hidden.id, sortOrder: 1 },
          ],
        },
      },
    });

    const { getQueHacerBySlug } = await import("@/lib/get-que-hacer-detail");
    const { getImperdibleBySlug } = await import("@/lib/get-imperdible-detail");
    const detail = await getQueHacerBySlug("careteo");
    expect(detail?.destinations.map((d) => d.slug)).toEqual(["playa-viva"]);

    const dest = await getImperdibleBySlug("playa-viva");
    expect(dest?.queHacerActivities.map((a) => a.slug)).toEqual(["careteo"]);
    expect(dest?.liveActivities).toEqual([]);
  });
});

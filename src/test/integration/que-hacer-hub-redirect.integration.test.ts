import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTestPrisma,
  ensureQueHacerTestPhoto,
  QUE_HACER_TEST_PHOTO_URL,
  resetTestDatabase,
  seedBaseRoles,
} from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("legacy hub → que-hacer slug", () => {
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
    vi.resetModules();
  });

  it("mapa 1:1 y actividad publicada resoluble por slug canónico", async () => {
    const { legacyHubIdToQueHacerSlug } = await import("@/lib/que-hacer-hub-legacy");
    expect(legacyHubIdToQueHacerSlug("playas")).toBe("playas");
    expect(legacyHubIdToQueHacerSlug("x")).toBeNull();

    await prisma!.queHacerActivity.create({
      data: {
        slug: "playas",
        title: "Playas de Sucre",
        description: "Costa",
        iconKey: "waves",
        listingMode: "DESTINATIONS",
        published: true,
        photos: { create: { publicUrl: QUE_HACER_TEST_PHOTO_URL, sortOrder: 0, isCover: true } },
      },
    });
    const { getQueHacerBySlug } = await import("@/lib/get-que-hacer-detail");
    const detail = await getQueHacerBySlug("playas");
    expect(detail?.title).toBe("Playas de Sucre");

    await prisma!.queHacerActivity.update({
      where: { slug: "playas" },
      data: { published: false },
    });
    expect(await getQueHacerBySlug("playas")).toBeNull();
  });
});

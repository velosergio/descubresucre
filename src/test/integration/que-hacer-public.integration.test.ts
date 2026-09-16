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

describeIfDb("lecturas públicas Qué hacer", () => {
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

  it("home solo incluye publicadas con foto viva", async () => {
    await prisma!.queHacerActivity.create({
      data: {
        slug: "playas",
        title: "Playas",
        description: "Costa",
        iconKey: "waves",
        published: true,
        sortOrder: 1,
        photos: { create: { publicUrl: QUE_HACER_TEST_PHOTO_URL, sortOrder: 0, isCover: true } },
      },
    });
    await prisma!.queHacerActivity.create({
      data: {
        slug: "borrador",
        title: "Borrador",
        description: "No",
        iconKey: "heart",
        published: false,
        sortOrder: 2,
        photos: { create: { publicUrl: QUE_HACER_TEST_PHOTO_URL, sortOrder: 0, isCover: true } },
      },
    });
    await prisma!.queHacerActivity.create({
      data: {
        slug: "huerfana",
        title: "Huérfana",
        description: "Sin disco",
        iconKey: "palette",
        published: true,
        sortOrder: 3,
        photos: {
          create: {
            publicUrl: "/uploads/gallery/images/no-existe.webp",
            sortOrder: 0,
            isCover: true,
          },
        },
      },
    });
    const { getQueHacerForHome } = await import("@/lib/get-que-hacer-home");
    const home = await getQueHacerForHome();
    expect(home.items.map((i) => i.slug)).toEqual(["playas"]);
    expect(home.useCardCarousel).toBe(false);
  });

  it("slug despublicado o sin fotos vivas es 404 conceptual", async () => {
    await prisma!.queHacerActivity.create({
      data: {
        slug: "oculto",
        title: "Oculto",
        description: "No",
        iconKey: "compass",
        published: false,
        photos: { create: { publicUrl: QUE_HACER_TEST_PHOTO_URL, sortOrder: 0, isCover: true } },
      },
    });
    const { getQueHacerBySlug } = await import("@/lib/get-que-hacer-detail");
    expect(await getQueHacerBySlug("oculto")).toBeNull();
    expect(await getQueHacerBySlug("no-existe")).toBeNull();
  });
});

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
const revalidatePathMock = vi.fn();
const assertAdminActionMock = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/lib/auth-helpers", () => ({ assertAdminAction: assertAdminActionMock }));

describeIfDb("admin Qué hacer actividades", () => {
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
    revalidatePathMock.mockReset();
    assertAdminActionMock.mockResolvedValue({
      ok: true,
      user: { id: "admin-user", accountStatus: "APPROVED", roles: [{ name: "admin" }] },
      session: { user: { id: "admin-user" } },
    });
    vi.resetModules();
  });

  it("crea, despublica, borra; rechaza publicar sin foto; seedManaged pasa a false", async () => {
    const seeded = await prisma!.queHacerActivity.create({
      data: {
        slug: "seeded",
        title: "Seeded",
        description: "Seed",
        iconKey: "waves",
        published: true,
        seedManaged: true,
        photos: { create: { publicUrl: QUE_HACER_TEST_PHOTO_URL, sortOrder: 0, isCover: true } },
      },
    });

    const {
      createQueHacerActivityAction,
      updateQueHacerActivityAction,
      deleteQueHacerActivityAction,
    } = await import("@/lib/actions/que-hacer");

    const noPhoto = await createQueHacerActivityAction({
      title: "Sin foto",
      description: "Debe fallar",
      iconKey: "heart",
      listingMode: "DESTINATIONS",
      published: true,
      sortOrder: 0,
      photoUrls: [],
    });
    expect(noPhoto.ok).toBe(false);
    if (!noPhoto.ok) expect(noPhoto.error).toMatch(/foto/i);

    const created = await createQueHacerActivityAction({
      title: "Kayak",
      description: "Remar en ciénaga",
      slug: "kayak",
      iconKey: "sailboat",
      listingMode: "DESTINATIONS",
      published: true,
      sortOrder: 2,
      photoUrls: [QUE_HACER_TEST_PHOTO_URL],
    });
    expect(created.ok).toBe(true);
    const row = await prisma!.queHacerActivity.findUnique({ where: { slug: "kayak" } });
    expect(row?.seedManaged).toBe(false);
    expect(revalidatePathMock.mock.calls.some((c) => c[0] === "/")).toBe(true);
    expect(revalidatePathMock.mock.calls.some((c) => c[0] === "/que-hacer/kayak")).toBe(true);

    const unpublished = await updateQueHacerActivityAction(row!.id, {
      title: "Kayak",
      description: "Remar en ciénaga",
      slug: "kayak",
      iconKey: "sailboat",
      listingMode: "DESTINATIONS",
      published: false,
      sortOrder: 2,
      photoUrls: [QUE_HACER_TEST_PHOTO_URL],
    });
    expect(unpublished.ok).toBe(true);

    const editedSeed = await updateQueHacerActivityAction(seeded.id, {
      title: "Seeded editada",
      description: "Seed",
      slug: "seeded",
      iconKey: "waves",
      listingMode: "DESTINATIONS",
      published: true,
      sortOrder: 0,
      photoUrls: [QUE_HACER_TEST_PHOTO_URL],
    });
    expect(editedSeed.ok).toBe(true);
    const after = await prisma!.queHacerActivity.findUnique({ where: { id: seeded.id } });
    expect(after?.seedManaged).toBe(false);
    expect(after?.title).toBe("Seeded editada");

    const deleted = await deleteQueHacerActivityAction(row!.id);
    expect(deleted.ok).toBe(true);
    expect(await prisma!.queHacerActivity.findUnique({ where: { slug: "kayak" } })).toBeNull();
  });
});

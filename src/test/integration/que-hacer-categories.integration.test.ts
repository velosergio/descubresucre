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
const revalidatePathMock = vi.fn();
const assertAdminActionMock = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/lib/auth-helpers", () => ({ assertAdminAction: assertAdminActionMock }));

describeIfDb("Qué hacer categorías M-N", () => {
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
    revalidatePathMock.mockReset();
    assertAdminActionMock.mockResolvedValue({
      ok: true,
      user: { id: "admin-user", accountStatus: "APPROVED", roles: [{ name: "admin" }] },
      session: { user: { id: "admin-user" } },
    });
    vi.resetModules();
  });

  it("actividad en 2 categorías, destino en 1; borrar categoría conserva filas", async () => {
    const {
      createQueHacerCategoryAction,
      deleteQueHacerCategoryAction,
      createQueHacerActivityAction,
    } = await import("@/lib/actions/que-hacer");
    const { createImperdibleDestinationAction } = await import("@/lib/actions/imperdibles");

    const c1 = await createQueHacerCategoryAction({ name: "Mar", slug: "mar", sortOrder: 1 });
    const c2 = await createQueHacerCategoryAction({ name: "Tierra", slug: "tierra", sortOrder: 2 });
    expect(c1.ok && c2.ok).toBe(true);
    const catMar = await prisma!.queHacerCategory.findUnique({ where: { slug: "mar" } });
    const catTierra = await prisma!.queHacerCategory.findUnique({ where: { slug: "tierra" } });

    const dest = await createImperdibleDestinationAction({
      title: "Tolú",
      subtitle: "Golfo",
      slug: "tolu-qh",
      published: true,
      showOnHome: false,
      hubIds: ["playas"],
      municipality: "Tolú",
      bodyMarkdown: "",
      queHacerCategoryIds: [catMar!.id],
    });
    expect(dest.ok).toBe(true);
    const destRow = await prisma!.imperdibleDestination.findUnique({ where: { slug: "tolu-qh" } });

    const act = await createQueHacerActivityAction({
      title: "Snorkel",
      description: "Arrecife",
      slug: "snorkel",
      iconKey: "fish",
      published: true,
      photoUrls: [QUE_HACER_TEST_PHOTO_URL],
      categoryIds: [catMar!.id, catTierra!.id],
    });
    expect(act.ok).toBe(true);
    const actRow = await prisma!.queHacerActivity.findUnique({
      where: { slug: "snorkel" },
      include: { categories: true },
    });
    expect(actRow?.categories).toHaveLength(2);

    const joinsDest = await prisma!.queHacerDestinationOnCategory.findMany({
      where: { destinationId: destRow!.id },
    });
    expect(joinsDest).toHaveLength(1);

    const deleted = await deleteQueHacerCategoryAction(catMar!.id);
    expect(deleted.ok).toBe(true);
    expect(
      await prisma!.queHacerActivity.findUnique({ where: { slug: "snorkel" } }),
    ).not.toBeNull();
    expect(
      await prisma!.imperdibleDestination.findUnique({ where: { slug: "tolu-qh" } }),
    ).not.toBeNull();
    expect(await prisma!.queHacerCategory.findUnique({ where: { slug: "mar" } })).toBeNull();
  });
});

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

describeIfDb("Qué hacer asociación dual actividad↔destino", () => {
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

  it("asocia destino desde actividad y desde destino; borrar categoría legado no borra filas", async () => {
    const {
      createQueHacerCategoryAction,
      deleteQueHacerCategoryAction,
      createQueHacerActivityAction,
    } = await import("@/lib/actions/que-hacer");
    const { createImperdibleDestinationAction, updateImperdibleDestinationAction } = await import(
      "@/lib/actions/imperdibles"
    );

    const c1 = await createQueHacerCategoryAction({ name: "Mar", slug: "mar", sortOrder: 1 });
    expect(c1.ok).toBe(true);
    const catMar = await prisma!.queHacerCategory.findUnique({ where: { slug: "mar" } });

    const act = await createQueHacerActivityAction({
      title: "Snorkel",
      description: "Arrecife",
      slug: "snorkel",
      iconKey: "fish",
      listingMode: "DESTINATIONS",
      published: true,
      photoUrls: [QUE_HACER_TEST_PHOTO_URL],
      destinationIds: [],
    });
    expect(act.ok).toBe(true);
    const actRow = await prisma!.queHacerActivity.findUnique({ where: { slug: "snorkel" } });

    const dest = await createImperdibleDestinationAction({
      title: "Tolú",
      subtitle: "Golfo",
      slug: "tolu-qh",
      published: true,
      showOnHome: false,
      activityIds: [actRow!.id],
      municipality: "Tolú",
      bodyMarkdown: "",
    });
    expect(dest.ok).toBe(true);
    const destRow = await prisma!.imperdibleDestination.findUnique({
      where: { slug: "tolu-qh" },
      include: { queHacerActivities: true },
    });
    expect(destRow?.queHacerActivities).toHaveLength(1);
    expect(destRow?.queHacerActivities[0]?.activityId).toBe(actRow!.id);

    const cleared = await updateImperdibleDestinationAction(destRow!.id, {
      title: "Tolú",
      subtitle: "Golfo",
      slug: "tolu-qh",
      published: true,
      showOnHome: false,
      activityIds: [],
      municipality: "Tolú",
      bodyMarkdown: "",
    });
    expect(cleared.ok).toBe(true);
    expect(
      await prisma!.queHacerActivityOnDestination.count({ where: { destinationId: destRow!.id } }),
    ).toBe(0);

    const deleted = await deleteQueHacerCategoryAction(catMar!.id);
    expect(deleted.ok).toBe(true);
    expect(
      await prisma!.queHacerActivity.findUnique({ where: { slug: "snorkel" } }),
    ).not.toBeNull();
    expect(
      await prisma!.imperdibleDestination.findUnique({ where: { slug: "tolu-qh" } }),
    ).not.toBeNull();
  });
});

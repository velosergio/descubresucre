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
const revalidatePathMock = vi.fn();
const assertAdminActionMock = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/lib/auth-helpers", () => ({ assertAdminAction: assertAdminActionMock }));

const experiencePayload = {
  slug: "buceo-y-careteo",
  title: "Buceo y careteo",
  tagline: "Un mundo de color bajo el mar",
  whereText: "Archipiélago de San Bernardo (Parques Nacionales Naturales).",
  whatYouDo: ["Explorar arrecifes"],
  specialWhy: "Aguas cálidas.",
  recommendations: ["Respeta los corales."],
  published: true,
  destinationIds: [] as string[],
};

describeIfDb("CRUD experiencias Sucre Natural", () => {
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
    revalidatePathMock.mockReset();
    assertAdminActionMock.mockResolvedValue({
      ok: true,
      user: { id: "admin-user", accountStatus: "APPROVED", roles: [{ name: "admin" }] },
      session: { user: { id: "admin-user" } },
    });
    vi.resetModules();
  });

  it("crea experiencia sin destinos, muestra whereText y 404 si unpublished", async () => {
    const { createNatureExperienceAction, updateNatureExperienceAction } = await import(
      "@/lib/actions/sucre-natural"
    );
    const created = await createNatureExperienceAction(experiencePayload);
    expect(created.ok).toBe(true);

    const { getExperienceBySlug } = await import("@/lib/get-sucre-natural-public");
    const publicRow = await getExperienceBySlug("buceo-y-careteo");
    expect(publicRow?.whereText).toContain("San Bernardo");
    expect(publicRow?.destinations).toEqual([]);

    const row = await prisma!.natureExperience.findUnique({ where: { slug: "buceo-y-careteo" } });
    const unpublished = await updateNatureExperienceAction(row!.id, {
      ...experiencePayload,
      published: false,
    });
    expect(unpublished.ok).toBe(true);
    vi.resetModules();
    const { getExperienceBySlug: getAfter } = await import("@/lib/get-sucre-natural-public");
    expect(await getAfter("buceo-y-careteo")).toBeNull();
  });
});

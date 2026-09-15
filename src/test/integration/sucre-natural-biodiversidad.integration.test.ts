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

const speciesPayload = {
  slug: "titi-cabeciblanco",
  kind: "FAUNA",
  groupKey: "mamiferos",
  commonName: "Tití cabeciblanco",
  scientificName: "Saguinus oedipus",
  summary: "Primate endémico.",
  published: true,
  destinationIds: [] as string[],
};

describeIfDb("CRUD biodiversidad Sucre Natural", () => {
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

  it("crea, despublica y oculta en público", async () => {
    const dest = await prisma!.imperdibleDestination.create({
      data: {
        slug: "reserva-natural-sanguare",
        title: "Sanguaré",
        subtitle: "x",
        bodyMarkdown: "",
        published: true,
        municipality: "San Onofre",
      },
    });
    const { createBiodiversityEntryAction, updateBiodiversityEntryAction } = await import(
      "@/lib/actions/sucre-natural"
    );
    const created = await createBiodiversityEntryAction({
      ...speciesPayload,
      destinationIds: [dest.id],
    });
    expect(created.ok).toBe(true);

    const { getBiodiversityBySlug, getBiodiversityHub } = await import(
      "@/lib/get-sucre-natural-public"
    );
    const publicRow = await getBiodiversityBySlug("titi-cabeciblanco");
    expect(publicRow?.commonName).toBe("Tití cabeciblanco");
    expect(publicRow?.destinations.some((d) => d.slug === "reserva-natural-sanguare")).toBe(true);
    expect((await getBiodiversityHub()).some((s) => s.slug === "titi-cabeciblanco")).toBe(true);

    const row = await prisma!.biodiversityEntry.findUnique({
      where: { slug: "titi-cabeciblanco" },
    });
    const unpublished = await updateBiodiversityEntryAction(row!.id, {
      ...speciesPayload,
      published: false,
      destinationIds: [dest.id],
    });
    expect(unpublished.ok).toBe(true);
    vi.resetModules();
    const { getBiodiversityBySlug: getBySlugAfter } = await import(
      "@/lib/get-sucre-natural-public"
    );
    expect(await getBySlugAfter("titi-cabeciblanco")).toBeNull();
  });
});

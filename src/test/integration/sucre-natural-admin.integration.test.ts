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

describeIfDb("admin Sucre Natural destinos", () => {
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

  it("crea, despublica y revalida /sucre-natural; seedManaged pasa a false", async () => {
    const seeded = await prisma!.imperdibleDestination.create({
      data: {
        slug: "playa-seed",
        title: "Playa seed",
        subtitle: "Seed",
        bodyMarkdown: "",
        published: true,
        showOnHome: false,
        seedManaged: true,
        municipality: "Tolú",
        hubs: { create: { hubId: "playas" } },
      },
    });
    const { updateImperdibleDestinationAction, createImperdibleDestinationAction } = await import(
      "@/lib/actions/imperdibles"
    );

    const created = await createImperdibleDestinationAction({
      title: "Playa prueba",
      subtitle: "Test",
      slug: "playa-prueba",
      published: true,
      showOnHome: false,
      hubIds: ["playas"],
      municipality: "Tolú",
      bodyMarkdown: "",
    });
    expect(created.ok).toBe(true);
    const row = await prisma!.imperdibleDestination.findUnique({ where: { slug: "playa-prueba" } });
    expect(row?.seedManaged).toBe(false);

    const unpublished = await updateImperdibleDestinationAction(row!.id, {
      title: "Playa prueba",
      subtitle: "Test",
      slug: "playa-prueba",
      published: false,
      showOnHome: false,
      hubIds: ["playas"],
      municipality: "Tolú",
      bodyMarkdown: "",
    });
    expect(unpublished.ok).toBe(true);
    expect(revalidatePathMock.mock.calls.some((c) => c[0] === "/sucre-natural")).toBe(true);

    const edited = await updateImperdibleDestinationAction(seeded.id, {
      title: "Playa seed editada",
      subtitle: "Seed",
      slug: "playa-seed",
      published: true,
      showOnHome: false,
      hubIds: ["playas"],
      municipality: "Tolú",
      bodyMarkdown: "",
    });
    expect(edited.ok).toBe(true);
    const after = await prisma!.imperdibleDestination.findUnique({ where: { id: seeded.id } });
    expect(after?.seedManaged).toBe(false);
  });

  it("respeta el tope de 20 destinos destacados en home", async () => {
    for (let i = 0; i < 20; i += 1) {
      await prisma!.imperdibleDestination.create({
        data: {
          slug: `destacado-${i}`,
          title: `Destacado ${i}`,
          subtitle: "x",
          bodyMarkdown: "",
          published: true,
          showOnHome: true,
          municipality: "Tolú",
        },
      });
    }
    const { createImperdibleDestinationAction } = await import("@/lib/actions/imperdibles");
    const res = await createImperdibleDestinationAction({
      title: "Extra home",
      subtitle: "x",
      slug: "extra-home",
      published: true,
      showOnHome: true,
      hubIds: ["playas"],
      municipality: "Tolú",
      bodyMarkdown: "",
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toContain("20 destinos");
    }
  });
});

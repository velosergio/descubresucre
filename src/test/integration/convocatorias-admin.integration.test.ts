import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestPrisma, resetTestDatabase, seedBaseRoles } from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;
const revalidatePathMock = vi.fn();
const assertAdminActionMock = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/lib/auth-helpers", () => ({ assertAdminAction: assertAdminActionMock }));

function mockAuthorized() {
  assertAdminActionMock.mockResolvedValue({
    ok: true,
    user: { id: "admin-user", accountStatus: "APPROVED", roles: [{ name: "admin" }] },
    session: { user: { id: "admin-user" } },
  });
}

const baseInput = {
  title: "Convocatoria E2E",
  description: "Descripción",
  audience: "Gestores culturales",
  type: "Formación",
  deadline: "2026-12-20T00:00:00.000Z",
  externalUrl: "https://ejemplo.gov.co/convocatoria",
  published: true,
};

describeIfDb("server actions admin — convocatorias", () => {
  beforeAll(async () => {
    await prisma!.$connect();
  });

  afterAll(async () => {
    await prisma!.$disconnect();
  });

  beforeEach(async () => {
    await resetTestDatabase(prisma!);
    await seedBaseRoles(prisma!);
    revalidatePathMock.mockReset();
    assertAdminActionMock.mockReset();
    vi.resetModules();
  });

  it("sin sesión de staff: rechaza crear/editar/eliminar sin modificar datos", async () => {
    assertAdminActionMock.mockResolvedValue({ ok: false, error: "No autorizado." });
    const { createConvocatoriaAction, updateConvocatoriaAction, deleteConvocatoriaAction } =
      await import("@/lib/actions/convocatorias");

    const createRes = await createConvocatoriaAction(baseInput);
    expect(createRes).toEqual({ ok: false, error: "No autorizado." });

    const existing = await prisma!.convocatoria.create({
      data: {
        title: "Original",
        description: "d",
        audience: "a",
        type: "Arte",
        deadline: new Date("2026-11-01T00:00:00.000Z"),
        externalUrl: "https://ejemplo.gov.co/a",
      },
    });

    const updateRes = await updateConvocatoriaAction(existing.id, {
      ...baseInput,
      title: "Cambiado",
    });
    expect(updateRes).toEqual({ ok: false, error: "No autorizado." });

    const deleteRes = await deleteConvocatoriaAction(existing.id);
    expect(deleteRes).toEqual({ ok: false, error: "No autorizado." });

    const unchanged = await prisma!.convocatoria.findUnique({ where: { id: existing.id } });
    expect(unchanged?.title).toBe("Original");
    expect(await prisma!.convocatoria.count()).toBe(1);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("create/update/delete persisten y revalidan; vencida no aparece en home", async () => {
    mockAuthorized();
    const { createConvocatoriaAction, updateConvocatoriaAction, deleteConvocatoriaAction } =
      await import("@/lib/actions/convocatorias");
    const { getConvocatoriasForHome } = await import("@/lib/get-convocatorias-home");

    const createRes = await createConvocatoriaAction(baseInput);
    expect(createRes.ok).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/personalizar/convocatorias");

    const row = await prisma!.convocatoria.findFirst({ where: { title: "Convocatoria E2E" } });
    expect(row?.externalUrl).toBe(baseInput.externalUrl);
    expect(row?.deadline.toISOString()).toBe("2026-12-20T00:00:00.000Z");

    const homeOpen = await getConvocatoriasForHome(new Date("2026-10-07T12:00:00.000Z"));
    expect(homeOpen.items.some((i) => i.title === "Convocatoria E2E")).toBe(true);

    revalidatePathMock.mockClear();
    const updateRes = await updateConvocatoriaAction(row!.id, {
      ...baseInput,
      externalUrl: "https://ejemplo.gov.co/nuevo",
      deadline: "2026-01-01T00:00:00.000Z",
      published: true,
    });
    expect(updateRes.ok).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/personalizar/convocatorias");

    const homeClosed = await getConvocatoriasForHome(new Date("2026-10-07T12:00:00.000Z"));
    expect(homeClosed.items.some((i) => i.id === row!.id)).toBe(false);

    revalidatePathMock.mockClear();
    const deleteRes = await deleteConvocatoriaAction(row!.id);
    expect(deleteRes.ok).toBe(true);
    expect(await prisma!.convocatoria.findUnique({ where: { id: row!.id } })).toBeNull();
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/personalizar/convocatorias");
  });
});

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

describeIfDb("server actions admin — eventos y agenda cultural", () => {
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
    const { createCulturalEventAction, updateCulturalEventAction, deleteCulturalEventAction } =
      await import("@/lib/actions/cultural-events");

    const createRes = await createCulturalEventAction({
      title: "Evento",
      description: "Desc",
      category: "Música",
      location: "Sincelejo",
      startsAt: "2026-10-15T20:00:00.000Z",
    });
    expect(createRes).toEqual({ ok: false, error: "No autorizado." });

    const existing = await prisma!.culturalEvent.create({
      data: {
        title: "Original",
        description: "Desc",
        category: "Arte",
        location: "Tolú",
        startsAt: new Date("2026-10-05T00:00:00.000Z"),
      },
    });

    const updateRes = await updateCulturalEventAction(existing.id, {
      title: "Cambiado",
      description: "Desc",
      category: "Arte",
      location: "Tolú",
      startsAt: "2026-11-05T00:00:00.000Z",
    });
    expect(updateRes).toEqual({ ok: false, error: "No autorizado." });

    const deleteRes = await deleteCulturalEventAction(existing.id);
    expect(deleteRes).toEqual({ ok: false, error: "No autorizado." });

    const unchanged = await prisma!.culturalEvent.findUnique({ where: { id: existing.id } });
    expect(unchanged?.title).toBe("Original");
    expect(await prisma!.culturalEvent.count()).toBe(1);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("createCulturalEventAction persiste todos los campos y revalida", async () => {
    mockAuthorized();
    const { createCulturalEventAction } = await import("@/lib/actions/cultural-events");

    const res = await createCulturalEventAction({
      title: "Festival de Octubre",
      description: "Una gran fiesta",
      category: "Música",
      location: "Sincelejo",
      startsAt: "2026-10-15T20:00:00.000Z",
      endsAt: "2026-10-18T00:00:00.000Z",
      allDay: false,
      imageUrl: "/uploads/gallery/images/evento.webp",
      mapLat: 9.3,
      mapLng: -75.4,
      published: true,
    });
    expect(res.ok).toBe(true);

    const row = await prisma!.culturalEvent.findFirst({ where: { title: "Festival de Octubre" } });
    expect(row).not.toBeNull();
    expect(row?.description).toBe("Una gran fiesta");
    expect(row?.category).toBe("Música");
    expect(row?.location).toBe("Sincelejo");
    expect(row?.endsAt?.toISOString()).toBe("2026-10-18T00:00:00.000Z");
    expect(row?.allDay).toBe(false);
    expect(row?.imageUrl).toBe("/uploads/gallery/images/evento.webp");
    expect(Number(row?.mapLat)).toBeCloseTo(9.3);
    expect(Number(row?.mapLng)).toBeCloseTo(-75.4);
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/personalizar/eventos");
  });

  it("rechaza crear sin campos obligatorios", async () => {
    mockAuthorized();
    const { createCulturalEventAction } = await import("@/lib/actions/cultural-events");
    const res = await createCulturalEventAction({
      title: "",
      description: "",
      category: "",
      location: "",
      startsAt: undefined,
    });
    expect(res.ok).toBe(false);
    expect(await prisma!.culturalEvent.count()).toBe(0);
  });

  it("updateCulturalEventAction mueve el evento de mes", async () => {
    mockAuthorized();
    const created = await prisma!.culturalEvent.create({
      data: {
        title: "Evento",
        description: "Desc",
        category: "Arte",
        location: "Tolú",
        startsAt: new Date("2026-10-05T00:00:00.000Z"),
      },
    });

    const { updateCulturalEventAction } = await import("@/lib/actions/cultural-events");
    const res = await updateCulturalEventAction(created.id, {
      title: "Evento",
      description: "Desc",
      category: "Arte",
      location: "Tolú",
      startsAt: "2026-11-20T00:00:00.000Z",
    });
    expect(res.ok).toBe(true);

    const updated = await prisma!.culturalEvent.findUnique({ where: { id: created.id } });
    expect(updated?.startsAt.toISOString()).toBe("2026-11-20T00:00:00.000Z");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/personalizar/eventos");
  });

  it("deleteCulturalEventAction elimina el evento", async () => {
    mockAuthorized();
    const created = await prisma!.culturalEvent.create({
      data: {
        title: "Evento",
        description: "Desc",
        category: "Arte",
        location: "Tolú",
        startsAt: new Date("2026-10-05T00:00:00.000Z"),
      },
    });

    const { deleteCulturalEventAction } = await import("@/lib/actions/cultural-events");
    const res = await deleteCulturalEventAction(created.id);
    expect(res.ok).toBe(true);
    expect(await prisma!.culturalEvent.findUnique({ where: { id: created.id } })).toBeNull();
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/personalizar/eventos");
  });
});

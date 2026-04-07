import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const findUniqueMock = vi.fn();
const redirectMock = vi.fn((to: string) => {
  throw new Error(`REDIRECT:${to}`);
});

vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: findUniqueMock },
  },
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

describe("auth helpers RBAC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requireStaffSession redirige a login sin sesión", async () => {
    authMock.mockResolvedValue(null);
    const mod = await import("@/lib/auth-helpers");
    await expect(mod.requireStaffSession()).rejects.toThrow("REDIRECT:/login?callbackUrl=/admin");
  });

  it("requireAdminSession permite admin aprobado", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    findUniqueMock.mockResolvedValue({
      id: "u1",
      accountStatus: "APPROVED",
      roles: [{ name: "admin" }],
    });
    const mod = await import("@/lib/auth-helpers");
    const out = await mod.requireAdminSession();
    expect(out.user.id).toBe("u1");
  });

  it("assertAdminAction rechaza usuarios no admin", async () => {
    authMock.mockResolvedValue({ user: { id: "u2" } });
    findUniqueMock.mockResolvedValue({
      id: "u2",
      accountStatus: "APPROVED",
      roles: [{ name: "editor" }],
    });
    const mod = await import("@/lib/auth-helpers");
    const out = await mod.assertAdminAction();
    expect(out).toEqual({ ok: false, error: "Solo administradores" });
  });
});

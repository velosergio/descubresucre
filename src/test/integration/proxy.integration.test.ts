import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getTokenMock = vi.fn();
vi.mock("next-auth/jwt", () => ({ getToken: getTokenMock }));

describe("proxy auth guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AUTH_SECRET = "test-auth";
  });

  it("redirige /admin a login cuando no hay token", async () => {
    getTokenMock.mockResolvedValue(null);
    const { proxy } = await import("@/proxy");
    const req = new NextRequest("http://localhost:3000/admin/users");
    const response = await proxy(req);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login?callbackUrl=%2Fadmin%2Fusers");
  });

  it("permite /admin cuando hay token", async () => {
    getTokenMock.mockResolvedValue({ sub: "user-1" });
    const { proxy } = await import("@/proxy");
    const req = new NextRequest("http://localhost:3000/admin");
    const response = await proxy(req);
    expect(response.status).toBe(200);
  });
});

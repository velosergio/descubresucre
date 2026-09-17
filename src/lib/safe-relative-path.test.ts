import { describe, expect, it } from "vitest";
import { safeAuthRedirectUrl, safeRelativePath } from "@/lib/safe-relative-path";

describe("safeRelativePath", () => {
  it("acepta rutas internas con query y hash", () => {
    expect(safeRelativePath("/admin")).toBe("/admin");
    expect(safeRelativePath("/admin/users?tab=roles")).toBe("/admin/users?tab=roles");
    expect(safeRelativePath("/cuenta/pendiente#aviso")).toBe("/cuenta/pendiente#aviso");
  });

  it("rechaza valores vacíos, absolutos y protocol-relative", () => {
    expect(safeRelativePath(null)).toBeNull();
    expect(safeRelativePath("")).toBeNull();
    expect(safeRelativePath("admin")).toBeNull();
    expect(safeRelativePath("https://evil.example/phish")).toBeNull();
    expect(safeRelativePath("//evil.example/phish")).toBeNull();
    expect(safeRelativePath("/\\evil.example")).toBeNull();
    expect(safeRelativePath("javascript:alert(1)")).toBeNull();
  });
});

describe("safeAuthRedirectUrl", () => {
  const base = "https://descubresucre.com";

  it("conserva rutas relativas del mismo sitio", () => {
    expect(safeAuthRedirectUrl("/admin/users", base)).toBe("https://descubresucre.com/admin/users");
    expect(safeAuthRedirectUrl("https://descubresucre.com/admin", base)).toBe(
      "https://descubresucre.com/admin",
    );
  });

  it("cae al origen ante un redirect abierto", () => {
    expect(safeAuthRedirectUrl("https://evil.example/phish", base)).toBe(
      "https://descubresucre.com/",
    );
    expect(safeAuthRedirectUrl("//evil.example", base)).toBe("https://descubresucre.com/");
  });
});

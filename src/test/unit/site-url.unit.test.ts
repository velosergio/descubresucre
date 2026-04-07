import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPublicOriginFromRequest, getSiteOrigin } from "@/lib/site-url";

describe("site-url helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("usa NEXT_PUBLIC_SITE_URL como origen principal", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://descubresucre.com/path");
    expect(getSiteOrigin()).toBe("https://descubresucre.com");
  });

  it("getPublicOriginFromRequest prioriza host/proto del request si falta env", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const request = new Request("http://internal.local/test", {
      headers: {
        "x-forwarded-host": "demo.sitio.com",
        "x-forwarded-proto": "https",
      },
    });
    expect(getPublicOriginFromRequest(request)).toBe("https://demo.sitio.com");
  });
});

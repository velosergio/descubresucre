import { describe, expect, it } from "vitest";
import { defaultListingModeForSlug, isQueHacerListingMode } from "@/lib/que-hacer-listing-mode";

describe("que-hacer-listing-mode", () => {
  it("acepta los tres modos y rechaza el resto", () => {
    expect(isQueHacerListingMode("DESTINATIONS")).toBe(true);
    expect(isQueHacerListingMode("BIODIVERSITY")).toBe(true);
    expect(isQueHacerListingMode("EXPERIENCES")).toBe(true);
    expect(isQueHacerListingMode("destinations")).toBe(false);
    expect(isQueHacerListingMode("HUBS")).toBe(false);
  });

  it("defaults por slug canónico", () => {
    expect(defaultListingModeForSlug("biodiversidad")).toBe("BIODIVERSITY");
    expect(defaultListingModeForSlug("experiencias")).toBe("EXPERIENCES");
    expect(defaultListingModeForSlug("playas")).toBe("DESTINATIONS");
    expect(defaultListingModeForSlug("cienagas")).toBe("DESTINATIONS");
    expect(defaultListingModeForSlug("rios")).toBe("DESTINATIONS");
    expect(defaultListingModeForSlug("paisajes")).toBe("DESTINATIONS");
    expect(defaultListingModeForSlug("senderos")).toBe("DESTINATIONS");
    expect(defaultListingModeForSlug("cultura")).toBe("DESTINATIONS");
  });
});

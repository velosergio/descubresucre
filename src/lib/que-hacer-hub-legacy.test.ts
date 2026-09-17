import { describe, expect, it } from "vitest";
import {
  CANONICAL_THEME_SLUGS,
  isCanonicalThemeSlug,
  legacyHubIdToQueHacerSlug,
} from "@/lib/que-hacer-hub-legacy";

describe("que-hacer-hub-legacy", () => {
  it("reconoce los 7 slugs canónicos", () => {
    expect(CANONICAL_THEME_SLUGS).toHaveLength(7);
    for (const slug of CANONICAL_THEME_SLUGS) {
      expect(isCanonicalThemeSlug(slug)).toBe(true);
      expect(legacyHubIdToQueHacerSlug(slug)).toBe(slug);
    }
  });

  it("rechaza hubs/slugs desconocidos", () => {
    expect(isCanonicalThemeSlug("cultura")).toBe(false);
    expect(legacyHubIdToQueHacerSlug("volcanes")).toBeNull();
    expect(legacyHubIdToQueHacerSlug("playa")).toBeNull();
  });
});

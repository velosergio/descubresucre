import { describe, expect, it } from "vitest";
import {
  isSucreNaturalHubId,
  SUCRE_NATURAL_HUB_IDS,
  SUCRE_NATURAL_HUBS,
} from "@/lib/sucre-natural-hubs";

describe("catálogo Sucre Natural hubs", () => {
  it("expone exactamente 7 ids cerrados en orden", () => {
    expect([...SUCRE_NATURAL_HUB_IDS]).toEqual([
      "playas",
      "cienagas",
      "rios",
      "paisajes",
      "biodiversidad",
      "senderos",
      "experiencias",
    ]);
    expect(SUCRE_NATURAL_HUBS).toHaveLength(7);
    expect(SUCRE_NATURAL_HUBS.map((h) => h.id)).toEqual([...SUCRE_NATURAL_HUB_IDS]);
  });

  it("asigna paletas HSL por hub", () => {
    const byId = Object.fromEntries(SUCRE_NATURAL_HUBS.map((h) => [h.id, h.accentHsl]));
    expect(byId.playas).toBe("174 62% 35%");
    expect(byId.cienagas).toBe("142 40% 32%");
    expect(byId.rios).toBe("25 35% 38%");
    expect(byId.paisajes).toBe("130 35% 30%");
    expect(byId.biodiversidad).toBe("32 80% 42%");
    expect(byId.senderos).toBe("270 35% 38%");
    expect(byId.experiencias).toBe("18 80% 45%");
  });

  it("isSucreNaturalHubId acepta los 7 y rechaza el resto", () => {
    expect(isSucreNaturalHubId("playas")).toBe(true);
    expect(isSucreNaturalHubId("experiencias")).toBe(true);
    expect(isSucreNaturalHubId("playa")).toBe(false);
    expect(isSucreNaturalHubId("archipielago")).toBe(false);
    expect(isSucreNaturalHubId("")).toBe(false);
    expect(isSucreNaturalHubId("PLAYAS")).toBe(false);
  });
});

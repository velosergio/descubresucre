import { describe, expect, it } from "vitest";
import { slugifyImperdible } from "@/lib/imperdibles-slug";

describe("slugifyImperdible", () => {
  it("normaliza acentos y espacios", () => {
    expect(slugifyImperdible("Islas de San Bernardo")).toBe("islas-de-san-bernardo");
  });

  it("devuelve destino si no queda nada alfanumérico", () => {
    expect(slugifyImperdible("!!!")).toBe("destino");
  });
});

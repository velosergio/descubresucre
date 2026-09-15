import { describe, expect, it } from "vitest";
import { hasStructuredFicha, isNonEmptyList, isNonEmptyText } from "@/lib/sucre-natural-resolve";

describe("hasStructuredFicha", () => {
  it("es verdadero si hay al menos un hub", () => {
    expect(
      hasStructuredFicha({ hubs: [{ id: "playas" }], specialWhy: null, municipality: null }),
    ).toBe(true);
  });

  it("es verdadero si specialWhy no está vacío", () => {
    expect(
      hasStructuredFicha({ hubs: [], specialWhy: "  Aguas cristalinas  ", municipality: null }),
    ).toBe(true);
  });

  it("es verdadero si municipality no está vacío", () => {
    expect(hasStructuredFicha({ hubs: [], specialWhy: null, municipality: "Tolú" })).toBe(true);
  });

  it("es falso para destinos Markdown sin ficha", () => {
    expect(hasStructuredFicha({ hubs: [], specialWhy: "   ", municipality: "" })).toBe(false);
    expect(hasStructuredFicha({ hubs: [], specialWhy: null, municipality: null })).toBe(false);
  });
});

describe("omisión de bloques vacíos", () => {
  it("isNonEmptyText ignora nulos y espacios", () => {
    expect(isNonEmptyText(null)).toBe(false);
    expect(isNonEmptyText("")).toBe(false);
    expect(isNonEmptyText("  ")).toBe(false);
    expect(isNonEmptyText("Cálido tropical")).toBe(true);
  });

  it("isNonEmptyList ignora arrays vacíos o solo blancos", () => {
    expect(isNonEmptyList(null)).toBe(false);
    expect(isNonEmptyList([])).toBe(false);
    expect(isNonEmptyList(["  "])).toBe(false);
    expect(isNonEmptyList(["Snorkel"])).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { formatMonthLabel, getMonthRange, parseMonthParam } from "@/lib/month-range";

describe("getMonthRange", () => {
  it("devuelve el rango [inicio de mes, inicio de mes siguiente)", () => {
    const { start, end } = getMonthRange(2026, 10);
    expect(start.toISOString()).toBe("2026-10-01T00:00:00.000Z");
    expect(end.toISOString()).toBe("2026-11-01T00:00:00.000Z");
  });

  it("cruza correctamente diciembre → enero", () => {
    const { start, end } = getMonthRange(2026, 12);
    expect(start.toISOString()).toBe("2026-12-01T00:00:00.000Z");
    expect(end.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });
});

describe("parseMonthParam", () => {
  it("acepta formato válido YYYY-MM", () => {
    expect(parseMonthParam("2026-10")).toEqual({ year: 2026, month: 10 });
  });

  it("rechaza null/undefined/vacío", () => {
    expect(parseMonthParam(null)).toBeNull();
    expect(parseMonthParam(undefined)).toBeNull();
    expect(parseMonthParam("")).toBeNull();
  });

  it("rechaza formato inválido", () => {
    expect(parseMonthParam("2026-10-01")).toBeNull();
    expect(parseMonthParam("octubre-2026")).toBeNull();
    expect(parseMonthParam("2026/10")).toBeNull();
  });

  it("rechaza meses fuera de rango", () => {
    expect(parseMonthParam("2026-00")).toBeNull();
    expect(parseMonthParam("2026-13")).toBeNull();
  });
});

describe("formatMonthLabel", () => {
  it("devuelve una etiqueta en español", () => {
    expect(formatMonthLabel(2026, 10)).toBe("octubre de 2026");
    expect(formatMonthLabel(2026, 1)).toBe("enero de 2026");
    expect(formatMonthLabel(2026, 12)).toBe("diciembre de 2026");
  });
});

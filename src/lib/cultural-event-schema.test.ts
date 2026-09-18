import { describe, expect, it } from "vitest";
import { culturalEventSchema } from "@/lib/cultural-event-schema";

function baseInput() {
  return {
    title: "Festival de Octubre",
    description: "Una descripción",
    category: "Música",
    location: "Sincelejo",
    startsAt: "2026-10-15T20:00:00.000Z",
  };
}

describe("culturalEventSchema", () => {
  it("acepta un payload mínimo válido con defaults", () => {
    const parsed = culturalEventSchema.safeParse(baseInput());
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.allDay).toBe(true);
      expect(parsed.data.published).toBe(true);
    }
  });

  it.each(["title", "description", "category", "location"])("rechaza cuando falta %s", (field) => {
    const input: Record<string, unknown> = { ...baseInput(), [field]: "" };
    const parsed = culturalEventSchema.safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it("rechaza cuando falta startsAt", () => {
    const input: Record<string, unknown> = { ...baseInput() };
    input.startsAt = undefined;
    const parsed = culturalEventSchema.safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it("rechaza endsAt anterior a startsAt", () => {
    const parsed = culturalEventSchema.safeParse({
      ...baseInput(),
      startsAt: "2026-10-15T00:00:00.000Z",
      endsAt: "2026-10-10T00:00:00.000Z",
    });
    expect(parsed.success).toBe(false);
  });

  it("acepta endsAt posterior a startsAt (rango de varios días)", () => {
    const parsed = culturalEventSchema.safeParse({
      ...baseInput(),
      startsAt: "2026-10-15T00:00:00.000Z",
      endsAt: "2026-10-18T00:00:00.000Z",
    });
    expect(parsed.success).toBe(true);
  });

  it("rechaza cuando solo llega mapLat", () => {
    const parsed = culturalEventSchema.safeParse({ ...baseInput(), mapLat: 9.3 });
    expect(parsed.success).toBe(false);
  });

  it("rechaza cuando solo llega mapLng", () => {
    const parsed = culturalEventSchema.safeParse({ ...baseInput(), mapLng: -75.4 });
    expect(parsed.success).toBe(false);
  });

  it("acepta cuando llegan ambas coordenadas dentro de rango", () => {
    const parsed = culturalEventSchema.safeParse({
      ...baseInput(),
      mapLat: 9.3,
      mapLng: -75.4,
    });
    expect(parsed.success).toBe(true);
  });

  it("rechaza coordenadas fuera de rango", () => {
    expect(
      culturalEventSchema.safeParse({ ...baseInput(), mapLat: 200, mapLng: -75.4 }).success,
    ).toBe(false);
    expect(
      culturalEventSchema.safeParse({ ...baseInput(), mapLat: 9.3, mapLng: -200 }).success,
    ).toBe(false);
  });

  it("rechaza title mayor a 200 caracteres", () => {
    const parsed = culturalEventSchema.safeParse({ ...baseInput(), title: "a".repeat(201) });
    expect(parsed.success).toBe(false);
  });

  it("rechaza location mayor a 300 caracteres", () => {
    const parsed = culturalEventSchema.safeParse({ ...baseInput(), location: "a".repeat(301) });
    expect(parsed.success).toBe(false);
  });

  it("rechaza category mayor a 80 caracteres", () => {
    const parsed = culturalEventSchema.safeParse({ ...baseInput(), category: "a".repeat(81) });
    expect(parsed.success).toBe(false);
  });
});

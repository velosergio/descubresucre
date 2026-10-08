import { describe, expect, it } from "vitest";
import { convocatoriaSchema } from "@/lib/convocatoria-schema";

const valid = {
  title: "Beca cultural",
  description: "Inscripciones abiertas",
  audience: "Artistas de Sucre",
  type: "Arte",
  deadline: "2026-12-15T15:30:00.000Z",
  externalUrl: "https://ejemplo.gov.co/beca",
};

describe("convocatoriaSchema", () => {
  it("acepta payload mínimo válido con published por defecto y deadline a medianoche UTC", () => {
    const parsed = convocatoriaSchema.parse(valid);
    expect(parsed.published).toBe(true);
    expect(parsed.deadline.toISOString()).toBe("2026-12-15T00:00:00.000Z");
    expect(parsed.externalUrl).toBe(valid.externalUrl);
  });

  it("rechaza campos obligatorios faltantes", () => {
    for (const key of [
      "title",
      "description",
      "audience",
      "type",
      "deadline",
      "externalUrl",
    ] as const) {
      const { [key]: _, ...rest } = valid;
      const result = convocatoriaSchema.safeParse(rest);
      expect(result.success).toBe(false);
    }
  });

  it("rechaza longitudes máximas", () => {
    expect(convocatoriaSchema.safeParse({ ...valid, title: "a".repeat(201) }).success).toBe(false);
    expect(convocatoriaSchema.safeParse({ ...valid, audience: "a".repeat(201) }).success).toBe(
      false,
    );
    expect(convocatoriaSchema.safeParse({ ...valid, type: "a".repeat(81) }).success).toBe(false);
    expect(
      convocatoriaSchema.safeParse({
        ...valid,
        externalUrl: `https://ejemplo.gov.co/${"a".repeat(2040)}`,
      }).success,
    ).toBe(false);
  });

  it("rechaza URLs sin http/https", () => {
    expect(
      convocatoriaSchema.safeParse({ ...valid, externalUrl: "javascript:alert(1)" }).success,
    ).toBe(false);
    expect(convocatoriaSchema.safeParse({ ...valid, externalUrl: "no-es-url" }).success).toBe(
      false,
    );
    expect(
      convocatoriaSchema.safeParse({ ...valid, externalUrl: "ftp://files.example" }).success,
    ).toBe(false);
  });
});

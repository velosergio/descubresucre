import { describe, expect, it } from "vitest";
import { sucreNaturalDestinationSchema } from "@/lib/sucre-natural-destination-schema";

const valid = {
  title: "Playa El Francés",
  subtitle: "Arena blanca",
  slug: "playa-el-frances",
  published: true,
  showOnHome: false,
  activityIds: ["act-playas"],
  municipality: "Tolú",
};

describe("sucreNaturalDestinationSchema", () => {
  it("acepta un destino mínimo válido", () => {
    const parsed = sucreNaturalDestinationSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rechaza slug inválido", () => {
    const parsed = sucreNaturalDestinationSchema.safeParse({ ...valid, slug: "Playa El Francés" });
    expect(parsed.success).toBe(false);
  });

  it("exige lat y lng juntas", () => {
    const parsed = sucreNaturalDestinationSchema.safeParse({ ...valid, mapLat: 9.5 });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.message.includes("latitud y longitud"))).toBe(true);
    }
  });

  it("rechaza URL de medio sin prefijo o con ..", () => {
    expect(
      sucreNaturalDestinationSchema.safeParse({
        ...valid,
        cardImageUrl: "/uploads/hero/images/a.webp",
      }).success,
    ).toBe(false);
    expect(
      sucreNaturalDestinationSchema.safeParse({
        ...valid,
        cardImageUrl: "/uploads/gallery/images/../secret.webp",
      }).success,
    ).toBe(false);
  });

  it("rechaza más de 12 actividades o título largo", () => {
    const many = Array.from({ length: 13 }, (_, i) => ({ title: `Actividad ${i}` }));
    expect(
      sucreNaturalDestinationSchema.safeParse({ ...valid, liveActivities: many }).success,
    ).toBe(false);
    expect(
      sucreNaturalDestinationSchema.safeParse({
        ...valid,
        liveActivities: [{ title: "x".repeat(81) }],
      }).success,
    ).toBe(false);
  });

  it("rechaza iconKey fuera de whitelist y exige municipio o actividad", () => {
    expect(
      sucreNaturalDestinationSchema.safeParse({
        ...valid,
        liveActivities: [{ title: "Snorkel", iconKey: "rocket" }],
      }).success,
    ).toBe(false);
    expect(
      sucreNaturalDestinationSchema.safeParse({
        ...valid,
        municipality: "",
        activityIds: [],
      }).success,
    ).toBe(false);
  });
});

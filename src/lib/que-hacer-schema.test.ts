import { describe, expect, it } from "vitest";
import { queHacerActivitySchema, queHacerCategorySchema } from "@/lib/que-hacer-schema";

const validPhoto = "/uploads/gallery/images/a.webp";

const base = {
  title: "Playas",
  description: "Mar",
  iconKey: "waves",
  listingMode: "DESTINATIONS",
  published: false,
  photoUrls: [validPhoto] as string[],
};

describe("queHacerActivitySchema", () => {
  it("rechaza slug inválido, publicar sin foto, icono fuera y URL con ..", () => {
    expect(
      queHacerActivitySchema.safeParse({ ...base, slug: "Playas!", photoUrls: [] }).success,
    ).toBe(false);

    expect(
      queHacerActivitySchema.safeParse({
        ...base,
        published: true,
        photoUrls: [],
      }).success,
    ).toBe(false);

    expect(queHacerActivitySchema.safeParse({ ...base, iconKey: "no-existe" }).success).toBe(
      false,
    );

    expect(
      queHacerActivitySchema.safeParse({
        ...base,
        photoUrls: ["/uploads/gallery/images/../secret.webp"],
      }).success,
    ).toBe(false);
  });

  it("acepta publicación con foto, modo e icono del catálogo", () => {
    const parsed = queHacerActivitySchema.safeParse({
      ...base,
      description: "Tolú, Coveñas",
      published: true,
      accentHsl: "174 62% 35%",
      tagline: "Mar y naturaleza",
    });
    expect(parsed.success).toBe(true);
  });

  it("rechaza modo de listado inválido y accent mal formado", () => {
    expect(queHacerActivitySchema.safeParse({ ...base, listingMode: "HUBS" }).success).toBe(
      false,
    );
    expect(
      queHacerActivitySchema.safeParse({ ...base, accentHsl: "hsl(174, 62%, 35%)" }).success,
    ).toBe(false);
  });

  it("rechaza título vacío", () => {
    expect(queHacerActivitySchema.safeParse({ ...base, title: "  " }).success).toBe(false);
  });

  it("rechaza más de 12 fotos", () => {
    expect(
      queHacerActivitySchema.safeParse({
        ...base,
        published: true,
        photoUrls: Array.from({ length: 13 }, (_, i) => `/uploads/gallery/images/${i}.webp`),
      }).success,
    ).toBe(false);
  });
});

describe("queHacerCategorySchema", () => {
  it("exige nombre 1–120", () => {
    expect(queHacerCategorySchema.safeParse({ name: "" }).success).toBe(false);
    expect(queHacerCategorySchema.safeParse({ name: "Playas" }).success).toBe(true);
  });
});

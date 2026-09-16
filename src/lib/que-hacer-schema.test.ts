import { describe, expect, it } from "vitest";
import { queHacerActivitySchema, queHacerCategorySchema } from "@/lib/que-hacer-schema";

const validPhoto = "/uploads/gallery/images/a.webp";

describe("queHacerActivitySchema", () => {
  it("rechaza slug inválido, publicar sin foto, icono fuera y URL con ..", () => {
    expect(
      queHacerActivitySchema.safeParse({
        title: "Playas",
        description: "Mar",
        slug: "Playas!",
        iconKey: "waves",
        published: false,
        photoUrls: [],
      }).success,
    ).toBe(false);

    expect(
      queHacerActivitySchema.safeParse({
        title: "Playas",
        description: "Mar",
        iconKey: "waves",
        published: true,
        photoUrls: [],
      }).success,
    ).toBe(false);

    expect(
      queHacerActivitySchema.safeParse({
        title: "Playas",
        description: "Mar",
        iconKey: "no-existe",
        published: false,
        photoUrls: [validPhoto],
      }).success,
    ).toBe(false);

    expect(
      queHacerActivitySchema.safeParse({
        title: "Playas",
        description: "Mar",
        iconKey: "waves",
        published: false,
        photoUrls: ["/uploads/gallery/images/../secret.webp"],
      }).success,
    ).toBe(false);
  });

  it("acepta publicación con foto e icono del catálogo", () => {
    const parsed = queHacerActivitySchema.safeParse({
      title: "Playas",
      description: "Tolú, Coveñas",
      iconKey: "waves",
      published: true,
      photoUrls: [validPhoto],
    });
    expect(parsed.success).toBe(true);
  });

  it("rechaza título vacío", () => {
    expect(
      queHacerActivitySchema.safeParse({
        title: "  ",
        description: "Mar",
        iconKey: "waves",
        published: false,
        photoUrls: [],
      }).success,
    ).toBe(false);
  });

  it("rechaza más de 12 fotos", () => {
    expect(
      queHacerActivitySchema.safeParse({
        title: "Playas",
        description: "Mar",
        iconKey: "waves",
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

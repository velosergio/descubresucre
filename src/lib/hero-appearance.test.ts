import { describe, expect, it } from "vitest";
import type { HeroAppearanceSettings } from "@/generated/prisma";
import {
  isAllowedExternalVideoUrl,
  isPublicUploadPath,
  parseCarouselSlides,
  resolveHeroFromRow,
  validateHeroSaveInput,
} from "@/lib/hero-appearance";

describe("isPublicUploadPath", () => {
  it("acepta rutas hero y galería", () => {
    expect(isPublicUploadPath("/uploads/hero/images/x.jpg")).toBe(true);
    expect(isPublicUploadPath("/uploads/gallery/images/x.jpg")).toBe(true);
    expect(isPublicUploadPath("/uploads/otro/x.jpg")).toBe(false);
    expect(isPublicUploadPath("/uploads/hero/../x")).toBe(false);
  });
});

describe("isAllowedExternalVideoUrl", () => {
  it("acepta HTTPS", () => {
    expect(isAllowedExternalVideoUrl("https://cdn.example.com/v.mp4")).toBe(true);
  });
  it("rechaza HTTP remoto", () => {
    expect(isAllowedExternalVideoUrl("http://evil.com/v.mp4")).toBe(false);
  });
  it("acepta localhost HTTP", () => {
    expect(isAllowedExternalVideoUrl("http://localhost:3000/x.mp4")).toBe(true);
  });
});

describe("parseCarouselSlides", () => {
  it("normaliza entradas válidas", () => {
    expect(parseCarouselSlides([{ url: "/uploads/hero/images/a.jpg", alt: "A" }])).toEqual([
      { url: "/uploads/hero/images/a.jpg", alt: "A" },
    ]);
  });
  it("filtra inválidos", () => {
    expect(parseCarouselSlides([{}, { url: "" }])).toEqual([]);
  });
});

describe("validateHeroSaveInput", () => {
  it("IMAGE_DEFAULT", () => {
    const r = validateHeroSaveInput({ heroMode: "IMAGE_DEFAULT" });
    expect(r.ok).toBe(true);
  });
  it("IMAGE_CUSTOM exige ruta de subida", () => {
    expect(
      validateHeroSaveInput({
        heroMode: "IMAGE_CUSTOM",
        heroImageUrl: "/uploads/hero/images/x.jpg",
      }).ok,
    ).toBe(true);
    expect(
      validateHeroSaveInput({
        heroMode: "IMAGE_CUSTOM",
        heroImageUrl: "/uploads/gallery/images/x.jpg",
      }).ok,
    ).toBe(true);
    expect(
      validateHeroSaveInput({ heroMode: "IMAGE_CUSTOM", heroImageUrl: "/etc/passwd" }).ok,
    ).toBe(false);
  });
  it("CAROUSEL exige 2+ slides", () => {
    expect(
      validateHeroSaveInput({
        heroMode: "CAROUSEL",
        carouselSlides: [
          { url: "/uploads/hero/images/a.jpg" },
          { url: "/uploads/hero/images/b.jpg" },
        ],
      }).ok,
    ).toBe(true);
    expect(
      validateHeroSaveInput({
        heroMode: "CAROUSEL",
        carouselSlides: [{ url: "/uploads/hero/images/a.jpg" }],
      }).ok,
    ).toBe(false);
  });
});

describe("resolveHeroFromRow", () => {
  it("sin fila → default", () => {
    expect(resolveHeroFromRow(null)).toEqual({ mode: "IMAGE_DEFAULT" });
  });
  it("IMAGE_CUSTOM válido", () => {
    const row: HeroAppearanceSettings = {
      id: "singleton",
      heroMode: "IMAGE_CUSTOM",
      heroImageUrl: "/uploads/hero/images/z.jpg",
      heroVideoUrl: null,
      heroVideoSource: null,
      carouselSlides: null,
      updatedAt: new Date(),
    };
    expect(resolveHeroFromRow(row)).toEqual({
      mode: "IMAGE_CUSTOM",
      imageUrl: "/uploads/hero/images/z.jpg",
    });
  });
});

import { describe, expect, it } from "vitest";
import type { HeroRefsPick } from "@/lib/gallery-hero-references";
import { isGalleryUrlReferencedByHero } from "@/lib/gallery-hero-references";

describe("isGalleryUrlReferencedByHero", () => {
  const url = "/uploads/gallery/images/a.jpg";

  it("retorna false sin hero", () => {
    expect(isGalleryUrlReferencedByHero(null, url)).toBe(false);
  });

  it("detecta heroImageUrl", () => {
    expect(
      isGalleryUrlReferencedByHero(
        { heroImageUrl: url, heroVideoUrl: null, carouselSlides: null },
        url,
      ),
    ).toBe(true);
  });

  it("detecta slide del carrusel", () => {
    const hero: HeroRefsPick = {
      heroImageUrl: null,
      heroVideoUrl: null,
      carouselSlides: [{ url }, { url: "/uploads/gallery/images/b.jpg" }],
    };
    expect(isGalleryUrlReferencedByHero(hero, url)).toBe(true);
  });

  it("detecta heroVideoUrl", () => {
    const v = "/uploads/gallery/video/x.mp4";
    expect(
      isGalleryUrlReferencedByHero(
        { heroImageUrl: null, heroVideoUrl: v, carouselSlides: null },
        v,
      ),
    ).toBe(true);
  });
});

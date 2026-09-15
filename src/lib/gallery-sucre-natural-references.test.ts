import { describe, expect, it } from "vitest";
import { isGalleryUrlUsedBySucreNatural } from "@/lib/gallery-sucre-natural-references";

const u = "/uploads/gallery/images/a.webp";

describe("isGalleryUrlUsedBySucreNatural", () => {
  it("retorna false con refs vacías", () => {
    expect(
      isGalleryUrlUsedBySucreNatural(
        {
          cardImageUrls: [],
          galleryItemUrls: [],
          hubCoverUrls: [],
          speciesImageUrls: [],
          experienceImageUrls: [],
        },
        u,
      ),
    ).toBe(false);
  });

  it("detecta card, gallery, cover de hub, especie y experiencia", () => {
    expect(
      isGalleryUrlUsedBySucreNatural(
        {
          cardImageUrls: [u],
          galleryItemUrls: [],
          hubCoverUrls: [],
          speciesImageUrls: [],
          experienceImageUrls: [],
        },
        u,
      ),
    ).toBe(true);
    expect(
      isGalleryUrlUsedBySucreNatural(
        {
          cardImageUrls: [],
          galleryItemUrls: [u],
          hubCoverUrls: [],
          speciesImageUrls: [],
          experienceImageUrls: [],
        },
        ` ${u} `,
      ),
    ).toBe(true);
    expect(
      isGalleryUrlUsedBySucreNatural(
        {
          cardImageUrls: [null],
          galleryItemUrls: [],
          hubCoverUrls: [u],
          speciesImageUrls: [],
          experienceImageUrls: [],
        },
        u,
      ),
    ).toBe(true);
    expect(
      isGalleryUrlUsedBySucreNatural(
        {
          cardImageUrls: [],
          galleryItemUrls: [],
          hubCoverUrls: [],
          speciesImageUrls: [u],
          experienceImageUrls: [],
        },
        u,
      ),
    ).toBe(true);
    expect(
      isGalleryUrlUsedBySucreNatural(
        {
          cardImageUrls: [],
          galleryItemUrls: [],
          hubCoverUrls: [],
          speciesImageUrls: [],
          experienceImageUrls: [u],
        },
        u,
      ),
    ).toBe(true);
  });

  it("retorna false si no coincide", () => {
    expect(
      isGalleryUrlUsedBySucreNatural(
        {
          cardImageUrls: ["/uploads/gallery/images/b.webp"],
          galleryItemUrls: ["/uploads/gallery/images/c.webp"],
          hubCoverUrls: [null],
          speciesImageUrls: [undefined],
          experienceImageUrls: [],
        },
        u,
      ),
    ).toBe(false);
  });
});

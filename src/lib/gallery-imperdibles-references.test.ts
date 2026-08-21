import { describe, expect, it } from "vitest";
import { isGalleryUrlUsedByImperdibleCardImages } from "@/lib/gallery-imperdibles-references";

describe("isGalleryUrlUsedByImperdibleCardImages", () => {
  const u = "/uploads/gallery/images/a.webp";

  it("retorna false con lista vacía", () => {
    expect(isGalleryUrlUsedByImperdibleCardImages([], u)).toBe(false);
  });

  it("detecta coincidencia exacta", () => {
    expect(isGalleryUrlUsedByImperdibleCardImages(["/uploads/gallery/images/b.webp", u], u)).toBe(
      true,
    );
  });

  it("ignora espacios en el needle", () => {
    expect(isGalleryUrlUsedByImperdibleCardImages([u], `  ${u}  `)).toBe(true);
  });

  it("retorna false si no coincide", () => {
    expect(isGalleryUrlUsedByImperdibleCardImages(["/uploads/gallery/images/x.webp"], u)).toBe(
      false,
    );
  });
});

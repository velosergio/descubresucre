import { describe, expect, it } from "vitest";
import { isGalleryUrlUsedByQueHacer } from "@/lib/gallery-que-hacer-references";

const u = "/uploads/gallery/images/a.webp";

describe("isGalleryUrlUsedByQueHacer", () => {
  it("detecta coincidencia y recorte", () => {
    expect(isGalleryUrlUsedByQueHacer([u], u)).toBe(true);
    expect(isGalleryUrlUsedByQueHacer([` ${u} `], u)).toBe(true);
    expect(isGalleryUrlUsedByQueHacer([null, undefined], u)).toBe(false);
    expect(isGalleryUrlUsedByQueHacer(["/uploads/gallery/images/b.webp"], u)).toBe(false);
  });
});

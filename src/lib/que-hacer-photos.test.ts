import { describe, expect, it } from "vitest";
import {
  filterLivePhotos,
  isActivityPubliclyVisible,
  pickCoverPhoto,
} from "@/lib/que-hacer-photos";

const photos = [
  { publicUrl: "/uploads/gallery/images/a.webp", sortOrder: 1, isCover: false },
  { publicUrl: "/uploads/gallery/images/b.webp", sortOrder: 0, isCover: false },
  { publicUrl: "/uploads/gallery/images/c.webp", sortOrder: 2, isCover: true },
];

describe("que-hacer-photos", () => {
  it("elige isCover de menor sortOrder, o la primera por sortOrder", () => {
    expect(pickCoverPhoto(photos)?.publicUrl).toBe("/uploads/gallery/images/c.webp");
    expect(pickCoverPhoto(photos.slice(0, 2))?.publicUrl).toBe("/uploads/gallery/images/b.webp");
    expect(pickCoverPhoto([])).toBeNull();
  });

  it("filtra huérfanos y exige foto viva para ser pública", () => {
    const live = filterLivePhotos(photos, new Set(["/uploads/gallery/images/b.webp"]));
    expect(live).toHaveLength(1);
    expect(isActivityPubliclyVisible(true, live)).toBe(true);
    expect(isActivityPubliclyVisible(true, [])).toBe(false);
    expect(isActivityPubliclyVisible(false, live)).toBe(false);
  });
});

export const QUE_HACER_MAX_PHOTOS = 12;

export type QueHacerPhotoLike = {
  publicUrl: string;
  sortOrder: number;
  isCover: boolean;
  alt?: string | null;
};

export function pickCoverPhoto<T extends QueHacerPhotoLike>(photos: readonly T[]): T | null {
  if (photos.length === 0) return null;
  const sorted = photos.toSorted((a, b) => a.sortOrder - b.sortOrder);
  const covers = sorted.filter((p) => p.isCover);
  return covers[0] ?? sorted[0] ?? null;
}

export function filterLivePhotos<T extends QueHacerPhotoLike>(
  photos: readonly T[],
  existingUrls: ReadonlySet<string>,
): T[] {
  return photos.filter((p) => existingUrls.has(p.publicUrl.trim()));
}

export function isActivityPubliclyVisible(
  published: boolean,
  livePhotos: { length: number },
): boolean {
  return published && livePhotos.length >= 1;
}

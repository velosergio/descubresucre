export function isGalleryUrlUsedByQueHacer(
  photoUrls: readonly (string | null | undefined)[],
  publicUrl: string,
): boolean {
  const needle = publicUrl.trim();
  if (!needle) return false;
  return photoUrls.some((u) => (u ?? "").trim() === needle);
}

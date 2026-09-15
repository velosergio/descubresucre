export type SucreNaturalMediaRefs = {
  cardImageUrls: readonly (string | null | undefined)[];
  galleryItemUrls: readonly (string | null | undefined)[];
  hubCoverUrls: readonly (string | null | undefined)[];
  speciesImageUrls: readonly (string | null | undefined)[];
  experienceImageUrls: readonly (string | null | undefined)[];
};

function matchesUrl(list: readonly (string | null | undefined)[], needle: string): boolean {
  if (!needle) return false;
  return list.some((u) => (u ?? "").trim() === needle);
}

/** Indica si una URL de galería está usada en fichas Sucre Natural (card, galería, hubs, especies, experiencias). */
export function isGalleryUrlUsedBySucreNatural(
  refs: SucreNaturalMediaRefs,
  publicUrl: string,
): boolean {
  const needle = publicUrl.trim();
  if (!needle) return false;
  return (
    matchesUrl(refs.cardImageUrls, needle) ||
    matchesUrl(refs.galleryItemUrls, needle) ||
    matchesUrl(refs.hubCoverUrls, needle) ||
    matchesUrl(refs.speciesImageUrls, needle) ||
    matchesUrl(refs.experienceImageUrls, needle)
  );
}

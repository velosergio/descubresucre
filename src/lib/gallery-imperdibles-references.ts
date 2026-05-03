/** Comprueba si una URL de galería coincide con la imagen de tarjeta de algún destino (lista en memoria, p. ej. tests). */
export function isGalleryUrlUsedByImperdibleCardImages(
  cardImageUrls: readonly string[],
  publicUrl: string,
): boolean {
  const needle = publicUrl.trim();
  if (!needle) return false;
  return cardImageUrls.some((u) => u.trim() === needle);
}

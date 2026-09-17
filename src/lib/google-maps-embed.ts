/** URL de iframe Maps Embed API (modo view). Sin clave, null. */
export function buildGoogleMapsEmbedViewUrl(input: {
  apiKey: string;
  lat: number;
  lng: number;
  zoom: number;
}): string | null {
  const apiKey = input.apiKey.trim();
  if (!apiKey) return null;
  return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(apiKey)}&center=${input.lat},${input.lng}&zoom=${input.zoom}`;
}

/** Enlace externo «Abrir en Google Maps» (no requiere API key). */
export function buildGoogleMapsSearchUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

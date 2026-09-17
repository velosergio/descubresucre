/**
 * Clave Maps en runtime (servidor). `GOOGLE_MAPS_API_KEY` no se incrusta en el build Docker;
 * `NEXT_PUBLIC_*` queda como alias local.
 */
export function getGoogleMapsApiKey(): string | null {
  const runtime = process.env.GOOGLE_MAPS_API_KEY?.trim() ?? "";
  if (runtime) return runtime;
  const fromPublic = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  return fromPublic || null;
}

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

/** iframe Embed con un pin (modo place). */
export function buildGoogleMapsEmbedPlaceUrl(input: {
  apiKey: string;
  lat: number;
  lng: number;
  zoom: number;
}): string | null {
  const apiKey = input.apiKey.trim();
  if (!apiKey) return null;
  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${input.lat},${input.lng}&zoom=${input.zoom}`;
}

/** Enlace externo «Abrir en Google Maps» (no requiere API key). */
export function buildGoogleMapsSearchUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

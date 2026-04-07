/** Origen público del sitio (sin path). Debe coincidir con `metadataBase` en `layout.tsx`. */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(raw).origin;
}

/** Origen público del sitio (sin path). Debe coincidir con `metadataBase` en `layout.tsx`. */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(raw).origin;
}

/**
 * Origen para callbacks (n8n → Next). Prefiere NEXT_PUBLIC_SITE_URL; si no, Host/Forwarded de la petición.
 */
export function getPublicOriginFromRequest(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    try {
      return new URL(fromEnv).origin;
    } catch {
      /* continuar */
    }
  }
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return getSiteOrigin();
}

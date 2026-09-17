/**
 * Acepta solo rutas relativas del mismo origen (empiezan por `/` y no son protocol-relative).
 * Rechaza URLs absolutas, `//host`, backslashes y orígenes distintos al resolverlas.
 */
export function safeRelativePath(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return null;
  }

  try {
    const resolved = new URL(trimmed, "https://safe-relative.invalid");
    if (resolved.origin !== "https://safe-relative.invalid") return null;
    if (resolved.username || resolved.password) return null;
    const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
    if (!path.startsWith("/") || path.startsWith("//")) return null;
    return path;
  } catch {
    return null;
  }
}

/** Destino de Auth.js: misma regla, con fallback al origen del sitio. */
export function safeAuthRedirectUrl(url: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const trimmed = url.trim();
  const candidate = trimmed.startsWith(base) ? trimmed.slice(base.length) || "/" : trimmed;
  const relative = safeRelativePath(candidate);
  return `${base}${relative ?? "/"}`;
}

export function toServedMediaUrl(url: string): string {
  const clean = url.trim();
  if (!clean.startsWith("/uploads/")) return clean;
  return `/api/media?src=${encodeURIComponent(clean)}`;
}

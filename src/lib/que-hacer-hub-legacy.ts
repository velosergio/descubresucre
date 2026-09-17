import { isSucreNaturalHubId, type SucreNaturalHubId } from "@/lib/sucre-natural-hubs";

/** Canonical theme slugs = legacy hub ids (1:1). */
export const CANONICAL_THEME_SLUGS = [
  "playas",
  "cienagas",
  "rios",
  "paisajes",
  "biodiversidad",
  "senderos",
  "experiencias",
] as const;

export type CanonicalThemeSlug = (typeof CANONICAL_THEME_SLUGS)[number];

const CANONICAL_SET = new Set<string>(CANONICAL_THEME_SLUGS);

export function isCanonicalThemeSlug(slug: string): slug is CanonicalThemeSlug {
  return CANONICAL_SET.has(slug);
}

/** Map legacy `/sucre-natural/[hub]` id to `/que-hacer/[slug]`. */
export function legacyHubIdToQueHacerSlug(hubId: string): CanonicalThemeSlug | null {
  if (!isSucreNaturalHubId(hubId)) return null;
  return hubId as SucreNaturalHubId & CanonicalThemeSlug;
}

export const QUE_HACER_LISTING_MODES = ["DESTINATIONS", "BIODIVERSITY", "EXPERIENCES"] as const;

export type QueHacerListingModeId = (typeof QUE_HACER_LISTING_MODES)[number];

const MODE_SET = new Set<string>(QUE_HACER_LISTING_MODES);

export function isQueHacerListingMode(value: string): value is QueHacerListingModeId {
  return MODE_SET.has(value);
}

/** Defaults for the seven canonical theme slugs (ex-hubs). */
export function defaultListingModeForSlug(slug: string): QueHacerListingModeId {
  if (slug === "biodiversidad") return "BIODIVERSITY";
  if (slug === "experiencias") return "EXPERIENCES";
  return "DESTINATIONS";
}

export const DEFAULT_ACTIVITY_ACCENT_HSL = "174 45% 32%";

/** HSL components like `174 62% 35%` (no hsl() wrapper). */
export const ACCENT_HSL_REGEX = /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/;

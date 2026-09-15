import { isSucreNaturalHubId, type SucreNaturalHubId } from "@/lib/sucre-natural-hubs";

export type LiveActivity = {
  title: string;
  iconKey?: string;
};

export type BiodiversityChip = {
  label: string;
  href?: string;
};

export type FichaGalleryItem = {
  publicUrl: string;
  alt: string;
};

export type FichaSource = {
  name: string;
  url: string | null;
  note: string | null;
};

export type DestinationHubCard = {
  slug: string;
  title: string;
  subtitle: string;
  municipality: string | null;
  cardImageUrl: string | null;
};

export function publishedOnly<T extends { published: boolean }>(items: readonly T[]): T[] {
  return items.filter((item) => item.published);
}

export function hubIdOrNull(hubId: string): SucreNaturalHubId | null {
  return isSucreNaturalHubId(hubId) ? hubId : null;
}

export function parseStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => (typeof item === "string" && item.trim() ? [item.trim()] : []));
}

export function parseLiveActivities(value: unknown): LiveActivity[] {
  if (!Array.isArray(value)) return [];
  const out: LiveActivity[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const title = "title" in item && typeof item.title === "string" ? item.title.trim() : "";
    if (!title) continue;
    const iconKey =
      "iconKey" in item && typeof item.iconKey === "string" && item.iconKey.trim()
        ? item.iconKey.trim()
        : undefined;
    out.push(iconKey ? { title, iconKey } : { title });
  }
  return out;
}

export function toDestinationHubCard(row: {
  slug: string;
  title: string;
  subtitle: string;
  municipality: string | null;
  cardImageUrl: string | null;
  published: boolean;
}): DestinationHubCard | null {
  if (!row.published) return null;
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    municipality: row.municipality,
    cardImageUrl: row.cardImageUrl,
  };
}

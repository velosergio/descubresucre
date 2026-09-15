import { prisma } from "@/lib/prisma";
import { isSucreNaturalHubId } from "@/lib/sucre-natural-hubs";
import {
  type BiodiversityChip,
  type FichaGalleryItem,
  type FichaSource,
  type LiveActivity,
  parseLiveActivities,
  parseStringList,
} from "@/lib/sucre-natural-public";
import { hasStructuredFicha } from "@/lib/sucre-natural-resolve";

export type ImperdibleHubRef = {
  id: string;
  title: string;
};

export type ImperdibleDetail = {
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string | null;
  bodyMarkdown: string;
  mapLat: number | null;
  mapLng: number | null;
  mapZoom: number;
  municipality: string | null;
  region: string | null;
  locationLabel: string | null;
  ecosystems: string | null;
  approach: string | null;
  specialWhy: string | null;
  howToArrive: string | null;
  climate: string | null;
  recommendedTime: string | null;
  audience: string | null;
  mapNote: string | null;
  liveActivities: LiveActivity[];
  responsibleTips: string[];
  biodiversityChips: BiodiversityChip[];
  gallery: FichaGalleryItem[];
  sources: FichaSource[];
  hubs: ImperdibleHubRef[];
  hasStructuredFicha: boolean;
};

export async function getImperdibleBySlug(slug: string): Promise<ImperdibleDetail | null> {
  const row = await prisma.imperdibleDestination.findFirst({
    where: { slug: slug.trim(), published: true },
    include: {
      hubs: { include: { hub: true } },
      galleryItems: { orderBy: { sortOrder: "asc" } },
      sources: { include: { source: true } },
      biodiversity: {
        include: { entry: true },
      },
    },
  });
  if (!row) return null;

  const hubs = row.hubs
    .filter((j) => isSucreNaturalHubId(j.hubId))
    .map((j) => ({ id: j.hubId, title: j.hub.title }));

  const labelChips: BiodiversityChip[] = parseStringList(row.biodiversityChipLabels).map(
    (label) => ({ label }),
  );
  const speciesChips: BiodiversityChip[] = row.biodiversity.flatMap((j) =>
    j.entry.published
      ? [{ label: j.entry.commonName, href: `/sucre-natural/especies/${j.entry.slug}` }]
      : [],
  );

  const structured = hasStructuredFicha({
    hubs,
    specialWhy: row.specialWhy,
    municipality: row.municipality,
  });

  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    cardImageUrl: row.cardImageUrl,
    bodyMarkdown: row.bodyMarkdown,
    mapLat: row.mapLat == null ? null : Number(row.mapLat),
    mapLng: row.mapLng == null ? null : Number(row.mapLng),
    mapZoom: row.mapZoom,
    municipality: row.municipality,
    region: row.region,
    locationLabel: row.locationLabel,
    ecosystems: row.ecosystems,
    approach: row.approach,
    specialWhy: row.specialWhy,
    howToArrive: row.howToArrive,
    climate: row.climate,
    recommendedTime: row.recommendedTime,
    audience: row.audience,
    mapNote: row.mapNote,
    liveActivities: parseLiveActivities(row.liveActivities),
    responsibleTips: parseStringList(row.responsibleTips),
    biodiversityChips: [...labelChips, ...speciesChips],
    gallery: row.galleryItems.map((g) => ({
      publicUrl: g.publicUrl,
      alt: g.alt?.trim() || row.title,
    })),
    sources: row.sources.map((s) => ({
      name: s.source.name,
      url: s.source.url,
      note: s.source.note,
    })),
    hubs,
    hasStructuredFicha: structured,
  };
}

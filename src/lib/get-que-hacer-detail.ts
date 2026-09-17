import { galleryPublicUrlExists } from "@/lib/gallery-assets";
import {
  getBiodiversityHub,
  getExperiencesHub,
} from "@/lib/get-sucre-natural-public";
import { prisma } from "@/lib/prisma";
import { resolveQueHacerIcon } from "@/lib/que-hacer-icons";
import type { QueHacerListingModeId } from "@/lib/que-hacer-listing-mode";
import { DEFAULT_ACTIVITY_ACCENT_HSL } from "@/lib/que-hacer-listing-mode";
import { filterLivePhotos, isActivityPubliclyVisible } from "@/lib/que-hacer-photos";
import { toServedMediaUrl } from "@/lib/media-url";

export type QueHacerDetailPhoto = {
  publicUrl: string;
  alt: string;
};

export type QueHacerDetailDestination = {
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string | null;
  municipality: string | null;
};

export type QueHacerSpeciesCard = {
  slug: string;
  commonName: string;
  scientificName: string | null;
  groupKey: string;
};

export type QueHacerExperienceCard = {
  slug: string;
  title: string;
  tagline: string | null;
  imageUrl: string | null;
};

export type QueHacerDetail = {
  slug: string;
  title: string;
  description: string;
  tagline: string | null;
  introMarkdown: string | null;
  accentHsl: string;
  listingMode: QueHacerListingModeId;
  iconKey: string;
  iconLabel: string;
  photos: QueHacerDetailPhoto[];
  destinations: QueHacerDetailDestination[];
  species: QueHacerSpeciesCard[];
  experiences: QueHacerExperienceCard[];
};

export async function getQueHacerBySlug(slug: string): Promise<QueHacerDetail | null> {
  const row = await prisma.queHacerActivity.findFirst({
    where: { slug: slug.trim() },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      destinations: {
        orderBy: { sortOrder: "asc" },
        include: { destination: true },
      },
    },
  });
  if (!row) return null;

  const exists = await Promise.all(row.photos.map((p) => galleryPublicUrlExists(p.publicUrl)));
  const liveSet = new Set(
    row.photos.filter((_, idx) => exists[idx]).map((p) => p.publicUrl.trim()),
  );
  const live = filterLivePhotos(row.photos, liveSet);
  if (!isActivityPubliclyVisible(row.published, live)) return null;

  const icon = resolveQueHacerIcon(row.iconKey);
  const listingMode = row.listingMode as QueHacerListingModeId;

  let species: QueHacerSpeciesCard[] = [];
  let experiences: QueHacerExperienceCard[] = [];
  if (listingMode === "BIODIVERSITY") {
    const rows = await getBiodiversityHub();
    species = rows.map((sp) => ({
      slug: sp.slug,
      commonName: sp.commonName,
      scientificName: sp.scientificName,
      groupKey: sp.groupKey,
    }));
  } else if (listingMode === "EXPERIENCES") {
    const rows = await getExperiencesHub();
    experiences = rows.map((ex) => ({
      slug: ex.slug,
      title: ex.title,
      tagline: ex.tagline,
      imageUrl: ex.imageUrl,
    }));
  }

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    tagline: row.tagline,
    introMarkdown: row.introMarkdown,
    accentHsl: row.accentHsl?.trim() || DEFAULT_ACTIVITY_ACCENT_HSL,
    listingMode,
    iconKey: icon.key,
    iconLabel: icon.label,
    photos: live.map((p) => ({
      publicUrl: p.publicUrl,
      alt: p.alt?.trim() || row.title,
    })),
    destinations:
      listingMode === "DESTINATIONS"
        ? row.destinations.flatMap((j) =>
            j.destination.published
              ? [
                  {
                    slug: j.destination.slug,
                    title: j.destination.title,
                    subtitle: j.destination.subtitle,
                    cardImageUrl: j.destination.cardImageUrl
                      ? toServedMediaUrl(j.destination.cardImageUrl)
                      : null,
                    municipality: j.destination.municipality,
                  },
                ]
              : [],
          )
        : [],
    species,
    experiences,
  };
}

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  getSucreNaturalHubDef,
  isSucreNaturalHubId,
  SUCRE_NATURAL_HUBS,
  type SucreNaturalHubId,
} from "@/lib/sucre-natural-hubs";
import {
  type DestinationHubCard,
  type FichaSource,
  hubIdOrNull,
  parseLiveActivities,
  parseStringList,
  publishedOnly,
  toDestinationHubCard,
} from "@/lib/sucre-natural-public";

export type HubLandingCard = {
  id: SucreNaturalHubId;
  title: string;
  tagline: string | null;
  coverImageUrl: string | null;
  accentHsl: string;
  iconLabel: string;
};

export type SucreNaturalLanding = {
  hubs: HubLandingCard[];
  sources: FichaSource[];
  credit: string;
};

export type HubPagePayload = {
  hub: {
    id: SucreNaturalHubId;
    title: string;
    tagline: string | null;
    introMarkdown: string | null;
    coverImageUrl: string | null;
    accentHsl: string;
    iconLabel: string;
  };
  destinations: DestinationHubCard[];
  catalogNote: string | null;
};

export const getSucreNaturalLanding = cache(async (): Promise<SucreNaturalLanding> => {
  const [rows, sources] = await Promise.all([
    prisma.sucreNaturalHub.findMany(),
    prisma.contentSource.findMany({ orderBy: { name: "asc" } }),
  ]);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const hubs: HubLandingCard[] = SUCRE_NATURAL_HUBS.map((def) => {
    const row = byId.get(def.id);
    return {
      id: def.id,
      title: row?.title?.trim() || def.title,
      tagline: row?.tagline?.trim() || def.tagline,
      coverImageUrl: row?.coverImageUrl ?? null,
      accentHsl: def.accentHsl,
      iconLabel: def.iconLabel,
    };
  });
  return {
    hubs,
    sources: sources.map((s) => ({ name: s.name, url: s.url, note: s.note })),
    credit: "Material de referencia: Juana Valentina Patiño Moncada / Sucre Natural",
  };
});

export const getHubPage = cache(async (hubId: string): Promise<HubPagePayload | null> => {
  const id = hubIdOrNull(hubId);
  if (!id) return null;
  const def = getSucreNaturalHubDef(id);
  const [row, destRows] = await Promise.all([
    prisma.sucreNaturalHub.findUnique({ where: { id } }),
    prisma.imperdibleDestination.findMany({
      where: { published: true, hubs: { some: { hubId: id } } },
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        title: true,
        subtitle: true,
        municipality: true,
        cardImageUrl: true,
        published: true,
      },
    }),
  ]);
  const destinations = destRows.flatMap((d) => {
    const card = toDestinationHubCard(d);
    return card ? [card] : [];
  });
  const catalogNote =
    id === "biodiversidad" || id === "experiencias"
      ? null
      : destinations.length === 0
        ? "Aún no hay destinos publicados en este hub."
        : null;
  return {
    hub: {
      id,
      title: row?.title?.trim() || def.title,
      tagline: row?.tagline?.trim() || def.tagline,
      introMarkdown: row?.introMarkdown ?? null,
      coverImageUrl: row?.coverImageUrl ?? null,
      accentHsl: def.accentHsl,
      iconLabel: def.iconLabel,
    },
    destinations,
    catalogNote,
  };
});

export const getBiodiversityHub = cache(async () => {
  const entries = await prisma.biodiversityEntry.findMany({
    where: { published: true },
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { commonName: "asc" }],
  });
  return publishedOnly(entries);
});

export const getBiodiversityBySlug = cache(async (slug: string) => {
  const row = await prisma.biodiversityEntry.findFirst({
    where: { slug: slug.trim(), published: true },
    include: {
      destinations: {
        include: {
          destination: {
            select: {
              slug: true,
              title: true,
              subtitle: true,
              municipality: true,
              cardImageUrl: true,
              published: true,
            },
          },
        },
      },
    },
  });
  if (!row) return null;
  return {
    ...row,
    destinations: row.destinations.flatMap((j) => {
      const card = toDestinationHubCard(j.destination);
      return card ? [card] : [];
    }),
  };
});

export const getExperiencesHub = cache(async () => {
  const rows = await prisma.natureExperience.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return publishedOnly(rows);
});

export const getExperienceBySlug = cache(async (slug: string) => {
  const row = await prisma.natureExperience.findFirst({
    where: { slug: slug.trim(), published: true },
    include: {
      destinations: {
        include: {
          destination: {
            select: {
              slug: true,
              title: true,
              subtitle: true,
              municipality: true,
              cardImageUrl: true,
              published: true,
            },
          },
        },
      },
    },
  });
  if (!row) return null;
  return {
    ...row,
    whatYouDo: parseStringList(row.whatYouDo),
    recommendations: parseStringList(row.recommendations),
    destinations: row.destinations.flatMap((j) => {
      const card = toDestinationHubCard(j.destination);
      return card ? [card] : [];
    }),
  };
});

export { isSucreNaturalHubId, parseLiveActivities, parseStringList };

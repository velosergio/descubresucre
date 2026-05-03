import { prisma } from "@/lib/prisma";

export type ImperdibleDetail = {
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string;
  bodyMarkdown: string;
  mapLat: number;
  mapLng: number;
  mapZoom: number;
};

export async function getImperdibleBySlug(slug: string): Promise<ImperdibleDetail | null> {
  const row = await prisma.imperdibleDestination.findFirst({
    where: { slug: slug.trim(), published: true },
  });
  if (!row) return null;
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    cardImageUrl: row.cardImageUrl,
    bodyMarkdown: row.bodyMarkdown,
    mapLat: Number(row.mapLat),
    mapLng: Number(row.mapLng),
    mapZoom: row.mapZoom,
  };
}

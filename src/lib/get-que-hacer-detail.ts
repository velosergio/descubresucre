import { galleryPublicUrlExists } from "@/lib/gallery-assets";
import { prisma } from "@/lib/prisma";
import { resolveQueHacerIcon } from "@/lib/que-hacer-icons";
import { filterLivePhotos, isActivityPubliclyVisible } from "@/lib/que-hacer-photos";

export type QueHacerDetailPhoto = {
  publicUrl: string;
  alt: string;
};

export type QueHacerDetailDestination = {
  slug: string;
  title: string;
  subtitle: string;
};

export type QueHacerDetail = {
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  iconLabel: string;
  photos: QueHacerDetailPhoto[];
  categories: { slug: string; name: string }[];
  destinations: QueHacerDetailDestination[];
};

export async function getQueHacerBySlug(slug: string): Promise<QueHacerDetail | null> {
  const row = await prisma.queHacerActivity.findFirst({
    where: { slug: slug.trim() },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true } },
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
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    iconKey: icon.key,
    iconLabel: icon.label,
    photos: live.map((p) => ({
      publicUrl: p.publicUrl,
      alt: p.alt?.trim() || row.title,
    })),
    categories: row.categories
      .map((j) => ({ slug: j.category.slug, name: j.category.name }))
      .toSorted((a, b) => a.name.localeCompare(b.name, "es")),
    destinations: row.destinations.flatMap((j) =>
      j.destination.published
        ? [
            {
              slug: j.destination.slug,
              title: j.destination.title,
              subtitle: j.destination.subtitle,
            },
          ]
        : [],
    ),
  };
}

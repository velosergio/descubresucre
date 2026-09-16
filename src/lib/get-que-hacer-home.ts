import { galleryPublicUrlExists } from "@/lib/gallery-assets";
import { prisma } from "@/lib/prisma";
import { shouldUseHomeCardCarousel } from "@/lib/que-hacer-home";
import { resolveQueHacerIcon } from "@/lib/que-hacer-icons";
import {
  filterLivePhotos,
  isActivityPubliclyVisible,
  pickCoverPhoto,
} from "@/lib/que-hacer-photos";

export type QueHacerHomeCard = {
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  iconLabel: string;
  coverUrl: string;
  coverAlt: string;
};

export type QueHacerHomePayload = {
  items: QueHacerHomeCard[];
  useCardCarousel: boolean;
};

export async function getQueHacerForHome(): Promise<QueHacerHomePayload> {
  const rows = await prisma.queHacerActivity.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });

  const existence = await Promise.all(
    rows.flatMap((r) => r.photos.map((p) => galleryPublicUrlExists(p.publicUrl))),
  );
  const liveUrlSet = new Set<string>();
  let i = 0;
  for (const r of rows) {
    for (const p of r.photos) {
      if (existence[i]) liveUrlSet.add(p.publicUrl.trim());
      i += 1;
    }
  }

  const items: QueHacerHomeCard[] = [];
  for (const row of rows) {
    const live = filterLivePhotos(row.photos, liveUrlSet);
    if (!isActivityPubliclyVisible(row.published, live)) continue;
    const cover = pickCoverPhoto(live);
    if (!cover) continue;
    const icon = resolveQueHacerIcon(row.iconKey);
    items.push({
      slug: row.slug,
      title: row.title,
      description: row.description,
      iconKey: icon.key,
      iconLabel: icon.label,
      coverUrl: cover.publicUrl,
      coverAlt: cover.alt?.trim() || row.title,
    });
  }

  return {
    items,
    useCardCarousel: shouldUseHomeCardCarousel(items.length),
  };
}

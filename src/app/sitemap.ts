import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteOrigin } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteOrigin().replace(/\/$/, "");
  const homeUrl = `${base}/`;

  const homeEntry = {
    url: homeUrl,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  try {
    const imperdibles = await prisma.imperdibleDestination.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    return [
      homeEntry,
      ...imperdibles.map((d) => ({
        url: `${base}/imperdibles/${d.slug}`,
        lastModified: d.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return [homeEntry];
  }
}

import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  const sitemapUrl = `${origin}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapUrl,
  };
}

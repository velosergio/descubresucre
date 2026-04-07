import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();

  return [
    {
      url: base.endsWith("/") ? base : `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Añade aquí nuevas rutas públicas (ej. /destinos/tolu) cuando existan.
  ];
}

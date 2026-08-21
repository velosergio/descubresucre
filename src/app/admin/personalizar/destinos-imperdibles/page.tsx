import { ImperdiblesAdminClient } from "@/components/admin/imperdibles-admin-client";
import { getOrCreateSectionSettings } from "@/lib/get-imperdibles-home";
import { prisma } from "@/lib/prisma";

export default async function AdminDestinosImperdiblesPage() {
  const [settings, rows] = await Promise.all([
    getOrCreateSectionSettings(),
    prisma.imperdibleDestination.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const initialDestinations = rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    title: d.title,
    subtitle: d.subtitle,
    cardImageUrl: d.cardImageUrl,
    bodyMarkdown: d.bodyMarkdown,
    mapLat: Number(d.mapLat),
    mapLng: Number(d.mapLng),
    mapZoom: d.mapZoom,
    published: d.published,
    sortOrder: d.sortOrder,
  }));

  const clientKey = `${settings.updatedAt.getTime()}-${rows.map((r) => r.updatedAt.getTime()).join(",")}`;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Destinos imperdibles
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Gestiona las tarjetas de la portada y el contenido de detalle. Las imágenes pueden
          elegirse desde la galería o subirse aquí (se registran en la galería).
        </p>
      </div>

      <ImperdiblesAdminClient
        key={clientKey}
        initialSettings={{
          displayMode: settings.displayMode,
          itemOrder: settings.itemOrder,
          headingTitle: settings.headingTitle,
          headingSubtitle: settings.headingSubtitle,
          carouselIntervalMs: settings.carouselIntervalMs,
        }}
        initialDestinations={initialDestinations}
      />
    </div>
  );
}

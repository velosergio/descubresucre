import { QueHacerAdmin } from "@/components/admin/que-hacer-admin";
import { prisma } from "@/lib/prisma";
import { DEFAULT_ACTIVITY_ACCENT_HSL, isQueHacerListingMode } from "@/lib/que-hacer-listing-mode";

export default async function AdminQueHacerPage() {
  const [activities, destinations] = await Promise.all([
    prisma.queHacerActivity.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        photos: { orderBy: { sortOrder: "asc" } },
        destinations: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.imperdibleDestination.findMany({
      where: { published: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold">Qué hacer</h1>
        <p className="text-muted-foreground">
          Actividades temáticas de la portada: listado, lema, acento y destinos asociados.
        </p>
      </div>
      <QueHacerAdmin
        initialActivities={activities.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          description: a.description,
          iconKey: a.iconKey,
          tagline: a.tagline ?? "",
          introMarkdown: a.introMarkdown ?? "",
          accentHsl: a.accentHsl ?? DEFAULT_ACTIVITY_ACCENT_HSL,
          listingMode: isQueHacerListingMode(a.listingMode) ? a.listingMode : "DESTINATIONS",
          published: a.published,
          sortOrder: a.sortOrder,
          photoUrls: a.photos.map((p) => p.publicUrl),
          photoAlts: a.photos.map((p) => p.alt),
          coverUrl: a.photos.find((p) => p.isCover)?.publicUrl ?? a.photos[0]?.publicUrl ?? "",
          destinationIds: a.destinations.map((j) => j.destinationId),
        }))}
        destinations={destinations}
      />
    </div>
  );
}

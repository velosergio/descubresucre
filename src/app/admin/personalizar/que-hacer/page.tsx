import { QueHacerAdmin } from "@/components/admin/que-hacer-admin";
import { prisma } from "@/lib/prisma";

export default async function AdminQueHacerPage() {
  const [activities, categories, destinations] = await Promise.all([
    prisma.queHacerActivity.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        photos: { orderBy: { sortOrder: "asc" } },
        categories: true,
        destinations: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.queHacerCategory.findMany({ orderBy: { sortOrder: "asc" } }),
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
          Actividades de la portada y categorías compartidas con destinos. Distinto de Sucre
          Natural.
        </p>
      </div>
      <QueHacerAdmin
        initialActivities={activities.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          description: a.description,
          iconKey: a.iconKey,
          published: a.published,
          sortOrder: a.sortOrder,
          photoUrls: a.photos.map((p) => p.publicUrl),
          photoAlts: a.photos.map((p) => p.alt),
          coverUrl: a.photos.find((p) => p.isCover)?.publicUrl ?? a.photos[0]?.publicUrl ?? "",
          categoryIds: a.categories.map((j) => j.categoryId),
          destinationIds: a.destinations.map((j) => j.destinationId),
        }))}
        initialCategories={categories.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          description: c.description ?? "",
          sortOrder: c.sortOrder,
        }))}
        destinations={destinations}
      />
    </div>
  );
}

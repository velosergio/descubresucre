import { BiodiversidadAdmin } from "@/components/admin/biodiversidad-admin";
import { prisma } from "@/lib/prisma";

export default async function AdminBiodiversidadPage() {
  const [entries, destinations] = await Promise.all([
    prisma.biodiversityEntry.findMany({
      orderBy: { sortOrder: "asc" },
      include: { destinations: true },
    }),
    prisma.imperdibleDestination.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold">Biodiversidad</h1>
        <p className="text-muted-foreground">
          Fichas de fauna, flora y ecosistemas enlazadas a destinos.
        </p>
      </div>
      <BiodiversidadAdmin
        initialEntries={entries.map((e) => ({
          id: e.id,
          slug: e.slug,
          kind: e.kind,
          groupKey: e.groupKey,
          commonName: e.commonName,
          scientificName: e.scientificName ?? "",
          summary: e.summary,
          whereFound: e.whereFound ?? "",
          published: e.published,
          destinationIds: e.destinations.map((j) => j.destinationId),
        }))}
        destinations={destinations}
      />
    </div>
  );
}

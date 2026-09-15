import { ExperienciasNaturalezaAdmin } from "@/components/admin/experiencias-naturaleza-admin";
import { prisma } from "@/lib/prisma";
import { parseStringList } from "@/lib/sucre-natural-public";

export default async function AdminExperienciasNaturalezaPage() {
  const [rows, destinations] = await Promise.all([
    prisma.natureExperience.findMany({
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
        <h1 className="font-display text-3xl font-bold">Experiencias en naturaleza</h1>
        <p className="text-muted-foreground">
          Distintas del CMS “Qué hacer”. Aquí se publican las vivencias del hub naranja.
        </p>
      </div>
      <ExperienciasNaturalezaAdmin
        initialRows={rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          tagline: r.tagline ?? "",
          whereText: r.whereText ?? "",
          whatYouDoText: parseStringList(r.whatYouDo).join("\n"),
          specialWhy: r.specialWhy ?? "",
          recommendationsText: parseStringList(r.recommendations).join("\n"),
          published: r.published,
          destinationIds: r.destinations.map((j) => j.destinationId),
        }))}
        destinations={destinations}
      />
    </div>
  );
}

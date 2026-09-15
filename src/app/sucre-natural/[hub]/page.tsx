import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiodiversityGroupedList } from "@/components/sucre-natural/biodiversidad-grouped-list";
import { PolaroidImage } from "@/components/sucre-natural/polaroid-image";
import {
  getBiodiversityHub,
  getExperiencesHub,
  getHubPage,
  type HubPagePayload,
} from "@/lib/get-sucre-natural-public";
import { getSucreNaturalHubDef, isSucreNaturalHubId } from "@/lib/sucre-natural-hubs";

type Props = { params: Promise<{ hub: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub } = await params;
  if (!isSucreNaturalHubId(hub)) return { title: "Sucre Natural | Sucre Vivo" };
  const def = getSucreNaturalHubDef(hub);
  return { title: `${def.title} | Sucre Natural` };
}

function CatalogPendingNote() {
  return (
    <p className="font-body text-[hsl(var(--sn-ink)/0.7)]">
      Catálogo en construcción. Pronto verás fichas de este tema.
    </p>
  );
}

function BiodiversidadCatalogSection({
  species,
}: {
  species: Awaited<ReturnType<typeof getBiodiversityHub>>;
}) {
  if (species.length === 0) return <CatalogPendingNote />;
  return (
    <section className="space-y-8" aria-labelledby="especies-heading">
      <h2 id="especies-heading" className="font-display text-2xl font-semibold">
        Catálogo de especies
      </h2>
      <BiodiversityGroupedList
        items={species.map((sp) => ({
          slug: sp.slug,
          commonName: sp.commonName,
          scientificName: sp.scientificName,
          groupKey: sp.groupKey,
        }))}
      />
    </section>
  );
}

function ExperienciasCatalogSection({
  experiences,
}: {
  experiences: Awaited<ReturnType<typeof getExperiencesHub>>;
}) {
  if (experiences.length === 0) return <CatalogPendingNote />;
  return (
    <section className="space-y-4" aria-labelledby="exp-heading">
      <h2 id="exp-heading" className="font-display text-2xl font-semibold">
        Experiencias
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {experiences.map((exp) => (
          <li key={exp.slug}>
            <Link
              href={`/sucre-natural/experiencias/${exp.slug}`}
              className="block rounded-xl border border-[hsl(var(--sn-ink)/0.08)] bg-white/70 p-4 outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
            >
              <p className="font-display text-lg font-semibold">{exp.title}</p>
              {exp.tagline ? (
                <p className="mt-1 font-body text-sm text-[hsl(var(--sn-ink)/0.7)]">
                  {exp.tagline}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DestinosSection({
  destinations,
  catalogNote,
}: {
  destinations: HubPagePayload["destinations"];
  catalogNote: string | null;
}) {
  if (destinations.length === 0) {
    return catalogNote ? (
      <p className="font-body text-[hsl(var(--sn-ink)/0.7)]">{catalogNote}</p>
    ) : null;
  }
  return (
    <section className="space-y-4" aria-labelledby="destinos-heading">
      <h2 id="destinos-heading" className="font-display text-2xl font-semibold">
        Destinos
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((dest) => (
          <li key={dest.slug}>
            <Link
              href={`/imperdibles/${dest.slug}`}
              className="block outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
            >
              <PolaroidImage src={dest.cardImageUrl} alt={dest.title} />
              <h3 className="mt-3 font-display text-lg font-bold">{dest.title}</h3>
              <p className="font-body text-sm text-[hsl(var(--sn-ink)/0.7)]">{dest.subtitle}</p>
              {dest.municipality ? (
                <p className="mt-1 font-body text-xs uppercase tracking-wide text-[hsl(var(--sn-ink)/0.55)]">
                  {dest.municipality}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SucreNaturalHubPage({ params }: Props) {
  const { hub } = await params;
  const page = await getHubPage(hub);
  if (!page) notFound();

  const Icon = getSucreNaturalHubDef(page.hub.id).icon;
  const species = page.hub.id === "biodiversidad" ? await getBiodiversityHub() : null;
  const experiences = page.hub.id === "experiencias" ? await getExperiencesHub() : null;

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10" data-hub={page.hub.id}>
      <header className="max-w-3xl space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--sn-accent)/0.15)] px-3 py-1 font-body text-sm font-semibold">
          <Icon className="size-4" aria-hidden />
          {page.hub.iconLabel}
        </p>
        <h1 className="sn-brush-title font-display text-4xl font-bold text-[hsl(var(--sn-ink))]">
          {page.hub.title}
        </h1>
        {page.hub.tagline ? (
          <p className="font-body text-lg text-[hsl(var(--sn-ink)/0.8)]">{page.hub.tagline}</p>
        ) : null}
        {page.hub.introMarkdown ? (
          <p className="font-body text-[hsl(var(--sn-ink)/0.75)]">{page.hub.introMarkdown}</p>
        ) : null}
      </header>

      {species ? <BiodiversidadCatalogSection species={species} /> : null}
      {experiences ? <ExperienciasCatalogSection experiences={experiences} /> : null}

      <DestinosSection destinations={page.destinations} catalogNote={page.catalogNote} />
    </main>
  );
}

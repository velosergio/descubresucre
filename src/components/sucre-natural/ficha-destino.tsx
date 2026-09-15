import type { ReactNode } from "react";
import "@/app/sucre-natural/sucre-natural.css";
import {
  Binoculars,
  Camera,
  Compass,
  Droplets,
  ExternalLink,
  Fish,
  Footprints,
  Moon,
  Mountain,
  Ship,
  Sun,
  TreePine,
  Users,
  Utensils,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { FichaBreadcrumb } from "@/components/sucre-natural/ficha-breadcrumb";
import { PolaroidImage } from "@/components/sucre-natural/polaroid-image";
import type {
  BiodiversityChip,
  FichaGalleryItem,
  FichaSource,
  LiveActivity,
} from "@/lib/sucre-natural-public";
import { isNonEmptyList, isNonEmptyText } from "@/lib/sucre-natural-resolve";

export type FichaDestinoView = {
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string | null;
  municipality: string | null;
  region: string | null;
  locationLabel: string | null;
  ecosystems: string | null;
  approach: string | null;
  specialWhy: string | null;
  howToArrive: string | null;
  climate: string | null;
  recommendedTime: string | null;
  audience: string | null;
  mapNote: string | null;
  mapLat: number | null;
  mapLng: number | null;
  mapZoom: number;
  liveActivities: LiveActivity[];
  responsibleTips: string[];
  biodiversityChips: BiodiversityChip[];
  gallery: FichaGalleryItem[];
  sources: FichaSource[];
  hubs: { id: string; title: string }[];
};

const ACTIVITY_ICONS: Record<string, typeof Waves> = {
  waves: Waves,
  fish: Fish,
  binoculars: Binoculars,
  sun: Sun,
  utensils: Utensils,
  users: Users,
  ship: Ship,
  tree: TreePine,
  camera: Camera,
  moon: Moon,
  mountain: Mountain,
  droplet: Droplets,
  bird: Binoculars,
  footprints: Footprints,
  compass: Compass,
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="sn-brush-title font-display text-2xl font-bold text-[hsl(var(--sn-ink))]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function UbicacionSection({ ficha }: { ficha: FichaDestinoView }) {
  if (!isNonEmptyText(ficha.municipality) && !isNonEmptyText(ficha.locationLabel)) return null;
  return (
    <Section title="Ubicación">
      <p className="font-body text-[hsl(var(--sn-ink))]">
        {[ficha.locationLabel, ficha.municipality, ficha.region].filter(isNonEmptyText).join(" · ")}
      </p>
    </Section>
  );
}

function TreintaSegundosSection({ ficha }: { ficha: FichaDestinoView }) {
  const bits = [ficha.locationLabel, ficha.region, ficha.ecosystems, ficha.approach].filter(
    isNonEmptyText,
  );
  if (bits.length === 0) return null;
  return (
    <Section title="El destino en 30 segundos">
      <ul className="grid gap-2 font-body sm:grid-cols-2">
        {isNonEmptyText(ficha.locationLabel) ? (
          <li>
            <span className="sn-section-label">Ubicación</span>
            <p>{ficha.locationLabel}</p>
          </li>
        ) : null}
        {isNonEmptyText(ficha.region) ? (
          <li>
            <span className="sn-section-label">Región</span>
            <p>{ficha.region}</p>
          </li>
        ) : null}
        {isNonEmptyText(ficha.ecosystems) ? (
          <li>
            <span className="sn-section-label">Ecosistemas</span>
            <p>{ficha.ecosystems}</p>
          </li>
        ) : null}
        {isNonEmptyText(ficha.approach) ? (
          <li>
            <span className="sn-section-label">Enfoque</span>
            <p>{ficha.approach}</p>
          </li>
        ) : null}
      </ul>
    </Section>
  );
}

function OptionalTextSection({
  title,
  text,
  paragraphClassName = "font-body",
}: {
  title: string;
  text: string | null;
  paragraphClassName?: string;
}) {
  if (!isNonEmptyText(text)) return null;
  return (
    <Section title={title}>
      <p className={paragraphClassName}>{text}</p>
    </Section>
  );
}

function BiodiversidadSection({ chips }: { chips: BiodiversityChip[] }) {
  if (chips.length === 0) return null;
  return (
    <Section title="Biodiversidad">
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={`${chip.label}-${chip.href ?? "label"}`}>
            {chip.href ? (
              <Link
                href={chip.href}
                className="inline-flex rounded-full bg-[hsl(var(--sn-accent)/0.15)] px-3 py-1 font-body text-sm font-medium text-[hsl(var(--sn-ink))] outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
              >
                {chip.label}
              </Link>
            ) : (
              <span className="inline-flex rounded-full bg-[hsl(var(--sn-accent)/0.15)] px-3 py-1 font-body text-sm font-medium text-[hsl(var(--sn-ink))]">
                {chip.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ViveElDestinoSection({ activities }: { activities: LiveActivity[] }) {
  if (activities.length === 0) return null;
  return (
    <Section title="Vive el destino">
      <ul className="grid gap-3 sm:grid-cols-2">
        {activities.map((act) => {
          const Icon = (act.iconKey && ACTIVITY_ICONS[act.iconKey]) || Compass;
          return (
            <li
              key={act.title}
              className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2 font-body"
            >
              <Icon className="size-4 shrink-0 text-[hsl(var(--sn-accent))]" aria-hidden />
              <span>{act.title}</span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function TurismoResponsableSection({ tips }: { tips: string[] }) {
  if (!isNonEmptyList(tips)) return null;
  return (
    <Section title="Turismo responsable">
      <ul className="list-disc space-y-1 pl-5 font-body">
        {tips
          .filter((t) => t.trim())
          .map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
      </ul>
    </Section>
  );
}

function GaleriaSection({ gallery }: { gallery: FichaGalleryItem[] }) {
  if (gallery.length === 0) return null;
  return (
    <Section title="Galería">
      <div className="grid gap-6 sm:grid-cols-2">
        {gallery.map((item) => (
          <PolaroidImage key={item.publicUrl} src={item.publicUrl} alt={item.alt} />
        ))}
      </div>
    </Section>
  );
}

function MapaSection({
  embedUrl,
  title,
  mapNote,
}: {
  embedUrl: string | null;
  title: string;
  mapNote: string | null;
}) {
  if (embedUrl) {
    return (
      <Section title="Mapa">
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-[hsl(var(--sn-ink)/0.12)]">
          <iframe
            title={`Mapa de ${title}`}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-popups allow-forms"
            src={embedUrl}
          />
        </div>
        {isNonEmptyText(mapNote) ? (
          <p className="font-body text-sm text-[hsl(var(--sn-ink)/0.7)]">{mapNote}</p>
        ) : null}
      </Section>
    );
  }
  if (isNonEmptyText(mapNote)) {
    return (
      <Section title="Mapa">
        <p className="font-body">{mapNote}</p>
      </Section>
    );
  }
  return null;
}

function FuentesSection({ sources }: { sources: FichaSource[] }) {
  if (sources.length === 0) return null;
  return (
    <Section title="Fuentes">
      <ul className="space-y-2 font-body text-sm">
        {sources.map((s) => (
          <li key={s.name}>
            {s.url ? (
              <a
                href={s.url}
                className="inline-flex items-center gap-1 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
                target="_blank"
                rel="noreferrer"
              >
                {s.name}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : (
              s.name
            )}
            {s.note ? <span className="text-[hsl(var(--sn-ink)/0.65)]"> — {s.note}</span> : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function FichaDestino({ ficha }: { ficha: FichaDestinoView }) {
  const hasCoords = ficha.mapLat != null && ficha.mapLng != null;
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const embedUrl =
    mapsKey && hasCoords
      ? `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(mapsKey)}&center=${ficha.mapLat},${ficha.mapLng}&zoom=${ficha.mapZoom}`
      : null;

  return (
    <article className="sn-paper min-h-screen" data-hub={ficha.hubs[0]?.id}>
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-8 md:py-12">
        <FichaBreadcrumb hubs={ficha.hubs} currentLabel={ficha.title} />

        <header className="space-y-4">
          <PolaroidImage src={ficha.cardImageUrl} alt={ficha.title} priority />
          <h1 className="sn-brush-title font-display text-4xl font-bold tracking-tight text-[hsl(var(--sn-ink))] md:text-5xl">
            {ficha.title}
          </h1>
          {isNonEmptyText(ficha.subtitle) ? (
            <p className="max-w-2xl font-body text-lg text-[hsl(var(--sn-ink)/0.8)]">
              {ficha.subtitle}
            </p>
          ) : null}
        </header>

        <UbicacionSection ficha={ficha} />
        <TreintaSegundosSection ficha={ficha} />
        <OptionalTextSection
          title="Qué lo hace especial"
          text={ficha.specialWhy}
          paragraphClassName="font-body leading-relaxed text-[hsl(var(--sn-ink))]"
        />
        <BiodiversidadSection chips={ficha.biodiversityChips} />
        <ViveElDestinoSection activities={ficha.liveActivities} />
        <TurismoResponsableSection tips={ficha.responsibleTips} />
        <OptionalTextSection title="Cómo llegar" text={ficha.howToArrive} />
        <OptionalTextSection title="Clima" text={ficha.climate} />
        <OptionalTextSection title="Tiempo recomendado" text={ficha.recommendedTime} />
        <OptionalTextSection title="Para quién" text={ficha.audience} />
        <GaleriaSection gallery={ficha.gallery} />
        <MapaSection embedUrl={embedUrl} title={ficha.title} mapNote={ficha.mapNote} />
        <FuentesSection sources={ficha.sources} />
      </div>
    </article>
  );
}

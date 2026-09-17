"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { BiodiversityGroupedList } from "@/components/sucre-natural/biodiversidad-grouped-list";
import { PolaroidImage } from "@/components/sucre-natural/polaroid-image";
import type { QueHacerDetail } from "@/lib/get-que-hacer-detail";
import { resolveQueHacerIcon } from "@/lib/que-hacer-icons";
import { toServedMediaUrl } from "@/lib/media-url";

function CatalogPendingNote({ message }: { message: string }) {
  return <p className="font-body text-[hsl(var(--sn-ink)/0.7)]">{message}</p>;
}

export function ActivityThemePage({ detail }: { detail: QueHacerDetail }) {
  const icon = resolveQueHacerIcon(detail.iconKey);
  const Icon = icon.Icon;
  const accent = detail.accentHsl;

  return (
    <main
      className="mx-auto max-w-6xl space-y-10 px-4 py-10"
      style={
        {
          "--sn-accent": accent,
          "--sn-ink": "30 25% 18%",
        } as CSSProperties
      }
      data-theme-slug={detail.slug}
      data-listing-mode={detail.listingMode}
    >
      <header className="max-w-3xl space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--sn-accent)/0.15)] px-3 py-1 font-body text-sm font-semibold text-[hsl(var(--sn-ink))]">
          <Icon className="size-4" aria-hidden />
          {detail.iconLabel}
        </p>
        <h1 className="sn-brush-title font-display text-4xl font-bold text-[hsl(var(--sn-ink))]">
          {detail.title}
        </h1>
        {detail.tagline ? (
          <p className="font-body text-lg text-[hsl(var(--sn-ink)/0.8)]">{detail.tagline}</p>
        ) : (
          <p className="font-body text-lg text-[hsl(var(--sn-ink)/0.8)]">{detail.description}</p>
        )}
        {detail.introMarkdown ? (
          <p className="font-body text-[hsl(var(--sn-ink)/0.75)]">{detail.introMarkdown}</p>
        ) : null}
      </header>

      {detail.photos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detail.photos.map((photo) => (
            <PolaroidImage
              key={photo.publicUrl}
              src={toServedMediaUrl(photo.publicUrl)}
              alt={photo.alt}
            />
          ))}
        </div>
      ) : null}

      {detail.listingMode === "BIODIVERSITY" ? (
        <section className="space-y-8" aria-labelledby="especies-heading">
          <h2 id="especies-heading" className="font-display text-2xl font-semibold">
            Catálogo de especies
          </h2>
          {detail.species.length === 0 ? (
            <CatalogPendingNote message="Catálogo en construcción. Pronto verás fichas de este tema." />
          ) : (
            <BiodiversityGroupedList items={detail.species} />
          )}
        </section>
      ) : null}

      {detail.listingMode === "EXPERIENCES" ? (
        <section className="space-y-8" aria-labelledby="experiencias-heading">
          <h2 id="experiencias-heading" className="font-display text-2xl font-semibold">
            Experiencias
          </h2>
          {detail.experiences.length === 0 ? (
            <CatalogPendingNote message="Catálogo en construcción. Pronto verás experiencias de este tema." />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {detail.experiences.map((ex) => (
                <li key={ex.slug}>
                  <Link
                    href={`/sucre-natural/experiencias/${ex.slug}`}
                    className="block outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
                  >
                    <PolaroidImage src={ex.imageUrl} alt={ex.title} />
                    <h3 className="mt-3 font-display text-lg font-bold">{ex.title}</h3>
                    {ex.tagline ? (
                      <p className="font-body text-sm text-[hsl(var(--sn-ink)/0.7)]">{ex.tagline}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {detail.listingMode === "DESTINATIONS" ? (
        <section className="space-y-8" aria-labelledby="destinos-heading">
          <h2 id="destinos-heading" className="font-display text-2xl font-semibold">
            Destinos
          </h2>
          {detail.destinations.length === 0 ? (
            <CatalogPendingNote message="Aún no hay destinos publicados en este tema." />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {detail.destinations.map((dest) => (
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
          )}
        </section>
      ) : null}
    </main>
  );
}

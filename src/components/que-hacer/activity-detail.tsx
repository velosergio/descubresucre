"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { QueHacerDetail } from "@/lib/get-que-hacer-detail";
import { toServedMediaUrl } from "@/lib/media-url";
import { resolveQueHacerIcon } from "@/lib/que-hacer-icons";

export function ActivityDetail({ detail }: { detail: QueHacerDetail }) {
  const icon = resolveQueHacerIcon(detail.iconKey);
  const Icon = icon.Icon;
  const photos = detail.photos;
  const useCarousel = photos.length > 1;

  return (
    <article className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Link
          href="/#que-hacer"
          className="mb-6 inline-flex items-center gap-2 font-body text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver al inicio
        </Link>

        {photos.length > 0 ? (
          useCarousel ? (
            <div className="relative mb-8 px-10 md:px-14">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                  {photos.map((photo) => (
                    <CarouselItem key={photo.publicUrl}>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                        <Image
                          src={toServedMediaUrl(photo.publicUrl)}
                          alt={photo.alt || detail.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 896px) 100vw, 896px"
                          unoptimized
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" aria-label="Foto anterior" />
                <CarouselNext className="right-0" aria-label="Foto siguiente" />
              </Carousel>
            </div>
          ) : (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={toServedMediaUrl(photos[0].publicUrl)}
                alt={photos[0].alt || detail.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            </div>
          )
        ) : null}

        <header className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <Icon className="size-6" aria-hidden />
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {detail.title}
            </h1>
          </div>
          {detail.categories.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {detail.categories.map((cat) => (
                <li
                  key={cat.slug}
                  className="rounded-full bg-muted px-3 py-1 font-body text-sm text-foreground"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="max-w-2xl font-body text-lg text-muted-foreground">{detail.description}</p>
        </header>

        {detail.destinations.length > 0 ? (
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-foreground">Dónde vivirlo</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {detail.destinations.map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/imperdibles/${dest.slug}`}
                    className="block rounded-xl border border-border/80 bg-card p-4 outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="font-display font-semibold text-foreground">{dest.title}</span>
                    {dest.subtitle ? (
                      <span className="mt-1 block font-body text-sm text-muted-foreground">
                        {dest.subtitle}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}

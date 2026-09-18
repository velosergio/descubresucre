"use client";

import Autoplay from "embla-carousel-autoplay";
import * as m from "framer-motion/m";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTiltCard } from "@/hooks/use-tilt-card";
import type { QueHacerHomeCard, QueHacerHomePayload } from "@/lib/get-que-hacer-home";
import { toServedMediaUrl } from "@/lib/media-url";
import { EXPO_OUT } from "@/lib/motion";
import { QUE_HACER_AUTOPLAY_MS } from "@/lib/que-hacer-home";
import { resolveQueHacerIcon } from "@/lib/que-hacer-icons";

function ActivityCard({ item }: { item: QueHacerHomeCard }) {
  const icon = resolveQueHacerIcon(item.iconKey);
  const Icon = icon.Icon;
  const src = toServedMediaUrl(item.coverUrl);
  const tilt = useTiltCard<HTMLAnchorElement>();
  return (
    <Link
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      href={`/que-hacer/${item.slug}`}
      className="group tilt-card relative block aspect-square overflow-hidden rounded-2xl bg-card"
    >
      <Image
        src={src}
        alt={item.coverAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-foreground/55 transition-colors group-hover:bg-foreground/65" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-primary-foreground">
        <Icon className="mb-3 h-10 w-10" aria-hidden />
        <h3 className="font-display text-lg font-bold">{item.title}</h3>
        <p className="mt-1 font-body text-xs text-primary-foreground/85">{item.description}</p>
      </div>
    </Link>
  );
}

export default function ActivitiesSection({ payload }: { payload: QueHacerHomePayload }) {
  const { items, useCardCarousel } = payload;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: QUE_HACER_AUTOPLAY_MS,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || items.length < 2) return;
    const id = window.setInterval(() => {
      setBgIndex((i) => (i + 1) % items.length);
    }, QUE_HACER_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, items.length]);

  if (items.length === 0) return null;

  const bgItem = items[bgIndex] ?? items[0];
  const bgSrc = bgItem ? toServedMediaUrl(bgItem.coverUrl) : null;

  return (
    <section id="que-hacer" className="relative overflow-hidden section-padding">
      {bgSrc ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image src={bgSrc} alt="" fill className="object-cover" sizes="100vw" unoptimized />
          <div className="absolute inset-0 bg-background/80" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-muted" aria-hidden />
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-5xl">
            Qué hacer en <span className="text-secondary">Sucre</span>
          </h2>
          <p className="mx-auto max-w-xl font-body text-muted-foreground">
            Actividades para todos los gustos en el corazón del Caribe colombiano
          </p>
        </m.div>

        {useCardCarousel ? (
          <div className="relative px-10 md:px-14">
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={reducedMotion ? [] : [autoplayPlugin]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {items.map((item) => (
                  <CarouselItem
                    key={item.slug}
                    className="pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/5"
                  >
                    <ActivityCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 md:-left-2" aria-label="Anterior" />
              <CarouselNext className="right-0 md:-right-2" aria-label="Siguiente" />
            </Carousel>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {items.map((item, i) => (
              <m.div
                key={item.slug}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EXPO_OUT }}
              >
                <ActivityCard item={item} />
              </m.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

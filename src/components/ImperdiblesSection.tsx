"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import * as m from "framer-motion/m";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import type { ImperdiblesHomePayload } from "@/lib/imperdibles-public";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  payload: ImperdiblesHomePayload;
};

function DestinationCard({
  slug,
  title,
  subtitle,
  cardImageUrl,
}: {
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string;
}) {
  return (
    <Link
      href={`/imperdibles/${slug}`}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl card-hover"
    >
      <Image
        src={cardImageUrl}
        alt=""
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 gradient-card-overlay" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="mb-2 font-display text-xl font-bold text-primary-foreground">{title}</h3>
        <p className="mb-4 font-body text-sm text-primary-foreground/70">{subtitle}</p>
        <span className="inline-flex items-center gap-2 font-body text-sm font-medium text-tropical-gold transition-all group-hover:gap-3">
          Explorar <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function ImperdiblesSection({ payload }: Props) {
  const { settings, items } = payload;
  const headingSubtitle =
    settings.headingSubtitle?.trim() ||
    "Explora los rincones más fascinantes del departamento de Sucre";

  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: settings.carouselIntervalMs,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    [settings.carouselIntervalMs],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="imperdibles" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-5xl">
            {settings.headingTitle?.trim() ? (
              settings.headingTitle.trim()
            ) : (
              <>
                Destinos <span className="text-primary">Imperdibles</span>
              </>
            )}
          </h2>
          <p className="mx-auto max-w-xl font-body text-muted-foreground">{headingSubtitle}</p>
        </m.div>

        {settings.displayMode === "GRID_THREE" ? (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((dest, i) => (
              <m.div
                key={dest.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="cursor-pointer"
              >
                <DestinationCard {...dest} />
              </m.div>
            ))}
          </div>
        ) : (
          <div className="relative px-10 md:px-14">
            <Carousel
              opts={{ align: "start", loop: items.length > 1 }}
              plugins={items.length > 1 ? [autoplayPlugin] : []}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {items.map((dest) => (
                  <CarouselItem key={dest.slug} className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3">
                    <DestinationCard {...dest} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {items.length > 1 ? (
                <>
                  <CarouselPrevious className="left-0 md:-left-2" />
                  <CarouselNext className="right-0 md:-right-2" />
                </>
              ) : null}
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}

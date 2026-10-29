"use client";

import * as m from "framer-motion/m";
import { ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import CunLogo from "@/components/CunLogo";
import { EXPO_OUT } from "@/lib/motion";

const BANNER_STATS = [
  { value: "93 %", label: "de los actores apoya digitalizar los saberes" },
  { value: "23 %", label: "de los saberes está documentado hoy" },
  { value: "5", label: "municipios en el estudio" },
] as const;

/** Banner de la home que lleva a la landing pública del proyecto de investigación. */
export default function InvestigacionBanner() {
  return (
    <section
      aria-labelledby="investigacion-banner-title"
      className="bg-background px-4 pb-16 md:px-8 lg:px-16 lg:pb-24"
    >
      <m.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EXPO_OUT }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-foreground text-primary-foreground"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 90% at 100% 0%, hsl(var(--primary) / 0.6), transparent 70%), radial-gradient(40% 70% at 0% 100%, hsl(var(--secondary) / 0.3), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative grid gap-8 p-8 md:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <CunLogo variant="isotipo-white" className="h-9 md:h-10" />
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 font-body text-sm font-medium text-primary-foreground/85">
                <FlaskConical className="h-4 w-4 text-tropical-gold" aria-hidden />
                Investigación en curso · Semillero CUN
              </p>
            </div>
            <h2
              id="investigacion-banner-title"
              className="mb-4 font-display text-3xl font-bold md:text-4xl"
            >
              Detrás de Sucre Vivo hay una <span className="text-tropical-gold">investigación</span>
            </h2>
            <p className="mb-6 max-w-xl font-body text-primary-foreground/80">
              Conoce el problema que aborda la plataforma, cómo lo estudiamos con actores del
              territorio, lo que encontramos y lo que viene.
            </p>
            <Link
              href="/investigacion"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-tropical-gold"
            >
              Ver el proyecto
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {BANNER_STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col-reverse rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 lg:flex-row-reverse lg:items-center lg:justify-end lg:gap-4"
              >
                <dt className="font-body text-sm text-primary-foreground/75">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-tropical-gold lg:min-w-20">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </m.div>
    </section>
  );
}

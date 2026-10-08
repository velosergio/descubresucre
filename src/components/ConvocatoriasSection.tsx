"use client";

import * as m from "framer-motion/m";
import { ArrowRight, Clock, Megaphone, Users } from "lucide-react";
import { useTiltCard } from "@/hooks/use-tilt-card";
import type { ConvocatoriaPublic, ConvocatoriasHomePayload } from "@/lib/get-convocatorias-home";
import { EXPO_OUT } from "@/lib/motion";

const TYPE_ACCENT_CLASSES = [
  "bg-secondary/10 text-secondary border-secondary/20",
  "bg-primary/10 text-primary border-primary/20",
  "bg-accent/30 text-accent-foreground border-accent/40",
  "bg-tropical-coral/10 text-tropical-coral border-tropical-coral/20",
];

/** Acento visual determinístico por texto de tipo (sin diccionario fijo). */
function typeAccentClass(type: string): string {
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = (hash * 31 + type.charCodeAt(i)) >>> 0;
  }
  return TYPE_ACCENT_CLASSES[hash % TYPE_ACCENT_CLASSES.length] as string;
}

function ConvocatoriaCard({ conv, index }: { conv: ConvocatoriaPublic; index: number }) {
  const tilt = useTiltCard<HTMLDivElement>();
  return (
    <m.div
      initial={{ opacity: 0, y: 26, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EXPO_OUT }}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: mousemove/mouseleave solo animan un tilt decorativo, no gatillan ninguna acción */}
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="tilt-card rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-3 flex items-start justify-between">
          <span
            className={`rounded-full border px-3 py-1 font-body text-xs font-medium ${typeAccentClass(conv.type)}`}
          >
            {conv.type}
          </span>
        </div>
        <h3 className="mb-2 font-display text-lg font-bold text-foreground">{conv.title}</h3>
        <p className="mb-4 font-body text-sm text-muted-foreground">{conv.description}</p>
        <div className="flex flex-wrap items-center gap-4 font-body text-sm">
          <span className="flex items-center gap-1.5 text-tropical-coral">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <span>
              <span className="sr-only">Fecha límite: </span>
              {conv.deadlineLabel}
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" aria-hidden />
            <span>
              <span className="sr-only">Audiencia: </span>
              {conv.audience}
            </span>
          </span>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <a
            href={conv.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary transition-colors hover:underline"
          >
            Más información
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </m.div>
  );
}

export default function ConvocatoriasSection({
  convocatoriasPayload,
}: {
  convocatoriasPayload: ConvocatoriasHomePayload;
}) {
  const items = convocatoriasPayload.items;

  return (
    <section id="convocatorias" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2">
            <Megaphone className="h-4 w-4 text-secondary" aria-hidden />
            <span className="font-body text-sm font-medium text-secondary">
              Oportunidades abiertas
            </span>
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-5xl">
            Convocatorias
          </h2>
          <p className="mx-auto max-w-xl font-body text-muted-foreground">
            Participa en las oportunidades culturales y turísticas del departamento
          </p>
        </m.div>

        {items.length === 0 ? (
          <p className="text-center font-body text-muted-foreground">
            No hay oportunidades abiertas en este momento. Vuelve pronto.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((conv, i) => (
              <ConvocatoriaCard key={conv.id} conv={conv} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

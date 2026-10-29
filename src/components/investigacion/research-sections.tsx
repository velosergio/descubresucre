"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Building2,
  ChartColumn,
  CircleCheck,
  CircleDashed,
  Clock,
  Database,
  Eye,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Layers,
  Lightbulb,
  Lock,
  MapPin,
  Network,
  Quote,
  Scale,
  ShieldCheck,
  Smile,
  Store,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTiltCard } from "@/hooks/use-tilt-card";
import { formatNumber } from "@/lib/format-number";
import {
  ACTOR_SECTORS,
  BENEFITS,
  CONTEXT_SOURCES,
  CONTEXT_STATS,
  DATA_GOVERNANCE,
  DIGITAL_GAP,
  EVALUATION_INDICATORS,
  FUNCTIONAL_REQUIREMENTS,
  GENERAL_OBJECTIVE,
  ICTRC_STRENGTHS,
  ICTRC_WEAKNESSES,
  INSTRUMENTS,
  type IndicatorGroup,
  MUNICIPALITIES,
  type ObjectiveStatus,
  PROTOTYPE_MODULES,
  QUALITATIVE_CATEGORIES,
  REQUIREMENT_COUNTS,
  RESEARCH_PHASES,
  RESEARCH_SECTIONS,
  type RequirementStatus,
  type ResearchSectionId,
  ROADMAP_STAGES,
  SAMPLE_PER_SECTOR,
  SPECIFIC_OBJECTIVES,
  SURVEY_DIMENSIONS,
  SURVEY_INDICATORS,
  TRIANGULATION,
} from "@/lib/investigacion-content";
import { EXPO_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CountUp, Gauge, GrowBar, RankDots } from "./research-infographics";

/* ---------- Piezas compartidas ---------- */

/** Crecimiento horizontal disparado por el contenedor (un hijo en scaleX 0 no tiene área visible). */
const GROW_X = { hidden: { scaleX: 0 }, shown: { scaleX: 1 } };

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EXPO_OUT }}
      className={className}
    >
      {children}
    </m.div>
  );
}

function RevealLi({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EXPO_OUT }}
      className={cn("list-none", className)}
    >
      {children}
    </m.li>
  );
}

function SectionHeader({
  id,
  title,
  highlight,
  intro,
}: {
  id: ResearchSectionId;
  title: string;
  highlight: string;
  intro: string;
}) {
  const meta = RESEARCH_SECTIONS.find((s) => s.id === id);
  return (
    <Reveal className="mb-12 max-w-3xl">
      <p className="mb-3 font-body text-sm font-semibold tracking-widest text-secondary uppercase">
        {meta?.number} · {meta?.label}
      </p>
      <h2
        id={`${id}-title`}
        className="mb-4 font-display text-3xl font-bold text-foreground md:text-5xl"
      >
        {title} <span className="text-primary">{highlight}</span>
      </h2>
      <p className="font-body text-lg text-muted-foreground">{intro}</p>
    </Reveal>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>{children}</div>
  );
}

function CardLabel({ icon: Icon, children }: { icon: typeof Target; children: ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2 font-body text-sm font-semibold text-muted-foreground">
      <Icon className="h-4 w-4 text-primary" aria-hidden />
      {children}
    </p>
  );
}

const STATUS_COPY: Record<ObjectiveStatus, { label: string; className: string }> = {
  logrado: { label: "Logrado", className: "bg-primary/10 text-primary border-primary/20" },
  "en-curso": {
    label: "En curso",
    className: "bg-secondary/10 text-secondary border-secondary/25",
  },
  proximo: {
    label: "Próxima etapa",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function StatusChip({ status }: { status: ObjectiveStatus }) {
  const s = STATUS_COPY[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-semibold",
        s.className,
      )}
    >
      {status === "logrado" ? (
        <CircleCheck className="h-3.5 w-3.5" aria-hidden />
      ) : status === "en-curso" ? (
        <Clock className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <CircleDashed className="h-3.5 w-3.5" aria-hidden />
      )}
      {s.label}
    </span>
  );
}

/** Control segmentado accesible (botones con aria-pressed). */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: NoInfer<T>; label: string }[];
  value: T;
  onChange: (v: NoInfer<T>) => void;
}) {
  return (
    <fieldset className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-muted p-1">
      <legend className="sr-only">{label}</legend>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-4 py-1.5 font-body text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === o.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </fieldset>
  );
}

/* ---------- 01 · Contexto ---------- */

export function ContextSection() {
  const s = CONTEXT_STATS;
  const [ictrcView, setIctrcView] = useState<"fortalezas" | "debilidades">("debilidades");
  const internalTotal = s.internalTourism.overnight + s.internalTourism.sameDay;
  const overnightPct = (s.internalTourism.overnight / internalTotal) * 100;

  return (
    <section
      id="contexto"
      aria-labelledby="contexto-title"
      className="section-padding scroll-mt-16 bg-background"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="contexto"
          title="Un patrimonio rico,"
          highlight="poco conectado"
          intro="Sucre tiene festividades, gastronomía, música, artesanías y playas de sobra, pero su oferta está dispersa y la transformación digital del sector apenas empieza. Las cifras muestran un destino con potencial que aún no compite."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <Card className="h-full">
              <CardLabel icon={Building2}>Ocupación hotelera ({s.hotelOccupancy.period})</CardLabel>
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-baseline justify-between font-body">
                    <span className="font-semibold text-foreground">Sucre</span>
                    <CountUp
                      value={s.hotelOccupancy.sucre}
                      decimals={1}
                      suffix=" %"
                      className="font-display text-2xl font-bold text-tropical-coral"
                    />
                  </div>
                  <GrowBar percent={s.hotelOccupancy.sucre} barClassName="bg-tropical-coral" />
                </div>
                <div>
                  <div className="mb-2 flex items-baseline justify-between font-body">
                    <span className="font-semibold text-foreground">Promedio nacional</span>
                    <CountUp
                      value={s.hotelOccupancy.national}
                      decimals={1}
                      suffix=" %"
                      className="font-display text-2xl font-bold text-primary"
                    />
                  </div>
                  <GrowBar percent={s.hotelOccupancy.national} delay={0.15} />
                </div>
              </div>
              <p className="mt-5 font-body text-sm text-muted-foreground">
                14 puntos por debajo del país, sumando Golfo de Morrosquillo y Sabana.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="h-full">
              <CardLabel icon={ChartColumn}>
                Competitividad turística (ICTRC {s.ictrc.year})
              </CardLabel>
              <p className="mb-4 font-display text-4xl font-bold text-foreground">
                Puesto <CountUp value={s.ictrc.rank} className="text-secondary" />
                <span className="font-body text-base font-medium text-muted-foreground">
                  {" "}
                  de {s.ictrc.total} departamentos
                </span>
              </p>
              <RankDots rank={s.ictrc.rank} total={s.ictrc.total} />
            </Card>
          </Reveal>

          <Reveal delay={0.16}>
            <Card className="h-full">
              <CardLabel icon={Users}>Turismo interno ({s.internalTourism.year})</CardLabel>
              <m.div
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true }}
                className="mb-4 flex h-10 overflow-hidden rounded-xl"
                role="img"
                aria-label={`${formatNumber(s.internalTourism.overnight)} viajeros con pernoctación frente a ${formatNumber(s.internalTourism.sameDay)} excursionistas`}
              >
                <m.div
                  className="h-full origin-left bg-primary"
                  style={{ width: `${overnightPct}%` }}
                  variants={GROW_X}
                  transition={{ duration: 1.1, ease: EXPO_OUT }}
                />
                <div className="h-full flex-1 bg-secondary" />
              </m.div>
              <dl className="grid grid-cols-2 gap-4 font-body">
                <div>
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
                    Con pernoctación
                  </dt>
                  <dd className="font-display text-2xl font-bold text-foreground">
                    <CountUp value={s.internalTourism.overnight} />
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden />
                    Excursionistas
                  </dt>
                  <dd className="font-display text-2xl font-bold text-foreground">
                    <CountUp value={s.internalTourism.sameDay} />
                  </dd>
                </div>
              </dl>
              <p className="mt-4 font-body text-sm text-muted-foreground">
                La mayoría visita sin quedarse: menos noches, menos gasto en el territorio.
              </p>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-2 lg:col-span-3">
            <div className="grid gap-4 rounded-2xl bg-foreground p-6 text-primary-foreground sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-display text-4xl font-bold text-tropical-gold">
                  {s.foreignVisitorsShare}
                </p>
                <p className="mt-1 font-body text-sm text-primary-foreground/70">
                  de los visitantes extranjeros del país (2012-2022)
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 font-display text-4xl font-bold text-tropical-gold">
                  <TrendingDown className="h-7 w-7" aria-hidden />
                  <CountUp value={Math.abs(s.lodgingConstructionChange)} decimals={1} suffix=" %" />
                </p>
                <p className="mt-1 font-body text-sm text-primary-foreground/70">
                  área aprobada para construir alojamiento (2023)
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 font-display text-4xl font-bold text-tropical-gold">
                  <TrendingDown className="h-7 w-7" aria-hidden />
                  <CountUp value={Math.abs(s.lodgingIncomeChange)} decimals={1} suffix=" %" />
                </p>
                <p className="mt-1 font-body text-sm text-primary-foreground/70">
                  ingresos anuales del sector alojamiento
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 font-display text-4xl font-bold text-tropical-gold">
                  <TrendingUp className="h-7 w-7" aria-hidden />
                  <CountUp value={s.lodgingEmploymentChange} decimals={1} suffix=" %" />
                </p>
                <p className="mt-1 font-body text-sm text-primary-foreground/70">
                  personal ocupado: más empleo con menos ingresos
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <h3 className="mb-6 font-display text-2xl font-bold text-foreground">
                La brecha digital del turismo en Sucre
              </h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {DIGITAL_GAP.map((g, i) => (
                <Reveal key={g.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border-l-4 border-secondary bg-card p-5 shadow-sm">
                    <p className="mb-1 font-display text-lg font-bold text-foreground">{g.title}</p>
                    <p className="font-body text-sm text-muted-foreground">{g.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <Card className="h-full">
              <h3 className="mb-4 font-display text-2xl font-bold text-foreground">
                ¿Qué dice el ICTRC?
              </h3>
              <Segmented
                label="Ver fortalezas o debilidades"
                value={ictrcView}
                onChange={setIctrcView}
                options={[
                  { value: "debilidades", label: "Debilidades" },
                  { value: "fortalezas", label: "Fortalezas" },
                ]}
              />
              <AnimatePresence mode="wait">
                <m.ul
                  key={ictrcView}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-5 space-y-3"
                >
                  {(ictrcView === "fortalezas" ? ICTRC_STRENGTHS : ICTRC_WEAKNESSES).map((t) => (
                    <li key={t} className="flex items-start gap-3 font-body text-foreground">
                      <span
                        className={cn(
                          "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                          ictrcView === "fortalezas" ? "bg-primary" : "bg-tropical-coral",
                        )}
                        aria-hidden
                      />
                      {t}
                    </li>
                  ))}
                </m.ul>
              </AnimatePresence>
              <p className="mt-6 rounded-xl bg-primary/10 p-4 font-body text-sm text-foreground">
                La Comisión Regional de Competitividad propone plataformas digitales, inteligencia
                artificial y análisis de datos para mejorar la experiencia del turista.
              </p>
            </Card>
          </Reveal>
        </div>

        <p className="mt-10 font-body text-xs text-muted-foreground">
          Fuentes: {CONTEXT_SOURCES.join(" · ")}.
        </p>
      </div>
    </section>
  );
}

/* ---------- 02 · Objetivos ---------- */

export function ObjectivesSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="objetivos"
      aria-labelledby="objetivos-title"
      className="section-padding scroll-mt-16 bg-muted"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="objetivos"
          title="Lo que nos"
          highlight="proponemos"
          intro="Un objetivo general y tres específicos que avanzan en orden: entender el territorio, construir la plataforma y medir su apropiación."
        />

        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-12">
            <Target
              className="absolute -right-6 -bottom-6 h-40 w-40 text-primary-foreground/10"
              aria-hidden
            />
            <p className="mb-3 font-body text-sm font-semibold tracking-widest text-tropical-gold uppercase">
              Objetivo general
            </p>
            <p className="relative max-w-4xl font-display text-xl leading-relaxed md:text-2xl">
              {GENERAL_OBJECTIVE}
            </p>
          </div>
        </Reveal>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {SPECIFIC_OBJECTIVES.map((o, i) => {
            const isOpen = open === i;
            return (
              <RevealLi key={o.verb} delay={i * 0.1} className="h-full">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    "flex h-full w-full flex-col rounded-2xl border bg-card p-6 text-left transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isOpen ? "border-primary shadow-lg" : "border-border hover:shadow-md",
                  )}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-display text-lg font-bold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <StatusChip status={o.status} />
                  </div>
                  <p className="mb-2 font-display text-2xl font-bold text-foreground">{o.verb}</p>
                  <p className="font-body text-sm text-muted-foreground">{o.text}</p>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <m.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: EXPO_OUT }}
                      >
                        <p className="mt-4 rounded-xl bg-muted p-3 font-body text-sm text-foreground">
                          <span className="font-semibold">Avance: </span>
                          {o.evidence}
                        </p>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                  <span className="mt-auto pt-4 font-body text-xs font-semibold text-primary">
                    {isOpen ? "Ocultar avance" : "Ver avance"}
                  </span>
                </button>
              </RevealLi>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 03 · Metodología ---------- */

export function MethodologySection() {
  const [sector, setSector] = useState<string | null>(null);
  const totalSample = ACTOR_SECTORS.length * SAMPLE_PER_SECTOR;

  return (
    <section
      id="metodologia"
      aria-labelledby="metodologia-title"
      className="section-padding scroll-mt-16 bg-background"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="metodologia"
          title="Cómo lo"
          highlight="investigamos"
          intro="Enfoque mixto, de tipo exploratorio y descriptivo: los números muestran el tamaño de las brechas y las voces de los actores explican por qué existen."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal>
            <Card className="h-full">
              <CardLabel icon={Layers}>Enfoque mixto</CardLabel>
              <svg
                viewBox="0 0 240 150"
                className="mx-auto w-full max-w-xs"
                role="img"
                aria-label="Diagrama: lo cuantitativo y lo cualitativo se cruzan en el enfoque mixto"
              >
                <m.circle
                  cx="88"
                  cy="75"
                  r="62"
                  fill="hsl(var(--primary) / 0.18)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  initial={{ cx: 60 }}
                  whileInView={{ cx: 88 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: EXPO_OUT }}
                />
                <m.circle
                  cx="152"
                  cy="75"
                  r="62"
                  fill="hsl(var(--secondary) / 0.18)"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="2"
                  initial={{ cx: 180 }}
                  whileInView={{ cx: 152 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: EXPO_OUT }}
                />
                <text
                  x="62"
                  y="79"
                  textAnchor="middle"
                  className="fill-foreground font-body text-[11px] font-semibold"
                >
                  Cuanti
                </text>
                <text
                  x="178"
                  y="79"
                  textAnchor="middle"
                  className="fill-foreground font-body text-[11px] font-semibold"
                >
                  Cuali
                </text>
                <text
                  x="120"
                  y="79"
                  textAnchor="middle"
                  className="fill-foreground font-display text-[13px] font-bold"
                >
                  Mixto
                </text>
              </svg>
              <div className="mt-4 flex items-center justify-center gap-2 font-body text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                  Exploratoria
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">
                  Descriptiva
                </span>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-2">
            <Card className="h-full">
              <CardLabel icon={Users}>Población y muestra</CardLabel>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" aria-hidden />
                {MUNICIPALITIES.map((mu) => (
                  <span
                    key={mu}
                    className="rounded-full border border-border bg-background px-3 py-1 font-body text-sm text-foreground"
                  >
                    {mu}
                  </span>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {ACTOR_SECTORS.map((name, si) => {
                  const active = sector === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSector(active ? null : name)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "border-primary bg-primary/10"
                          : sector
                            ? "border-border opacity-50"
                            : "border-border hover:border-primary/50",
                      )}
                    >
                      <span className="font-body text-sm font-medium text-foreground">{name}</span>
                      <span className="flex gap-1" aria-hidden>
                        {Array.from({ length: SAMPLE_PER_SECTOR }, (_, pi) => (
                          <m.span
                            // biome-ignore lint/suspicious/noArrayIndexKey: íconos decorativos de conteo fijo
                            key={pi}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: si * 0.08 + pi * 0.04 }}
                          >
                            <UserRound
                              className={cn(
                                "h-4 w-4",
                                active ? "text-primary" : "text-muted-foreground",
                              )}
                            />
                          </m.span>
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 font-body text-sm text-muted-foreground">
                <span className="font-display text-2xl font-bold text-foreground">
                  <CountUp value={totalSample} />
                </span>{" "}
                actores: {SAMPLE_PER_SECTOR} representantes por cada uno de los{" "}
                {ACTOR_SECTORS.length} sectores, con relación directa con prácticas culturales o
                turísticas del departamento.
              </p>
            </Card>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {INSTRUMENTS.map((ins, i) => (
            <Reveal key={ins.title} delay={i * 0.08}>
              <Card className="flex h-full gap-4">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    i === 0 ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary",
                  )}
                >
                  {i === 0 ? (
                    <ChartColumn className="h-6 w-6" aria-hidden />
                  ) : (
                    <Quote className="h-6 w-6" aria-hidden />
                  )}
                </span>
                <div>
                  <p className="font-body text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {ins.kind}
                  </p>
                  <p className="font-display text-lg font-bold text-foreground">{ins.title}</p>
                  <p className="font-body text-sm text-muted-foreground">{ins.text}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h3 className="mb-8 font-display text-2xl font-bold text-foreground">
            Fases de la investigación
          </h3>
        </Reveal>
        <div className="relative">
          <div
            className="absolute top-6 right-[16%] left-[16%] hidden h-0.5 bg-border md:block"
            aria-hidden
          />
          <ol className="relative grid gap-6 md:grid-cols-3">
            {RESEARCH_PHASES.map((p, i) => (
              <RevealLi key={p.name} delay={i * 0.12} className="relative">
                <span
                  className={cn(
                    "relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background font-display text-lg font-bold md:mx-auto",
                    p.status === "logrado"
                      ? "bg-primary text-primary-foreground"
                      : p.status === "en-curso"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <Card>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-xl font-bold text-foreground">
                      {p.name}: {p.title}
                    </p>
                    <StatusChip status={p.status} />
                  </div>
                  <ul className="space-y-2">
                    {p.steps.map((st) => (
                      <li
                        key={st}
                        className="flex items-start gap-2 font-body text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {st}
                      </li>
                    ))}
                  </ul>
                </Card>
              </RevealLi>
            ))}
          </ol>
        </div>

        <Reveal className="mt-16">
          <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 md:p-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <ShieldCheck className="mb-4 h-10 w-10 text-primary" aria-hidden />
              <h3 className="mb-3 font-display text-2xl font-bold text-foreground">
                Gobernanza de datos desde el diseño
              </h3>
              <p className="font-body text-muted-foreground">
                El prototipo incorpora cinco principios para un uso responsable, ético y sostenible
                de la información cultural y turística.
              </p>
            </div>
            <Accordion type="single" collapsible defaultValue="item-0">
              {DATA_GOVERNANCE.map((g, i) => (
                <AccordionItem key={g.title} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-body text-base font-semibold text-foreground hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-xs font-bold text-primary">
                        {String.fromCharCode(97 + i)}
                      </span>
                      {g.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 font-body text-muted-foreground">
                    {g.text}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 04 · Hallazgos ---------- */

const INDICATOR_FILTERS: { value: "todos" | IndicatorGroup; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "condiciones", label: "Condiciones actuales" },
  { value: "disposicion", label: "Disposición" },
];

export function FindingsSection() {
  const [filter, setFilter] = useState<"todos" | IndicatorGroup>("todos");
  const indicators = SURVEY_INDICATORS.filter((i) => filter === "todos" || i.group === filter);
  const gaugeTones = ["coral", "secondary", "primary"] as const;

  return (
    <section
      id="hallazgos"
      aria-labelledby="hallazgos-title"
      className="section-padding scroll-mt-16 bg-muted"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="hallazgos"
          title="Lo que"
          highlight="encontramos"
          intro="La brecha principal no es la falta de interés: es la distancia entre una alta disposición hacia la tecnología y unas condiciones actuales de documentación, articulación y apoyo todavía débiles."
        />

        <Reveal>
          <Card className="mb-6">
            <CardLabel icon={ChartColumn}>
              Promedio por dimensión de la encuesta (escala 1-5)
            </CardLabel>
            <div className="grid gap-8 sm:grid-cols-3">
              {SURVEY_DIMENSIONS.map((d, i) => (
                <div key={d.label}>
                  <Gauge value={d.score} max={5} label={d.label} tone={gaugeTones[i]} />
                  <p className="mt-1 text-center font-body text-xs text-muted-foreground">
                    {d.note}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Card className="h-full">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-display text-xl font-bold text-foreground">
                  Indicadores clave de la encuesta
                </h3>
                <Segmented
                  label="Filtrar indicadores"
                  value={filter}
                  onChange={setFilter}
                  options={INDICATOR_FILTERS}
                />
              </div>
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {indicators.map((ind) => (
                    <m.li
                      key={ind.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="mb-1.5 flex items-baseline justify-between gap-4 font-body text-sm">
                        <span className="text-foreground">{ind.label}</span>
                        <span
                          className={cn(
                            "shrink-0 font-display text-lg font-bold",
                            ind.group === "disposicion" ? "text-primary" : "text-tropical-coral",
                          )}
                        >
                          {formatNumber(ind.value, Number.isInteger(ind.value) ? 0 : 1)} %
                        </span>
                      </div>
                      <GrowBar
                        percent={ind.value}
                        barClassName={
                          ind.group === "disposicion" ? "bg-primary" : "bg-tropical-coral"
                        }
                      />
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-center rounded-2xl bg-foreground p-8 text-primary-foreground">
              <p className="mb-6 font-body text-sm font-semibold tracking-widest text-tropical-gold uppercase">
                La brecha en una cifra
              </p>
              <div className="flex items-end gap-4">
                <div>
                  <p className="font-display text-6xl font-bold text-tropical-gold">
                    <CountUp value={93} suffix=" %" />
                  </p>
                  <p className="font-body text-sm text-primary-foreground/70">
                    participaría en validar la plataforma
                  </p>
                </div>
              </div>
              <div className="my-6 h-px bg-primary-foreground/15" />
              <div>
                <p className="font-display text-6xl font-bold text-tropical-coral">
                  <CountUp value={15.4} decimals={1} suffix=" %" />
                </p>
                <p className="font-body text-sm text-primary-foreground/70">
                  participa hoy en la recopilación del patrimonio
                </p>
              </div>
              <p className="mt-8 font-body text-sm text-primary-foreground/80">
                Hay condiciones favorables de aceptación: la plataforma debe convertir esa
                disposición en participación real.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <h3 className="mb-2 font-display text-2xl font-bold text-foreground">
            Triangulación: del dato a la decisión de diseño
          </h3>
          <p className="mb-6 max-w-2xl font-body text-muted-foreground">
            Elige una dimensión para ver cómo la encuesta y las entrevistas se complementan y qué
            implica para Sucre Vivo.
          </p>
          <Tabs
            defaultValue={TRIANGULATION[0]?.dimension}
            orientation="vertical"
            className="grid gap-6 lg:grid-cols-[280px_1fr]"
          >
            <TabsList className="flex h-auto w-full flex-row justify-start gap-1 overflow-x-auto rounded-2xl bg-card p-2 lg:flex-col lg:items-stretch">
              {TRIANGULATION.map((t) => (
                <TabsTrigger
                  key={t.dimension}
                  value={t.dimension}
                  className="shrink-0 justify-start rounded-xl px-4 py-2.5 text-left font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground lg:whitespace-normal"
                >
                  {t.dimension}
                </TabsTrigger>
              ))}
            </TabsList>
            {TRIANGULATION.map((t) => (
              <TabsContent key={t.dimension} value={t.dimension} className="mt-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Evidencia cuantitativa", text: t.quantitative, icon: ChartColumn },
                    { label: "Evidencia cualitativa", text: t.qualitative, icon: Quote },
                    { label: "Interpretación integrada", text: t.interpretation, icon: Lightbulb },
                  ].map((c) => (
                    <Card key={c.label}>
                      <CardLabel icon={c.icon}>{c.label}</CardLabel>
                      <p className="font-body text-foreground">{c.text}</p>
                    </Card>
                  ))}
                  <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
                    <p className="mb-4 flex items-center gap-2 font-body text-sm font-semibold text-primary-foreground/80">
                      <Target className="h-4 w-4" aria-hidden />
                      Implicación para Sucre Vivo
                    </p>
                    <p className="font-display text-lg font-bold">{t.implication}</p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>

        <Reveal className="mt-16">
          <h3 className="mb-6 font-display text-2xl font-bold text-foreground">
            Cinco categorías de las entrevistas
          </h3>
          <Tabs defaultValue={QUALITATIVE_CATEGORIES[0].id}>
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-card p-2">
              {QUALITATIVE_CATEGORIES.map((c, i) => (
                <TabsTrigger
                  key={c.id}
                  value={c.id}
                  className="rounded-xl px-4 py-2 font-body data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  <span className="mr-2 opacity-70">{i + 1}.</span>
                  {c.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {QUALITATIVE_CATEGORIES.map((c) => (
              <TabsContent key={c.id} value={c.id} className="mt-4">
                <Card className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
                  <p className="font-body text-lg text-foreground">{c.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {c.quotes.map((q) => (
                      <span
                        key={q}
                        className="rounded-full bg-secondary/10 px-4 py-2 font-display text-sm italic text-secondary"
                      >
                        «{q}»
                      </span>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>

        <Reveal className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h3 className="mb-2 font-display text-2xl font-bold text-foreground">
                Logros: el prototipo ya está en línea
              </h3>
              <p className="max-w-2xl font-body text-muted-foreground">
                Los hallazgos se tradujeron en requerimientos y estos en módulos que puedes recorrer
                hoy en sucrevivo.com.
              </p>
            </div>
            <dl className="flex gap-8">
              <div className="flex flex-col-reverse">
                <dt className="font-body text-xs text-muted-foreground">
                  requerimientos funcionales
                </dt>
                <dd className="font-display text-4xl font-bold text-primary">
                  <CountUp value={REQUIREMENT_COUNTS.functional} />
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="font-body text-xs text-muted-foreground">no funcionales</dt>
                <dd className="font-display text-4xl font-bold text-secondary">
                  <CountUp value={REQUIREMENT_COUNTS.nonFunctional} />
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="font-body text-xs text-muted-foreground">módulos publicados</dt>
                <dd className="font-display text-4xl font-bold text-foreground">
                  <CountUp value={PROTOTYPE_MODULES.length} />
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROTOTYPE_MODULES.map((mod, i) => (
            <Reveal key={mod.title} delay={(i % 4) * 0.06}>
              <ModuleCard {...mod} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ title, text, href }: { title: string; text: string; href: string | null }) {
  const tilt = useTiltCard<HTMLAnchorElement>();
  const body = (
    <>
      <p className="mb-1 flex items-center justify-between gap-2 font-display text-lg font-bold text-foreground">
        {title}
        {href ? (
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        ) : (
          <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-label="Solo personal" />
        )}
      </p>
      <p className="font-body text-sm text-muted-foreground">{text}</p>
    </>
  );
  if (!href) {
    return <div className="h-full rounded-2xl border border-dashed border-border p-5">{body}</div>;
  }
  return (
    <Link
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      href={href}
      className="group tilt-card block h-full rounded-2xl border border-border bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {body}
    </Link>
  );
}

/* ---------- 05 · Beneficios ---------- */

const BENEFIT_ICONS = {
  academia: GraduationCap,
  productivo: Store,
  sociedad: HeartHandshake,
} as const;

const BENEFIT_ACCENTS = {
  academia: "bg-primary text-primary-foreground",
  productivo: "bg-secondary text-secondary-foreground",
  sociedad: "bg-tropical-coral text-primary-foreground",
} as const;

function BenefitCard({ benefit, index }: { benefit: (typeof BENEFITS)[number]; index: number }) {
  const tilt = useTiltCard<HTMLDivElement>();
  const Icon = BENEFIT_ICONS[benefit.id];
  return (
    <Reveal delay={index * 0.1} className="h-full">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: mousemove/mouseleave solo animan un tilt decorativo */}
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="tilt-card flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className={cn("p-6", BENEFIT_ACCENTS[benefit.id])}>
          <Icon className="mb-4 h-9 w-9" aria-hidden />
          <h3 className="font-display text-2xl font-bold">{benefit.audience}</h3>
          <p className="mt-1 font-body text-sm opacity-85">{benefit.headline}</p>
        </div>
        <ul className="flex-1 space-y-3 p-6">
          {benefit.items.map((it) => (
            <li key={it} className="flex items-start gap-3 font-body text-sm text-foreground">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function BenefitsSection() {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-title"
      className="section-padding scroll-mt-16 bg-background"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="beneficios"
          title="A quién"
          highlight="beneficia"
          intro="Sucre Vivo articula tecnología, patrimonio y turismo: genera conocimiento en la academia, visibilidad para el sector productivo y acceso y protección del patrimonio para la sociedad."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={b.id} benefit={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 06 · Proyección ---------- */

const REQ_STATUS: Record<RequirementStatus, { label: string; bar: string; dot: string }> = {
  hecho: { label: "Implementado", bar: "bg-primary", dot: "bg-primary" },
  "en-progreso": { label: "En progreso", bar: "bg-secondary", dot: "bg-secondary" },
  pendiente: { label: "Próximo", bar: "bg-border", dot: "bg-muted-foreground/40" },
};

const STATUS_ORDER: RequirementStatus[] = ["hecho", "en-progreso", "pendiente"];

const INDICATOR_ICONS = [ChartColumn, Smile, Network, Eye] as const;
const STAGE_ICONS = [Users, MapPin, Bot, Landmark] as const;

export function ProjectionSection() {
  const [reqFilter, setReqFilter] = useState<RequirementStatus | "todos">("todos");
  const total = FUNCTIONAL_REQUIREMENTS.length;
  const counts = STATUS_ORDER.map((st) => ({
    status: st,
    count: FUNCTIONAL_REQUIREMENTS.filter((r) => r.status === st).length,
  }));
  const visible = FUNCTIONAL_REQUIREMENTS.filter(
    (r) => reqFilter === "todos" || r.status === reqFilter,
  );

  return (
    <section
      id="proyeccion"
      aria-labelledby="proyeccion-title"
      className="section-padding scroll-mt-16 bg-muted"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="proyeccion"
          title="Lo que"
          highlight="sigue"
          intro="El prototipo cubre la oferta pública y el asistente. Las siguientes etapas llevan la plataforma hacia los actores, la memoria cultural y la evaluación con usuarios reales."
        />

        <Reveal>
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-foreground">
                Avance de los {total} requerimientos funcionales
              </h3>
              <Segmented
                label="Filtrar requerimientos"
                value={reqFilter}
                onChange={setReqFilter}
                options={[
                  { value: "todos", label: "Todos" },
                  ...STATUS_ORDER.map((st) => ({ value: st, label: REQ_STATUS[st].label })),
                ]}
              />
            </div>
            <m.div
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true }}
              className="mb-3 flex h-4 overflow-hidden rounded-full"
              role="img"
              aria-label={counts
                .map((c) => `${c.count} ${REQ_STATUS[c.status].label.toLowerCase()}`)
                .join(", ")}
            >
              {counts.map((c, i) => (
                <m.div
                  key={c.status}
                  className={cn("h-full origin-left", REQ_STATUS[c.status].bar)}
                  style={{ width: `${(c.count / total) * 100}%` }}
                  variants={GROW_X}
                  transition={{ duration: 0.9, delay: i * 0.2, ease: EXPO_OUT }}
                />
              ))}
            </m.div>
            <div className="mb-6 flex flex-wrap gap-5 font-body text-sm">
              {counts.map((c) => (
                <span key={c.status} className="flex items-center gap-2 text-muted-foreground">
                  <span className={cn("h-2.5 w-2.5 rounded-full", REQ_STATUS[c.status].dot)} />
                  <span className="font-semibold text-foreground">{c.count}</span>
                  {REQ_STATUS[c.status].label}
                </span>
              ))}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {visible.map((r) => (
                  <m.li
                    key={r.feature}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                        REQ_STATUS[r.status].dot,
                      )}
                      aria-hidden
                    />
                    <span className="font-body text-sm">
                      <span className="block font-semibold text-foreground">{r.feature}</span>
                      <span className="text-muted-foreground">
                        {r.need} · {REQ_STATUS[r.status].label}
                      </span>
                    </span>
                  </m.li>
                ))}
              </AnimatePresence>
            </ul>
          </Card>
        </Reveal>

        <Reveal className="mt-16">
          <h3 className="mb-8 font-display text-2xl font-bold text-foreground">Hoja de ruta</h3>
        </Reveal>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ROADMAP_STAGES.map((stage, i) => {
            const Icon = STAGE_ICONS[i] ?? Database;
            return (
              <RevealLi
                key={stage.title}
                delay={i * 0.1}
                className="relative h-full rounded-2xl border border-border bg-card p-6"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-foreground px-3 py-1 font-body text-xs font-bold text-primary-foreground">
                  Etapa {i + 1}
                </span>
                <Icon className="mt-2 mb-3 h-7 w-7 text-secondary" aria-hidden />
                <p className="mb-3 font-display text-lg font-bold text-foreground">{stage.title}</p>
                <ul className="space-y-2">
                  {stage.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 font-body text-sm text-muted-foreground"
                    >
                      <ArrowRight
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                        aria-hidden
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              </RevealLi>
            );
          })}
        </ol>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="h-full rounded-2xl bg-foreground p-8 text-primary-foreground">
              <Scale className="mb-4 h-9 w-9 text-tropical-gold" aria-hidden />
              <h3 className="mb-3 font-display text-2xl font-bold">
                Evaluar más allá de lo técnico
              </h3>
              <p className="font-body text-primary-foreground/80">
                El tercer objetivo mide si la plataforma realmente sirve: pruebas de usabilidad con
                usuarios reales, validación comunitaria de contenidos y un panel de indicadores para
                decidir con datos.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {EVALUATION_INDICATORS.map((ind, i) => {
              const Icon = INDICATOR_ICONS[i] ?? ChartColumn;
              return (
                <Reveal key={ind.title} delay={i * 0.06}>
                  <Card className="h-full">
                    <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden />
                    <p className="font-display text-lg font-bold text-foreground">{ind.title}</p>
                    <p className="font-body text-sm text-muted-foreground">{ind.text}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

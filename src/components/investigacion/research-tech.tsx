"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  Database,
  Drama,
  FileText,
  GitPullRequest,
  Image,
  KeyRound,
  ListChecks,
  Monitor,
  Puzzle,
  Server,
  ServerCog,
  Sparkles,
  TestTubes,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import {
  AGENT_SKILLS,
  AI_TOOLS,
  ARCHITECTURE_LAYERS,
  type ArchitectureNodeId,
  CHAT_FLOW_STEPS,
  REPOSITORY_URL,
  SDD_PHASES,
  SDD_SPECS,
  SKILL_GROUPS,
  type SkillGroup,
  TECH_CATEGORIES,
  TECH_STACK,
  TEST_LAYERS,
  type TechCategory,
} from "@/lib/investigacion-content";
import { EXPO_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CountUp } from "./research-infographics";
import { Card, CardLabel, Reveal, RevealLi, SectionHeader, Segmented } from "./research-sections";
import { TECH_BRAND_ICONS, type TechBrandIconKey } from "./tech-icons";

/* ---------- Iconos ---------- */

/** Tecnologías sin logo en Simple Icons: icono genérico por id. */
const FALLBACK_ICONS: Record<string, typeof Server> = {
  motion: Sparkles,
  authjs: KeyRound,
  playwright: Drama,
  easypanel: Server,
};

function BrandIcon({ icon, className }: { icon: TechBrandIconKey; className?: string }) {
  const brand = TECH_BRAND_ICONS[icon];
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("text-foreground", className)}
      fill={brand.hex ?? "currentColor"}
      aria-hidden
    >
      <path d={brand.path} />
    </svg>
  );
}

function TechIcon({
  id,
  icon,
  className,
}: {
  id: string;
  icon: string | null;
  className?: string;
}) {
  if (icon && icon in TECH_BRAND_ICONS) {
    return <BrandIcon icon={icon as TechBrandIconKey} className={className} />;
  }
  const Fallback = FALLBACK_ICONS[id] ?? Boxes;
  return <Fallback className={cn("text-primary", className)} aria-hidden />;
}

/* ---------- Arquitectura ---------- */

const NODE_ICONS: Record<ArchitectureNodeId, typeof Server> = {
  navegador: Monitor,
  next: ServerCog,
  auth: KeyRound,
  datos: Database,
  medios: Image,
  n8n: Workflow,
  gemini: BrainCircuit,
};

function ArchitectureExplorer() {
  const [selected, setSelected] = useState<ArchitectureNodeId>("next");
  const node = ARCHITECTURE_LAYERS.flatMap((l) => l.nodes).find((n) => n.id === selected);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {ARCHITECTURE_LAYERS.map((layer, li) => (
          <div key={layer.label} className="contents">
            {li > 0 && (
              <div className="flex justify-center text-muted-foreground" aria-hidden>
                <ArrowRight className="hidden h-5 w-5 md:block" />
                <ArrowDown className="h-5 w-5 md:hidden" />
              </div>
            )}
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-2 font-body text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {layer.label}
              </legend>
              {layer.nodes.map((n) => {
                const Icon = NODE_ICONS[n.id];
                const active = n.id === selected;
                return (
                  <button
                    key={n.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(n.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        active ? "text-tropical-gold" : "text-primary",
                      )}
                      aria-hidden
                    />
                    <span className="font-body text-sm">
                      <span className="block font-semibold">{n.title}</span>
                      <span
                        className={cn(
                          "text-xs",
                          active ? "text-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {n.tech}
                      </span>
                    </span>
                  </button>
                );
              })}
            </fieldset>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-foreground p-6 text-primary-foreground" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {node && (
            <m.div
              key={node.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: EXPO_OUT }}
            >
              <p className="mb-1 font-body text-xs font-semibold tracking-widest text-tropical-gold uppercase">
                {node.tech}
              </p>
              <h4 className="mb-4 font-display text-2xl font-bold">{node.title}</h4>
              <ul className="space-y-3">
                {node.detail.map((d) => (
                  <li key={d} className="flex gap-2 font-body text-sm text-primary-foreground/85">
                    <ArrowRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-tropical-gold"
                      aria-hidden
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Stack ---------- */

function StackExplorer() {
  const [category, setCategory] = useState<TechCategory | "todas">("todas");
  const visible = TECH_STACK.filter((t) => category === "todas" || t.category === category);

  return (
    <Card>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Stack tecnológico · {TECH_STACK.length} herramientas
        </h3>
        <Segmented
          label="Filtrar tecnologías"
          value={category}
          onChange={setCategory}
          options={[{ value: "todas", label: "Todas" }, ...TECH_CATEGORIES]}
        />
      </div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {visible.map((t) => (
            <m.li
              key={t.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/40 sm:flex-row sm:p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm ring-1 ring-border transition-transform group-hover:-translate-y-0.5">
                <TechIcon id={t.id} icon={t.icon} className="h-6 w-6" />
              </span>
              <span className="font-body text-sm">
                <span className="block font-semibold text-foreground">{t.name}</span>
                <span className="hidden text-muted-foreground sm:inline">{t.role}</span>
              </span>
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}

/* ---------- Desarrollo con IA ---------- */

function SddStepper() {
  const [phase, setPhase] = useState(0);
  const current = SDD_PHASES[phase];

  return (
    <Card className="h-full">
      <CardLabel icon={ListChecks}>Spec-Driven Development (SDD) con Spec Kit</CardLabel>
      <ol className="mb-5 flex flex-wrap gap-2">
        {SDD_PHASES.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              aria-pressed={i === phase}
              onClick={() => setPhase(i)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 font-body text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === phase
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : i < phase
                    ? "border-secondary/30 bg-secondary/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="font-display text-xs font-bold">{i + 1}</span>
              {p.title}
            </button>
          </li>
        ))}
      </ol>
      <div aria-live="polite" className="min-h-28">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              {current.artifact}
            </p>
            <p className="font-body text-sm text-muted-foreground">{current.text}</p>
          </m.div>
        </AnimatePresence>
      </div>
      <div className="mt-5 border-t border-border pt-5">
        <p className="mb-3 font-body text-sm font-semibold text-foreground">
          {SDD_SPECS.length} funcionalidades especificadas así
        </p>
        <ol className="grid gap-x-4 gap-y-1.5 font-body text-sm text-muted-foreground sm:grid-cols-2">
          {SDD_SPECS.map((spec, i) => (
            <li key={spec} className="flex gap-2">
              <span className="font-mono text-xs text-secondary tabular-nums">
                {String(i + 1).padStart(3, "0")}
              </span>
              {spec}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

function SkillsExplorer() {
  const [group, setGroup] = useState<SkillGroup | "todas">("todas");
  const visible = AGENT_SKILLS.filter((s) => group === "todas" || s.group === group);

  return (
    <Card>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <CardLabel icon={Puzzle}>Skills de los agentes</CardLabel>
        <Segmented
          label="Filtrar skills"
          value={group}
          onChange={setGroup}
          options={[{ value: "todas", label: "Todas" }, ...SKILL_GROUPS]}
        />
      </div>
      <p className="mb-5 max-w-3xl font-body text-sm text-muted-foreground">
        Una skill es un paquete de instrucciones versionado en el repositorio que enseña al agente
        un procedimiento concreto: cómo especificar, cómo diseñar con los tokens del proyecto o cómo
        probar. Así Cursor y Claude trabajan con las mismas reglas.
      </p>
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {visible.map((s) => (
            <m.li
              key={s.name}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border bg-background px-3 py-2.5"
            >
              <span className="block font-mono text-xs font-semibold break-all text-primary">
                {s.name}
              </span>
              <span className="hidden font-body text-sm text-muted-foreground sm:block">
                {s.text}
              </span>
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}

/* ---------- Sección ---------- */

export function TechnologySection() {
  const stats = [
    { value: TECH_STACK.length, label: "herramientas en el stack" },
    { value: SDD_SPECS.length, label: "funcionalidades con SDD" },
    { value: AGENT_SKILLS.length, label: "skills de agentes" },
    { value: TEST_LAYERS.length, label: "capas de pruebas automáticas" },
  ];

  return (
    <section
      id="tecnologias"
      aria-labelledby="tecnologias-title"
      className="section-padding scroll-mt-16 bg-background"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="tecnologias"
          title="Cómo está"
          highlight="construida"
          intro="Sucre Vivo es una aplicación web de código abierto, desarrollada con inteligencia artificial y guiada por especificaciones: cada funcionalidad se escribió primero como documento y después como código con pruebas."
        />

        <Reveal>
          <dl className="mb-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-l-2 border-primary pl-4">
                <dt className="font-body text-sm text-muted-foreground">{s.label}</dt>
                <dd className="font-display text-4xl font-bold text-foreground md:text-5xl">
                  <CountUp value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Desarrollo con IA */}
        <Reveal className="mb-8">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Desarrollada con inteligencia artificial
          </h3>
          <p className="max-w-3xl font-body text-muted-foreground">
            El código lo escriben agentes de IA bajo la dirección del equipo, que decide qué se
            construye, revisa cada cambio y lo aprueba.
          </p>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <ul className="grid gap-6">
            {AI_TOOLS.map((tool, i) => (
              <RevealLi key={tool.id} delay={i * 0.1}>
                <div className="h-full rounded-2xl bg-foreground p-6 text-primary-foreground">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background">
                      <BrandIcon icon={tool.icon} className="h-6 w-6" />
                    </span>
                    <p className="font-display text-2xl font-bold">{tool.name}</p>
                  </div>
                  <p className="font-body text-sm text-primary-foreground/80">{tool.text}</p>
                </div>
              </RevealLi>
            ))}
          </ul>
          <Reveal delay={0.15}>
            <SddStepper />
          </Reveal>
        </div>
        <Reveal className="mt-6">
          <SkillsExplorer />
        </Reveal>

        {/* Arquitectura */}
        <Reveal className="mt-16 mb-8">
          <h3 className="font-display text-2xl font-bold text-foreground">Arquitectura</h3>
          <p className="max-w-3xl font-body text-muted-foreground">
            Una aplicación Next.js concentra el sitio público, el panel y la API. Toca cada pieza
            para ver qué hace.
          </p>
        </Reveal>
        <Reveal>
          <ArchitectureExplorer />
        </Reveal>

        <Reveal className="mt-10">
          <p className="mb-4 flex items-center gap-2 font-body text-sm font-semibold text-muted-foreground">
            <Workflow className="h-4 w-4 text-primary" aria-hidden />
            Así viaja una pregunta al asistente
          </p>
        </Reveal>
        <ol className="grid gap-3 md:grid-cols-5">
          {CHAT_FLOW_STEPS.map((step, i) => (
            <RevealLi
              key={step.text}
              delay={i * 0.08}
              className="relative rounded-xl border border-border bg-card p-4"
            >
              <span className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="font-body text-xs font-semibold tracking-wide text-secondary uppercase">
                  {step.actor}
                </span>
              </span>
              <span className="font-body text-sm text-foreground">{step.text}</span>
            </RevealLi>
          ))}
        </ol>

        {/* Stack */}
        <Reveal className="mt-16">
          <StackExplorer />
        </Reveal>

        {/* Código abierto */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-primary-foreground md:p-12">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 90% at 100% 100%, hsl(var(--primary) / 0.5), transparent 70%)",
              }}
              aria-hidden
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 font-body text-sm font-medium">
                  <GitPullRequest className="h-4 w-4 text-tropical-gold" aria-hidden />
                  Código abierto
                </p>
                <h3 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                  Todo el proyecto está en <span className="text-tropical-gold">GitHub</span>
                </h3>
                <p className="mb-6 max-w-xl font-body text-primary-foreground/80">
                  El código, las especificaciones, las skills y las pruebas son públicos. Cualquier
                  persona puede revisarlos, reutilizarlos o proponer mejoras.
                </p>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-background px-6 py-3 font-body font-semibold text-foreground transition-colors outline-none hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-tropical-gold"
                >
                  <BrandIcon icon="github" className="h-5 w-5" />
                  velosergio/descubresucre
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                  <span className="sr-only">(abre en una pestaña nueva)</span>
                </a>
              </div>
              <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
                <p className="mb-4 flex items-center gap-2 font-body text-sm font-semibold">
                  <TestTubes className="h-4 w-4 text-tropical-gold" aria-hidden />
                  Cada pull request pasa por
                </p>
                <ul className="space-y-2.5 font-body text-sm text-primary-foreground/85">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-tropical-gold" aria-hidden />
                    Lint y formato con Biome
                  </li>
                  {TEST_LAYERS.map((layer) => (
                    <li key={layer} className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-tropical-gold" aria-hidden />
                      {layer}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

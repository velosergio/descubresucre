"use client";

import { useScroll, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import {
  ArrowDown,
  ArrowLeft,
  CalendarDays,
  FlaskConical,
  MessageCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CunLogo from "@/components/CunLogo";
import Footer from "@/components/Footer";
import TuteMascot from "@/components/TuteMascot";
import {
  ACTOR_SECTORS,
  MUNICIPALITIES,
  RESEARCH_META,
  RESEARCH_SECTIONS,
  type ResearchSectionId,
  SPECIFIC_OBJECTIVES,
  TUTE,
} from "@/lib/investigacion-content";
import { EXPO_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CountUp } from "./research-infographics";
import {
  BenefitsSection,
  ContextSection,
  FindingsSection,
  MethodologySection,
  ObjectivesSection,
  ProjectionSection,
} from "./research-sections";
import { TechnologySection } from "./research-tech";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ResearchHero() {
  const meta = RESEARCH_META;
  const heroStats = [
    { value: MUNICIPALITIES.length, label: "municipios" },
    { value: ACTOR_SECTORS.length, label: "sectores de actores" },
    { value: SPECIFIC_OBJECTIVES.length, label: "objetivos específicos" },
  ];
  return (
    <header className="relative overflow-hidden bg-foreground text-primary-foreground">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(60% 80% at 85% 10%, hsl(var(--primary) / 0.55), transparent 70%), radial-gradient(50% 60% at 0% 100%, hsl(var(--secondary) / 0.35), transparent 70%)",
        }}
        aria-hidden
      />
      <svg
        className="absolute right-0 bottom-0 w-[520px] max-w-full opacity-15"
        viewBox="0 0 400 200"
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M0 ${120 + i * 18} C 80 ${90 + i * 18}, 160 ${150 + i * 18}, 240 ${115 + i * 18} S 360 ${100 + i * 18}, 400 ${125 + i * 18}`}
            fill="none"
            stroke="hsl(var(--tropical-gold))"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-20 md:px-8 lg:px-16 lg:pb-28">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-sm text-primary-foreground/70 underline-offset-4 outline-none hover:text-primary-foreground hover:underline focus-visible:ring-2 focus-visible:ring-tropical-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver a Sucre Vivo
          </Link>
          <div className="rounded-2xl bg-background px-4 py-2.5 shadow-lg">
            <CunLogo variant="logo" priority className="h-14 md:h-20" />
          </div>
        </div>

        <m.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EXPO_OUT }}
          className="pointer-events-none absolute top-36 right-16 hidden xl:block"
        >
          <TuteMascot variant="tute" priority className="h-[270px] drop-shadow-2xl" />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EXPO_OUT }}
          className="mt-12 max-w-4xl"
        >
          <p className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 font-body text-sm text-primary-foreground/85 backdrop-blur">
            <FlaskConical className="h-4 w-4 text-tropical-gold" aria-hidden />
            {meta.category} · {meta.seedbed}
          </p>
          <h1 className="mb-6 font-display text-4xl leading-[1.1] font-bold md:text-6xl lg:text-7xl">
            {meta.title}: patrimonio de Sucre con{" "}
            <span className="text-tropical-gold">inteligencia artificial</span>
          </h1>
          <p className="max-w-2xl font-body text-lg text-primary-foreground/80 md:text-xl">
            {meta.subtitle}.
          </p>
        </m.div>

        <m.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EXPO_OUT }}
          className="mt-10 grid max-w-3xl gap-x-10 gap-y-4 font-body text-sm sm:grid-cols-2"
        >
          <div>
            <dt className="text-primary-foreground/55">Autores</dt>
            <dd className="font-semibold">{meta.authors.join(" y ")}</dd>
          </div>
          <div>
            <dt className="text-primary-foreground/55">Institución</dt>
            <dd className="font-semibold">
              {meta.institution} · {meta.program}
            </dd>
          </div>
          <div>
            <dt className="text-primary-foreground/55">Red</dt>
            <dd className="font-semibold">
              {meta.node} · Área {meta.area}
            </dd>
          </div>
          <div>
            <dt className="text-primary-foreground/55">Ponente</dt>
            <dd className="font-semibold">{meta.speaker}</dd>
          </div>
        </m.dl>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EXPO_OUT }}
          className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div className="flex flex-wrap gap-8">
            {heroStats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-5xl font-bold text-tropical-gold">
                  <CountUp value={s.value} />
                </p>
                <p className="font-body text-sm text-primary-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-5 backdrop-blur lg:max-w-sm">
            <p className="mb-2 font-body text-xs font-semibold tracking-widest text-tropical-gold uppercase">
              Ponencia
            </p>
            <p className="font-display text-lg font-bold">{meta.event.name}</p>
            <p className="mt-1 font-body text-sm text-primary-foreground/70 italic">
              «{meta.event.motto}»
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-sm text-primary-foreground/85">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden />
                {meta.event.dateLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video className="h-4 w-4" aria-hidden />
                {meta.event.modality}
              </span>
            </p>
          </div>
        </m.div>

        <button
          type="button"
          onClick={() => scrollToSection(RESEARCH_SECTIONS[0].id)}
          className="mt-14 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-tropical-gold"
        >
          Recorrer la investigación
          <ArrowDown className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </header>
  );
}

/** Índice fijo con la sección activa y la barra de avance de lectura. */
function ResearchNav() {
  const [active, setActive] = useState<ResearchSectionId>(RESEARCH_SECTIONS[0].id);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const elements = RESEARCH_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActive(visible.target.id as ResearchSectionId);
        } else if (
          elements[0] &&
          elements[0].getBoundingClientRect().top > window.innerHeight * 0.3
        ) {
          // Por encima de la primera sección (hero): el índice vuelve al inicio.
          setActive(RESEARCH_SECTIONS[0].id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // En móvil el índice desborda: mantiene visible la píldora activa sin mover la página.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!list || !link) return;
    list.scrollTo?.({
      left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav
      aria-label="Secciones de la investigación"
      className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur"
    >
      <div
        ref={listRef}
        className="relative mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 md:px-8 lg:px-16"
      >
        {RESEARCH_SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-section={s.id}
              aria-current={isActive ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(s.id);
                history.replaceState(null, "", `#${s.id}`);
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-body text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className={cn("text-xs", isActive ? "opacity-80" : "opacity-60")}>
                {s.number}
              </span>
              {s.label}
            </a>
          );
        })}
      </div>
      <m.div
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-secondary"
        style={{ scaleX: progress }}
        aria-hidden
      />
    </nav>
  );
}

/** Presenta a Tute, la mascota y voz cercana de la plataforma. */
function MeetTute() {
  return (
    <section id="tute" aria-labelledby="tute-title" className="section-padding bg-muted/50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-14">
        <div className="relative mx-auto w-full max-w-[18rem] md:max-w-sm">
          <TuteMascot variant="tute" className="mx-auto h-auto w-full" />
          <p className="absolute -top-2 right-0 max-w-[13rem] rounded-2xl rounded-bl-sm bg-background px-4 py-3 font-body text-sm font-semibold text-foreground shadow-lg md:-right-6">
            «{TUTE.phrases[0]}»
          </p>
        </div>
        <div>
          <p className="mb-3 font-body text-sm font-semibold tracking-widest text-secondary uppercase">
            La mascota
          </p>
          <h2 id="tute-title" className="mb-4 font-display text-3xl font-bold md:text-5xl">
            Conoce a <span className="text-primary">{TUTE.name}</span>
          </h2>
          <p className="mb-2 font-body text-lg text-muted-foreground">{TUTE.summary}</p>
          <p className="mb-6 font-body text-sm text-muted-foreground italic">{TUTE.species}</p>
          <ul aria-label="Personalidad de Tute" className="mb-6 flex flex-wrap gap-2">
            {TUTE.traits.map((t) => (
              <li
                key={t}
                className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-body text-sm font-medium text-primary"
              >
                {t}
              </li>
            ))}
          </ul>
          <blockquote className="rounded-2xl border-l-4 border-secondary bg-background p-5 font-body text-foreground shadow-sm">
            <p className="mb-1 text-xs font-semibold tracking-widest text-secondary uppercase">
              Su misión
            </p>
            {TUTE.mission}
          </blockquote>
          <ul aria-label="Frases de Tute" className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {TUTE.phrases.slice(1).map((f) => (
              <li key={f} className="font-display text-lg text-foreground/80 italic">
                «{f}»
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-8 text-center text-primary-foreground md:p-14">
        <TuteMascot variant="logo-white" className="mx-auto mb-6 h-24 md:h-32" />
        <h2 className="mb-4 font-display text-3xl font-bold md:text-5xl">
          Sucre <span className="text-tropical-gold">Vivo</span> ya se puede recorrer
        </h2>
        <p className="mx-auto mb-8 max-w-2xl font-body text-lg text-primary-foreground/85">
          Explora destinos, actividades y la agenda cultural, o pregúntale al asistente con
          inteligencia artificial por lo que quieras vivir en Sucre.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-body font-semibold text-foreground transition-colors outline-none hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-tropical-gold"
          >
            Explorar la plataforma
          </Link>
          <Link
            href="/#hero"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 font-body font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-tropical-gold"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Hablar con el asistente
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center gap-4 text-center">
        <p className="font-body text-sm text-muted-foreground">Un proyecto de investigación de</p>
        <CunLogo variant="logo" className="h-28 md:h-36" />
        <p className="font-body text-xs text-muted-foreground">
          {RESEARCH_META.seedbed} · {RESEARCH_META.program}
        </p>
      </div>
    </section>
  );
}

export default function ResearchLanding() {
  return (
    <div className="min-h-screen bg-background">
      <ResearchHero />
      <ResearchNav />
      <main>
        <ContextSection />
        <ObjectivesSection />
        <MethodologySection />
        <FindingsSection />
        <BenefitsSection />
        <ProjectionSection />
        <TechnologySection />
        <MeetTute />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useScroll, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hero", label: "Inicio" },
  { id: "imperdibles", label: "Imperdibles" },
  { id: "que-hacer", label: "Qué hacer" },
  { id: "agenda-cultural", label: "Agenda cultural" },
  { id: "mapa", label: "Mapa" },
  { id: "convocatorias", label: "Convocatorias" },
] as const;

export default function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActive(mostVisible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-y-0 left-5 z-30 hidden items-center lg:flex">
      <div className="relative flex h-[38vh] flex-col justify-between">
        <div className="absolute inset-y-0 left-[3px] w-px bg-foreground/10" />
        <m.div
          className="absolute left-[3px] top-0 w-px origin-top bg-primary"
          style={{ scaleY: progress, height: "100%" }}
        />
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className="group pointer-events-auto relative flex items-center py-1"
              onClick={() =>
                document
                  .getElementById(s.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              aria-label={`Ir a la sección ${s.label}`}
            >
              <span
                className={cn(
                  "relative z-10 block size-[7px] rounded-full bg-foreground/25 transition-transform duration-300 group-hover:bg-foreground/60",
                  isActive && "scale-[1.7] bg-primary group-hover:bg-primary",
                )}
              />
              <span className="pointer-events-none absolute left-4 whitespace-nowrap rounded-md bg-foreground px-2 py-1 font-body text-xs text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useRef, useState } from "react";
import { EXPO_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const nf = (decimals: number) =>
  new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** Formatea con separadores colombianos (13.300, 42,9). */
export function formatNumber(value: number, decimals = 0): string {
  return nf(decimals).format(value);
}

/**
 * Cifra que cuenta desde 0 al entrar en pantalla. El valor final siempre está en el DOM
 * (sr-only) para lectores de pantalla y para quien tenga movimiento reducido.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EXPO_OUT,
      onUpdate: (v) => setShown(v),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  const final = `${prefix}${formatNumber(value, decimals)}${suffix}`;
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span aria-hidden>
        {prefix}
        {formatNumber(shown, decimals)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}

/** Barra horizontal que crece al entrar en pantalla. */
export function GrowBar({
  percent,
  className,
  barClassName,
  delay = 0,
}: {
  percent: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-muted", className)} aria-hidden>
      <m.div
        className={cn("h-full origin-left rounded-full bg-primary", barClassName)}
        style={{ width: `${clamped}%` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay, ease: EXPO_OUT }}
      />
    </div>
  );
}

/** Medidor semicircular para puntajes sobre una escala (p. ej. 3,04 / 5). */
export function Gauge({
  value,
  max,
  label,
  tone = "primary",
}: {
  value: number;
  max: number;
  label: string;
  tone?: "primary" | "secondary" | "coral";
}) {
  const ratio = Math.max(0, Math.min(1, value / max));
  const r = 52;
  const arc = Math.PI * r;
  const stroke =
    tone === "coral"
      ? "hsl(var(--tropical-coral))"
      : tone === "secondary"
        ? "hsl(var(--secondary))"
        : "hsl(var(--primary))";
  return (
    <figure className="flex flex-col items-center text-center">
      <svg viewBox="0 0 128 74" className="w-full max-w-[200px]" aria-hidden>
        <path
          d={`M 12 64 A ${r} ${r} 0 0 1 116 64`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <m.path
          d={`M 12 64 A ${r} ${r} 0 0 1 116 64`}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={arc}
          initial={{ strokeDashoffset: arc }}
          whileInView={{ strokeDashoffset: arc * (1 - ratio) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EXPO_OUT }}
        />
      </svg>
      <p className="-mt-8 font-display text-3xl font-bold text-foreground">
        <CountUp value={value} decimals={2} />
        <span className="font-body text-base font-medium text-muted-foreground">
          {" "}
          / {formatNumber(max)}
        </span>
      </p>
      <figcaption className="mt-2 font-body text-sm font-semibold text-foreground">
        {label}
      </figcaption>
    </figure>
  );
}

/** Fila de puntos con uno resaltado: posición en un ranking (puesto 25 de 32). */
export function RankDots({ rank, total }: { rank: number; total: number }) {
  return (
    <div className="grid grid-cols-8 gap-1.5" aria-hidden>
      {Array.from({ length: total }, (_, i) => {
        const pos = i + 1;
        const isRank = pos === rank;
        return (
          <m.span
            // biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas del ranking
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.025, ease: EXPO_OUT }}
            className={cn(
              "flex aspect-square items-center justify-center rounded-full font-body text-[10px] font-bold",
              isRank
                ? "bg-secondary text-secondary-foreground ring-4 ring-secondary/25"
                : pos < rank
                  ? "bg-primary/15 text-primary/60"
                  : "bg-muted text-muted-foreground/50",
            )}
          >
            {pos}
          </m.span>
        );
      })}
    </div>
  );
}

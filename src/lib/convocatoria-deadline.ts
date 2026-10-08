/** Medianoche UTC del día calendario de `date`. */
export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Vigente si el día UTC de `deadline` es ≥ al día UTC de `now` (hoy sigue abierto).
 */
export function isDeadlineOpen(deadline: Date, now: Date = new Date()): boolean {
  return startOfUtcDay(deadline).getTime() >= startOfUtcDay(now).getTime();
}

const DEADLINE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Etiqueta legible en español (día calendario UTC). */
export function formatDeadlineLabel(deadline: Date): string {
  return DEADLINE_FORMATTER.format(deadline);
}

const MONTH_LABELS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const MONTH_PARAM_REGEX = /^(\d{4})-(\d{2})$/;

export type MonthRange = {
  start: Date;
  end: Date;
};

/** Rango [inicio de mes, inicio de mes siguiente) en UTC, para consultas por `startsAt`. */
export function getMonthRange(year: number, month: number): MonthRange {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  return { start, end };
}

/** Parsea "YYYY-MM"; devuelve null si el formato o el mes son inválidos. */
export function parseMonthParam(
  value: string | null | undefined,
): { year: number; month: number } | null {
  if (!value) return null;
  const match = MONTH_PARAM_REGEX.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

/** Etiqueta en español, p. ej. "octubre de 2026". */
export function formatMonthLabel(year: number, month: number): string {
  const label = MONTH_LABELS_ES[month - 1];
  return `${label} de ${year}`;
}

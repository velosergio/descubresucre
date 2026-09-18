export type IcsEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
};

const DEFAULT_TIMED_DURATION_MS = 60 * 60 * 1000;
const ICS_LINE_FOLD_LENGTH = 75;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function formatDateOnly(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

function formatDateTimeUtc(d: Date): string {
  return `${formatDateOnly(d)}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/** RFC 5545 §3.3.11: escapa backslash, coma, punto y coma y saltos de línea. */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** RFC 5545 §3.1: plegado de línea a 75 octetos, continuación con un espacio. */
function foldLine(line: string): string {
  if (line.length <= ICS_LINE_FOLD_LENGTH) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > ICS_LINE_FOLD_LENGTH) {
    chunks.push(rest.slice(0, ICS_LINE_FOLD_LENGTH));
    rest = ` ${rest.slice(ICS_LINE_FOLD_LENGTH)}`;
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

/** Contenido `.ics` (RFC 5545) para un único VEVENT; el horario se trata como UTC nominal. */
export function buildIcsContent(event: IcsEvent): string {
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : start;
  const now = new Date();

  const dtStart = event.allDay
    ? `DTSTART;VALUE=DATE:${formatDateOnly(start)}`
    : `DTSTART:${formatDateTimeUtc(start)}`;
  const dtEnd = event.allDay
    ? `DTEND;VALUE=DATE:${formatDateOnly(addDays(end, 1))}`
    : `DTEND:${formatDateTimeUtc(event.endsAt ? end : new Date(start.getTime() + DEFAULT_TIMED_DURATION_MS))}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sucre Vivo//Eventos y Agenda Cultural//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@descubresucre`,
    `DTSTAMP:${formatDateTimeUtc(now)}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

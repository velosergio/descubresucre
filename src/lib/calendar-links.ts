export type CalendarLinkEvent = {
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
};

const DEFAULT_TIMED_DURATION_MS = 60 * 60 * 1000;

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

/** URL pública de la plantilla "Add event" de Google Calendar; sin autenticación ni API. */
export function buildGoogleCalendarUrl(event: CalendarLinkEvent): string {
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : start;

  const dates = event.allDay
    ? `${formatDateOnly(start)}/${formatDateOnly(addDays(end, 1))}`
    : `${formatDateTimeUtc(start)}/${formatDateTimeUtc(event.endsAt ? end : new Date(start.getTime() + DEFAULT_TIMED_DURATION_MS))}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

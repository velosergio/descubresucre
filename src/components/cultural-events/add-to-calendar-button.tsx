import { CalendarPlus } from "lucide-react";
import { buildGoogleCalendarUrl } from "@/lib/calendar-links";
import type { CulturalEventPublic } from "@/lib/get-cultural-events-home";

export function AddToCalendarButton({ event }: { event: CulturalEventPublic }) {
  const googleUrl = buildGoogleCalendarUrl(event);
  const icsUrl = `/api/cultural-events/${event.id}/ics`;

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      <span className="flex items-center gap-1 font-body text-xs font-medium text-muted-foreground">
        <CalendarPlus className="size-3.5" aria-hidden />
        Agregar a calendario:
      </span>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        Google Calendar
      </a>
      <a
        href={icsUrl}
        className="font-body text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        Descargar .ics
      </a>
    </div>
  );
}

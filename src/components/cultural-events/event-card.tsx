import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useTiltCard } from "@/hooks/use-tilt-card";
import type { CulturalEventPublic } from "@/lib/get-cultural-events-home";
import { toServedMediaUrl } from "@/lib/media-url";

const CATEGORY_ACCENT_CLASSES = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-tropical-coral/10 text-tropical-coral",
  "bg-accent/80 text-accent-foreground",
];

/** Acento visual determinístico por texto de categoría (sin diccionario fijo). */
function categoryAccentClass(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_ACCENT_CLASSES[hash % CATEGORY_ACCENT_CLASSES.length] as string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const TIME_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

/** El horario se guarda y se muestra en UTC "nominal": la hora que escribe el staff es la que se ve, sin conversión de zona. */
function formatEventDateRange(
  event: Pick<CulturalEventPublic, "startsAt" | "endsAt" | "allDay">,
): string {
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : null;

  if (end && end.getTime() !== start.getTime()) {
    return `${DATE_FORMATTER.format(start)} – ${DATE_FORMATTER.format(end)}`;
  }
  if (!event.allDay) {
    return `${DATE_FORMATTER.format(start)}, ${TIME_FORMATTER.format(start)}`;
  }
  return DATE_FORMATTER.format(start);
}

export function EventCard({
  event,
  actions,
}: {
  event: CulturalEventPublic;
  actions?: React.ReactNode;
}) {
  const imgSrc = event.imageUrl ? toServedMediaUrl(event.imageUrl) : null;
  const tilt = useTiltCard<HTMLDivElement>();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: mousemove/mouseleave solo animan un tilt decorativo, no gatillan ninguna acción
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="tilt-card flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm sm:flex-row"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-48 sm:min-h-[12rem] sm:self-stretch">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center" aria-hidden>
            <Calendar className="size-10 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-2 p-5">
        <span
          className={`inline-block w-fit rounded-full px-2 py-0.5 font-body text-xs font-medium ${categoryAccentClass(event.category)}`}
        >
          {event.category}
        </span>
        <h3 className="font-display font-bold text-lg text-foreground">{event.title}</h3>
        <div className="flex items-center gap-2 font-body text-sm text-primary">
          <Calendar className="w-4 h-4" />
          {formatEventDateRange(event)}
        </div>
        <div className="flex items-center gap-2 font-body text-sm text-secondary">
          <MapPin className="w-4 h-4" />
          {event.location}
        </div>
        <p className="font-body text-sm text-muted-foreground">{event.description}</p>
        {actions}
      </div>
    </div>
  );
}

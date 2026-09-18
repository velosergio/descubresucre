import type { CulturalEvent } from "@/generated/prisma";
import { getMonthRange } from "@/lib/month-range";
import { prisma } from "@/lib/prisma";

export type CulturalEventPublic = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
  imageUrl: string | null;
  mapLat: number | null;
  mapLng: number | null;
};

export type CulturalEventsHomePayload = {
  year: number;
  month: number;
  events: CulturalEventPublic[];
};

function toPublicEvent(row: CulturalEvent): CulturalEventPublic {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt ? row.endsAt.toISOString() : null,
    allDay: row.allDay,
    imageUrl: row.imageUrl,
    mapLat: row.mapLat == null ? null : Number(row.mapLat),
    mapLng: row.mapLng == null ? null : Number(row.mapLng),
  };
}

/** Eventos publicados cuyo `startsAt` cae dentro del mes pedido, orden cronológico. */
export async function getCulturalEventsForMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<CulturalEventsHomePayload> {
  const { start, end } = getMonthRange(year, month);
  const rows = await prisma.culturalEvent.findMany({
    where: { published: true, startsAt: { gte: start, lt: end } },
    orderBy: { startsAt: "asc" },
  });
  return { year, month, events: rows.map(toPublicEvent) };
}

export type CulturalEventAdminRow = CulturalEventPublic & {
  published: boolean;
};

/** Todos los eventos (publicados o no, cualquier mes) para la pantalla de administración. */
export async function getAllCulturalEventsForAdmin(): Promise<CulturalEventAdminRow[]> {
  const rows = await prisma.culturalEvent.findMany({ orderBy: { startsAt: "asc" } });
  return rows.map((row) => ({ ...toPublicEvent(row), published: row.published }));
}

/** Evento público por id; `null` si no existe o no está publicado. */
export async function getPublishedCulturalEventById(
  id: string,
): Promise<CulturalEventPublic | null> {
  const row = await prisma.culturalEvent.findUnique({ where: { id } });
  if (!row?.published) return null;
  return toPublicEvent(row);
}

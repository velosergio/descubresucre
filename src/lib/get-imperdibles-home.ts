import type { ImperdiblesSectionSettings } from "@/generated/prisma";
import {
  destinationToPublicCard,
  IMPERDIBLES_HOME_MAX_ITEMS,
  type ImperdiblesHomePayload,
  shuffleImperdibleCards,
} from "@/lib/imperdibles-public";
import { prisma } from "@/lib/prisma";

export async function getOrCreateSectionSettings(): Promise<ImperdiblesSectionSettings> {
  const existing = await prisma.imperdiblesSectionSettings.findUnique({
    where: { id: "singleton" },
  });
  if (existing) return existing;
  return prisma.imperdiblesSectionSettings.create({
    data: { id: "singleton" },
  });
}

/** Datos de la sección en la home: respeta modo rejilla (máx. 3) o carrusel (todos hasta tope). */
export async function getImperdiblesForHome(): Promise<ImperdiblesHomePayload> {
  const [settings, rows] = await Promise.all([
    getOrCreateSectionSettings(),
    prisma.imperdibleDestination.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: IMPERDIBLES_HOME_MAX_ITEMS,
    }),
  ]);
  let cards = rows.map(destinationToPublicCard);
  if (settings.itemOrder === "RANDOM") {
    cards = shuffleImperdibleCards(cards);
  }
  if (settings.displayMode === "GRID_THREE") {
    cards = cards.slice(0, 3);
  }
  return {
    settings: {
      displayMode: settings.displayMode,
      itemOrder: settings.itemOrder,
      headingTitle: settings.headingTitle,
      headingSubtitle: settings.headingSubtitle,
      carouselIntervalMs: settings.carouselIntervalMs,
    },
    items: cards,
  };
}

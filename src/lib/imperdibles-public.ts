import type { ImperdibleDestination, ImperdiblesSectionSettings } from "@/generated/prisma";

export const IMPERDIBLES_HOME_MAX_ITEMS = 20;

export type ImperdiblePublicCard = {
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string;
};

export type ImperdiblesHomePayload = {
  settings: Pick<
    ImperdiblesSectionSettings,
    "displayMode" | "itemOrder" | "headingTitle" | "headingSubtitle" | "carouselIntervalMs"
  >;
  items: ImperdiblePublicCard[];
};

export function destinationToPublicCard(row: ImperdibleDestination): ImperdiblePublicCard {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    cardImageUrl: row.cardImageUrl,
  };
}

/** Fisher–Yates; muta una copia y la devuelve. */
export function shuffleImperdibleCards<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j] as T;
    a[j] = tmp as T;
  }
  return a;
}

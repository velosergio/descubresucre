import type { HeroAppearanceSettings } from "@/generated/prisma";
import { parseCarouselSlides } from "@/lib/hero-appearance";

export type HeroRefsPick = Pick<
  HeroAppearanceSettings,
  "heroImageUrl" | "heroVideoUrl" | "carouselSlides"
>;

/** Indica si la URL de un activo de galería está usada en la configuración actual del hero. */
export function isGalleryUrlReferencedByHero(
  hero: HeroRefsPick | null,
  publicUrl: string,
): boolean {
  const needle = publicUrl.trim();
  if (!needle || !hero) return false;

  if (hero.heroImageUrl?.trim() === needle) return true;
  if (hero.heroVideoUrl?.trim() === needle) return true;

  const slides = parseCarouselSlides(hero.carouselSlides);
  for (const s of slides) {
    if (s.url.trim() === needle) return true;
  }

  return false;
}

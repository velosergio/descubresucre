import type { HeroAppearanceSettings, HeroVideoSource } from "@/generated/prisma";

export type HeroCarouselSlide = { url: string; alt?: string };

export type ResolvedHeroConfig =
  | { mode: "IMAGE_DEFAULT" }
  | { mode: "IMAGE_CUSTOM"; imageUrl: string }
  | { mode: "VIDEO"; videoUrl: string; isExternal: boolean }
  | { mode: "CAROUSEL"; slides: HeroCarouselSlide[] };

const CAROUSEL_MIN_SLIDES = 2;

export function isPublicUploadPath(path: string): boolean {
  const p = path.trim();
  if (p.includes("..")) return false;
  return p.startsWith("/uploads/hero/") || p.startsWith("/uploads/gallery/");
}

/** URLs directas de vídeo (HTTPS o http localhost). */
export function isAllowedExternalVideoUrl(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  try {
    const u = new URL(s);
    if (u.protocol === "https:") return true;
    if (u.protocol === "http:" && /^(127\.0\.0\.1|localhost)$/i.test(u.hostname)) return true;
    return false;
  } catch {
    return false;
  }
}

export function parseCarouselSlides(json: unknown): HeroCarouselSlide[] {
  if (!Array.isArray(json)) return [];
  const out: HeroCarouselSlide[] = [];
  for (const item of json) {
    if (!item || typeof item !== "object") continue;
    const url = "url" in item && typeof item.url === "string" ? item.url.trim() : "";
    if (!url) continue;
    const alt = "alt" in item && typeof item.alt === "string" ? item.alt.trim() : undefined;
    out.push({ url, alt: alt || undefined });
  }
  return out;
}

export function resolveHeroFromRow(row: HeroAppearanceSettings | null): ResolvedHeroConfig {
  if (!row || row.heroMode === "IMAGE_DEFAULT") {
    return { mode: "IMAGE_DEFAULT" };
  }

  if (row.heroMode === "IMAGE_CUSTOM") {
    const url = row.heroImageUrl?.trim();
    if (!url || !isPublicUploadPath(url)) {
      return { mode: "IMAGE_DEFAULT" };
    }
    return { mode: "IMAGE_CUSTOM", imageUrl: url };
  }

  if (row.heroMode === "VIDEO") {
    const url = row.heroVideoUrl?.trim();
    if (!url) return { mode: "IMAGE_DEFAULT" };
    const external = row.heroVideoSource === "EXTERNAL_URL";
    if (external && !isAllowedExternalVideoUrl(url)) {
      return { mode: "IMAGE_DEFAULT" };
    }
    if (!external && !isPublicUploadPath(url)) {
      return { mode: "IMAGE_DEFAULT" };
    }
    return { mode: "VIDEO", videoUrl: url, isExternal: external };
  }

  if (row.heroMode === "CAROUSEL") {
    const slides = parseCarouselSlides(row.carouselSlides);
    if (slides.length < CAROUSEL_MIN_SLIDES) {
      return { mode: "IMAGE_DEFAULT" };
    }
    for (const s of slides) {
      if (!isAllowedSlideUrl(s.url)) {
        return { mode: "IMAGE_DEFAULT" };
      }
    }
    return { mode: "CAROUSEL", slides };
  }

  return { mode: "IMAGE_DEFAULT" };
}

function isAllowedSlideUrl(url: string): boolean {
  const u = url.trim();
  if (isPublicUploadPath(u)) return true;
  return isAllowedExternalVideoUrl(u);
}

export type HeroSaveInput =
  | { heroMode: "IMAGE_DEFAULT" }
  | { heroMode: "IMAGE_CUSTOM"; heroImageUrl: string }
  | { heroMode: "VIDEO"; heroVideoUrl: string; heroVideoSource: HeroVideoSource }
  | { heroMode: "CAROUSEL"; carouselSlides: HeroCarouselSlide[] };

export function validateHeroSaveInput(
  input: unknown,
): { ok: true; data: HeroSaveInput } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Datos inválidos" };
  }
  const o = input as Record<string, unknown>;
  const mode = o.heroMode;

  if (mode === "IMAGE_DEFAULT") {
    return { ok: true, data: { heroMode: "IMAGE_DEFAULT" } };
  }

  if (mode === "IMAGE_CUSTOM") {
    const heroImageUrl = typeof o.heroImageUrl === "string" ? o.heroImageUrl.trim() : "";
    if (!heroImageUrl || !isPublicUploadPath(heroImageUrl)) {
      return { ok: false, error: "Imagen: usa una subida válida del sitio." };
    }
    return { ok: true, data: { heroMode: "IMAGE_CUSTOM", heroImageUrl } };
  }

  if (mode === "VIDEO") {
    const heroVideoUrl = typeof o.heroVideoUrl === "string" ? o.heroVideoUrl.trim() : "";
    const src = o.heroVideoSource;
    if (!heroVideoUrl) {
      return { ok: false, error: "Indica un vídeo o URL." };
    }
    if (src !== "UPLOAD" && src !== "EXTERNAL_URL") {
      return { ok: false, error: "Origen de vídeo inválido." };
    }
    if (src === "EXTERNAL_URL") {
      if (!isAllowedExternalVideoUrl(heroVideoUrl)) {
        return {
          ok: false,
          error: "La URL del vídeo debe ser HTTPS (o http://localhost en desarrollo).",
        };
      }
    } else if (!isPublicUploadPath(heroVideoUrl)) {
      return { ok: false, error: "Sube un archivo de vídeo válido." };
    }
    return {
      ok: true,
      data: {
        heroMode: "VIDEO",
        heroVideoUrl,
        heroVideoSource: src as HeroVideoSource,
      },
    };
  }

  if (mode === "CAROUSEL") {
    const slides = parseCarouselSlides(o.carouselSlides);
    if (slides.length < CAROUSEL_MIN_SLIDES) {
      return { ok: false, error: `El carrusel necesita al menos ${CAROUSEL_MIN_SLIDES} imágenes.` };
    }
    for (const s of slides) {
      if (!isAllowedSlideUrl(s.url)) {
        return { ok: false, error: "Cada slide debe ser una subida del sitio o una URL HTTPS." };
      }
    }
    return { ok: true, data: { heroMode: "CAROUSEL", carouselSlides: slides } };
  }

  return { ok: false, error: "Modo de banner no reconocido." };
}

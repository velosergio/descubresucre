"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import type { HeroMode, HeroVideoSource } from "@/generated/prisma";
import { assertAdminAction } from "@/lib/auth-helpers";
import { encodeRasterImageToWebp, HERO_WEBP_MAX_EDGE } from "@/lib/encode-image-webp";
import type { HeroCarouselSlide, HeroSaveInput } from "@/lib/hero-appearance";
import { validateHeroSaveInput } from "@/lib/hero-appearance";
import { prisma } from "@/lib/prisma";
import {
  IMAGE_MIME_TO_EXT,
  MAX_UPLOAD_IMAGE_BYTES,
  MAX_UPLOAD_VIDEO_BYTES,
  VIDEO_MIME_TO_EXT,
} from "@/lib/upload-limits";

export async function uploadHeroAssetAction(formData: FormData) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const kind = formData.get("kind");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Selecciona un archivo." };
  }

  const mime = file.type || "application/octet-stream";

  try {
    if (kind === "hero-video") {
      const ext = VIDEO_MIME_TO_EXT[mime];
      if (!ext || file.size > MAX_UPLOAD_VIDEO_BYTES) {
        return { ok: false as const, error: "Vídeo: solo MP4/WebM y máximo 80 MB." };
      }
      const dir = path.join(process.cwd(), "public", "uploads", "hero", "video");
      await mkdir(dir, { recursive: true });
      const name = `${randomUUID()}${ext}`;
      const full = path.join(dir, name);
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(full, buf);
      return { ok: true as const, url: `/uploads/hero/video/${name}` };
    }

    if (kind === "hero-image" || kind === "carousel-image") {
      const ext = IMAGE_MIME_TO_EXT[mime];
      if (!ext || file.size > MAX_UPLOAD_IMAGE_BYTES) {
        return { ok: false as const, error: "Imagen: JPEG, PNG o WebP, máximo 8 MB." };
      }
      const dir = path.join(process.cwd(), "public", "uploads", "hero", "images");
      await mkdir(dir, { recursive: true });
      const raw = Buffer.from(await file.arrayBuffer());
      let webp: Buffer;
      try {
        webp = await encodeRasterImageToWebp(raw, { maxEdge: HERO_WEBP_MAX_EDGE });
      } catch {
        return {
          ok: false as const,
          error: "No se pudo optimizar la imagen. Usa un JPEG, PNG o WebP válido.",
        };
      }
      const name = `${randomUUID()}.webp`;
      const full = path.join(dir, name);
      await writeFile(full, webp);
      return { ok: true as const, url: `/uploads/hero/images/${name}` };
    }

    return { ok: false as const, error: "Tipo de subida no reconocido." };
  } catch (e) {
    console.error("uploadHeroAssetAction", e);
    return { ok: false as const, error: "No se pudo guardar el archivo." };
  }
}

function toPrismaData(data: HeroSaveInput): {
  heroMode: HeroMode;
  heroImageUrl: string | null;
  heroVideoUrl: string | null;
  heroVideoSource: HeroVideoSource | null;
  carouselSlides: HeroCarouselSlide[] | null;
} {
  if (data.heroMode === "IMAGE_DEFAULT") {
    return {
      heroMode: "IMAGE_DEFAULT",
      heroImageUrl: null,
      heroVideoUrl: null,
      heroVideoSource: null,
      carouselSlides: null,
    };
  }
  if (data.heroMode === "IMAGE_CUSTOM") {
    return {
      heroMode: "IMAGE_CUSTOM",
      heroImageUrl: data.heroImageUrl,
      heroVideoUrl: null,
      heroVideoSource: null,
      carouselSlides: null,
    };
  }
  if (data.heroMode === "VIDEO") {
    return {
      heroMode: "VIDEO",
      heroImageUrl: null,
      heroVideoUrl: data.heroVideoUrl,
      heroVideoSource: data.heroVideoSource,
      carouselSlides: null,
    };
  }
  return {
    heroMode: "CAROUSEL",
    heroImageUrl: null,
    heroVideoUrl: null,
    heroVideoSource: null,
    carouselSlides: data.carouselSlides,
  };
}

export async function saveHeroAppearanceAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = validateHeroSaveInput(input);
  if (!parsed.ok) {
    return { ok: false as const, error: parsed.error };
  }

  const prismaPayload = toPrismaData(parsed.data);

  try {
    await prisma.heroAppearanceSettings.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        heroMode: prismaPayload.heroMode,
        heroImageUrl: prismaPayload.heroImageUrl,
        heroVideoUrl: prismaPayload.heroVideoUrl,
        heroVideoSource: prismaPayload.heroVideoSource,
        carouselSlides: prismaPayload.carouselSlides ?? undefined,
      },
      update: {
        heroMode: prismaPayload.heroMode,
        heroImageUrl: prismaPayload.heroImageUrl,
        heroVideoUrl: prismaPayload.heroVideoUrl,
        heroVideoSource: prismaPayload.heroVideoSource,
        carouselSlides: prismaPayload.carouselSlides ?? undefined,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/personalizar/banner");
    revalidatePath("/admin/personalizar/galeria");
    return { ok: true as const };
  } catch (e) {
    console.error("saveHeroAppearanceAction", e);
    return { ok: false as const, error: "No se pudo guardar el banner." };
  }
}

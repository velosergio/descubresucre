"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import type { GalleryAssetKind } from "@/generated/prisma";
import { assertAdminAction } from "@/lib/auth-helpers";
import { encodeRasterImageToWebp, GALLERY_WEBP_MAX_EDGE } from "@/lib/encode-image-webp";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";
import { collectGalleryOrphanIds, mapExistingGalleryRowsToDTO } from "@/lib/gallery-assets";
import { isGalleryUrlReferencedByHero } from "@/lib/gallery-hero-references";
import { prisma } from "@/lib/prisma";
import {
  IMAGE_MIME_TO_EXT,
  MAX_UPLOAD_IMAGE_BYTES,
  MAX_UPLOAD_VIDEO_BYTES,
  VIDEO_MIME_TO_EXT,
} from "@/lib/upload-limits";

export async function listGalleryAssetsAction(input?: { kind?: GalleryAssetKind }) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  try {
    const rows = await prisma.galleryAsset.findMany({
      where: input?.kind ? { kind: input.kind } : undefined,
      orderBy: { createdAt: "desc" },
    });
    const assets: GalleryAssetDTO[] = await mapExistingGalleryRowsToDTO(rows);
    return { ok: true as const, assets };
  } catch (e) {
    console.error("listGalleryAssetsAction", e);
    return { ok: false as const, error: "No se pudo cargar la galería." };
  }
}

function filePathFromPublicUrl(publicUrl: string): string | null {
  const u = publicUrl.trim();
  if (!u.startsWith("/uploads/gallery/") || u.includes("..")) return null;
  return path.join(process.cwd(), "public", u.replace(/^\//, ""));
}

export async function uploadGalleryAssetAction(formData: FormData) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Selecciona un archivo." };
  }

  const mime = file.type || "application/octet-stream";
  const originalName = typeof file.name === "string" ? file.name.slice(0, 512) : null;

  try {
    const buf = Buffer.from(await file.arrayBuffer());

    let kind: GalleryAssetKind;
    let subfolder: "images" | "video";
    let fileName: string;

    const imgExt = IMAGE_MIME_TO_EXT[mime];
    const vidExt = VIDEO_MIME_TO_EXT[mime];

    if (imgExt && file.size <= MAX_UPLOAD_IMAGE_BYTES) {
      kind = "IMAGE";
      subfolder = "images";
      fileName = `${randomUUID()}.webp`;
    } else if (vidExt && file.size <= MAX_UPLOAD_VIDEO_BYTES) {
      kind = "VIDEO";
      subfolder = "video";
      fileName = `${randomUUID()}${vidExt}`;
    } else {
      return {
        ok: false as const,
        error: "Formato o tamaño no permitido (imagen ≤8 MB, vídeo ≤80 MB).",
      };
    }

    const publicUrl = `/uploads/gallery/${subfolder}/${fileName}`;
    const dirFs = path.join(process.cwd(), "public", "uploads", "gallery", subfolder);
    await mkdir(dirFs, { recursive: true });
    const fullPath = path.join(dirFs, fileName);

    let bytesOut: number;
    let storedMime: string;

    if (kind === "IMAGE") {
      let webp: Buffer;
      try {
        webp = await encodeRasterImageToWebp(buf, { maxEdge: GALLERY_WEBP_MAX_EDGE });
      } catch {
        return {
          ok: false as const,
          error: "No se pudo optimizar la imagen. Usa un JPEG, PNG o WebP válido.",
        };
      }
      await writeFile(fullPath, webp);
      bytesOut = webp.length;
      storedMime = "image/webp";
    } else {
      await writeFile(fullPath, buf);
      bytesOut = buf.length;
      storedMime = mime.slice(0, 128);
    }

    const row = await prisma.galleryAsset.create({
      data: {
        kind,
        publicUrl,
        mimeType: storedMime,
        sizeBytes: bytesOut,
        originalName,
      },
    });

    revalidatePath("/admin/personalizar/galeria");
    revalidatePath("/admin/personalizar/banner");
    revalidatePath("/admin/personalizar/destinos-imperdibles");

    return {
      ok: true as const,
      id: row.id,
      url: row.publicUrl,
      kind: row.kind,
    };
  } catch (e) {
    console.error("uploadGalleryAssetAction", e);
    return { ok: false as const, error: "No se pudo guardar en la galería." };
  }
}

export async function cleanupGalleryOrphansAction() {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  try {
    const rows = await prisma.galleryAsset.findMany({
      select: {
        id: true,
        kind: true,
        publicUrl: true,
        mimeType: true,
        originalName: true,
        createdAt: true,
      },
    });

    const orphanIds = await collectGalleryOrphanIds(rows);
    if (orphanIds.length === 0) {
      return { ok: true as const, removed: 0 };
    }

    const deleted = await prisma.galleryAsset.deleteMany({
      where: { id: { in: orphanIds } },
    });

    revalidatePath("/admin/personalizar/galeria");
    revalidatePath("/admin/personalizar/banner");
    revalidatePath("/admin/personalizar/destinos-imperdibles");

    return { ok: true as const, removed: deleted.count };
  } catch (e) {
    console.error("cleanupGalleryOrphansAction", e);
    return { ok: false as const, error: "No se pudo limpiar la galería." };
  }
}

export async function deleteGalleryAssetAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  if (!id?.trim()) {
    return { ok: false as const, error: "Identificador inválido." };
  }

  try {
    const asset = await prisma.galleryAsset.findUnique({ where: { id } });
    if (!asset) {
      return { ok: false as const, error: "El elemento ya no existe." };
    }

    const hero = await prisma.heroAppearanceSettings.findUnique({ where: { id: "singleton" } });
    if (isGalleryUrlReferencedByHero(hero, asset.publicUrl)) {
      return {
        ok: false as const,
        error:
          "Este archivo está en uso en el banner. Cambia la configuración del banner antes de borrarlo.",
      };
    }

    const usedByImperdible = await prisma.imperdibleDestination.findFirst({
      where: { cardImageUrl: asset.publicUrl },
      select: { id: true },
    });
    if (usedByImperdible) {
      return {
        ok: false as const,
        error:
          "Este archivo está en uso en Destinos imperdibles. Cambia o elimina ese destino antes de borrarlo.",
      };
    }

    const diskPath = filePathFromPublicUrl(asset.publicUrl);
    if (diskPath) {
      try {
        await unlink(diskPath);
      } catch {
        // archivo ya ausente; seguimos borrando la fila
      }
    }

    await prisma.galleryAsset.delete({ where: { id } });

    revalidatePath("/admin/personalizar/galeria");
    revalidatePath("/admin/personalizar/banner");
    revalidatePath("/admin/personalizar/destinos-imperdibles");
    revalidatePath("/");

    return { ok: true as const };
  } catch (e) {
    console.error("deleteGalleryAssetAction", e);
    return { ok: false as const, error: "No se pudo eliminar." };
  }
}

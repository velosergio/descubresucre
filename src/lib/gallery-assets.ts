import { access } from "node:fs/promises";
import path from "node:path";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";

type GalleryRowLike = {
  id: string;
  kind: GalleryAssetDTO["kind"];
  publicUrl: string;
  mimeType: string | null;
  originalName: string | null;
  createdAt: Date;
};

export async function galleryPublicUrlExists(publicUrl: string): Promise<boolean> {
  const clean = publicUrl.trim();
  if (!clean.startsWith("/uploads/gallery/") || clean.includes("..")) return false;
  const diskPath = path.join(process.cwd(), "public", clean.replace(/^\//, ""));
  try {
    await access(diskPath);
    return true;
  } catch {
    return false;
  }
}

export async function collectGalleryOrphanIds(rows: GalleryRowLike[]): Promise<string[]> {
  const exists = await Promise.all(rows.map((r) => galleryPublicUrlExists(r.publicUrl)));
  return rows.filter((_, i) => !exists[i]).map((r) => r.id);
}

export async function mapExistingGalleryRowsToDTO(
  rows: GalleryRowLike[],
): Promise<GalleryAssetDTO[]> {
  const exists = await Promise.all(rows.map((r) => galleryPublicUrlExists(r.publicUrl)));
  return rows
    .filter((_, i) => exists[i])
    .map((r) => ({
      id: r.id,
      kind: r.kind,
      publicUrl: r.publicUrl,
      mimeType: r.mimeType,
      originalName: r.originalName,
      createdAt: r.createdAt.toISOString(),
    }));
}

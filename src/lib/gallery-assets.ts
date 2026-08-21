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

async function galleryFileExists(publicUrl: string): Promise<boolean> {
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
  const orphanIds: string[] = [];
  for (const r of rows) {
    if (await galleryFileExists(r.publicUrl)) continue;
    orphanIds.push(r.id);
  }
  return orphanIds;
}

export async function mapExistingGalleryRowsToDTO(
  rows: GalleryRowLike[],
): Promise<GalleryAssetDTO[]> {
  const out: GalleryAssetDTO[] = [];
  for (const r of rows) {
    if (!(await galleryFileExists(r.publicUrl))) continue;
    out.push({
      id: r.id,
      kind: r.kind,
      publicUrl: r.publicUrl,
      mimeType: r.mimeType,
      originalName: r.originalName,
      createdAt: r.createdAt.toISOString(),
    });
  }
  return out;
}

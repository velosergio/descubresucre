import type { GalleryAssetKind } from "@/generated/prisma";

export type GalleryAssetDTO = {
  id: string;
  kind: GalleryAssetKind;
  publicUrl: string;
  mimeType: string | null;
  originalName: string | null;
  createdAt: string;
};

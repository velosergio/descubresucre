"use client";

import { Film, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryAssetKind } from "@/generated/prisma";
import { useGalleryPickerAssets } from "@/hooks/use-gallery-picker-assets";
import { useGalleryPickerUpload } from "@/hooks/use-gallery-picker-upload";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";
import { toServedMediaUrl } from "@/lib/media-url";
import { IMAGE_MIME_TO_EXT, VIDEO_MIME_TO_EXT } from "@/lib/upload-limits";

function GalleryAssetTile({ asset, onSelect }: { asset: GalleryAssetDTO; onSelect: () => void }) {
  const src = toServedMediaUrl(asset.publicUrl);
  return (
    <button
      type="button"
      className="group relative aspect-video overflow-hidden rounded-md border bg-muted text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onSelect}
    >
      {asset.kind === "IMAGE" ? (
        <Image src={src} alt="" fill className="object-cover" sizes="200px" unoptimized />
      ) : (
        <div className="flex h-full items-center justify-center bg-muted">
          <Film className="size-12 text-muted-foreground" />
        </div>
      )}
      <span className="sr-only">Seleccionar</span>
    </button>
  );
}

function GalleryUploadTile({
  uploading,
  label,
  onClick,
}: {
  uploading: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={uploading}
      className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/40 text-muted-foreground outline-none ring-offset-background transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      onClick={onClick}
    >
      {uploading ? <span className="text-xs">Subiendo…</span> : <Plus className="size-8" />}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function GalleryPagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage === 0}
        onClick={onPrev}
      >
        Anterior
      </Button>
      <span className="text-xs text-muted-foreground">
        Página {currentPage + 1} de {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages - 1}
        onClick={onNext}
      >
        Siguiente
      </Button>
    </div>
  );
}

export function GalleryPickerDialog({
  open,
  onOpenChange,
  kindFilter,
  onSelect,
  title = "Elegir de la galería",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kindFilter: GalleryAssetKind;
  onSelect: (publicUrl: string) => void;
  title?: string;
}) {
  const { assets, setPage, currentPage, totalPages, pagedAssets } = useGalleryPickerAssets(
    open,
    kindFilter,
  );
  const { uploading, fileInputRef, handleUpload } = useGalleryPickerUpload({
    kindFilter,
    onSelect,
    onOpenChange,
  });

  const acceptAttr = Object.keys(
    kindFilter === "IMAGE" ? IMAGE_MIME_TO_EXT : VIDEO_MIME_TO_EXT,
  ).join(",");
  const addLabel = kindFilter === "IMAGE" ? "Agregar nueva imagen" : "Agregar nuevo vídeo";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {open ? (
          assets === null ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : (
            <>
              {assets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay elementos de este tipo todavía. Agrega el primero abajo.
                </p>
              ) : null}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {pagedAssets.map((a) => (
                  <GalleryAssetTile
                    key={a.id}
                    asset={a}
                    onSelect={() => {
                      onSelect(a.publicUrl);
                      onOpenChange(false);
                    }}
                  />
                ))}
                <GalleryUploadTile
                  uploading={uploading}
                  label={addLabel}
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
              <GalleryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(0, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptAttr}
                className="hidden"
                onChange={(e) => void handleUpload(e.target.files?.[0] ?? null)}
              />
            </>
          )
        ) : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

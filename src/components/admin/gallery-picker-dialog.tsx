"use client";

import { Film, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryAssetKind } from "@/generated/prisma";
import { listGalleryAssetsAction, uploadGalleryAssetAction } from "@/lib/actions/gallery";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";
import { toServedMediaUrl } from "@/lib/media-url";
import { IMAGE_MIME_TO_EXT, VIDEO_MIME_TO_EXT } from "@/lib/upload-limits";

const PAGE_SIZE = 11;

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
  const router = useRouter();
  /** `null` = aún no cargado para la sesión actual del diálogo; array = resultado (vacío o no). */
  const [assets, setAssets] = useState<GalleryAssetDTO[] | null>(null);
  const [page, setPage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const loadIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setPage(0);
    const id = ++loadIdRef.current;
    void listGalleryAssetsAction({ kind: kindFilter }).then((res) => {
      if (loadIdRef.current !== id) return;
      if (res.ok) setAssets(res.assets);
      else setAssets([]);
    });
  }, [open, kindFilter]);

  async function handleUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadGalleryAssetAction(fd);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    if (res.kind !== kindFilter) {
      toast.error(
        kindFilter === "IMAGE"
          ? "Usa una imagen (JPEG, PNG o WebP), no vídeo."
          : "Usa un vídeo (MP4 o WebM), no imagen.",
      );
      return;
    }
    toast.success(
      kindFilter === "IMAGE" ? "Imagen subida a la galería" : "Vídeo subido a la galería",
    );
    router.refresh();
    onSelect(res.url);
    onOpenChange(false);
  }

  const totalPages = assets ? Math.max(1, Math.ceil(assets.length / PAGE_SIZE)) : 1;
  const currentPage = Math.min(page, totalPages - 1);
  const pagedAssets = assets
    ? assets.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)
    : [];
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
                {pagedAssets.map((a) => {
                  const src = toServedMediaUrl(a.publicUrl);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className="group relative aspect-video overflow-hidden rounded-md border bg-muted text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => {
                        onSelect(a.publicUrl);
                        onOpenChange(false);
                      }}
                    >
                      {a.kind === "IMAGE" ? (
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="200px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <Film className="size-12 text-muted-foreground" />
                        </div>
                      )}
                      <span className="sr-only">Seleccionar</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={uploading}
                  className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/40 text-muted-foreground outline-none ring-offset-background transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <span className="text-xs">Subiendo…</span>
                  ) : (
                    <Plus className="size-8" />
                  )}
                  <span className="sr-only">{addLabel}</span>
                </button>
              </div>
              {totalPages > 1 ? (
                <div className="flex items-center justify-between pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
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
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Siguiente
                  </Button>
                </div>
              ) : null}
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

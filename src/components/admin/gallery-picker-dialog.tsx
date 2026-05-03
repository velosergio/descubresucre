"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Film } from "lucide-react";
import type { GalleryAssetKind } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";
import { listGalleryAssetsAction } from "@/lib/actions/gallery";

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
  /** `null` = aún no cargado para la sesión actual del diálogo; array = resultado (vacío o no). */
  const [assets, setAssets] = useState<GalleryAssetDTO[] | null>(null);
  const loadIdRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    const id = ++loadIdRef.current;
    void listGalleryAssetsAction({ kind: kindFilter }).then((res) => {
      if (loadIdRef.current !== id) return;
      if (res.ok) setAssets(res.assets);
      else setAssets([]);
    });
  }, [open, kindFilter]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {open ? (
          assets === null ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay elementos de este tipo. Sube archivos en Personalizar → Galería.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {assets.map((a) => (
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
                    <Image src={a.publicUrl} alt="" fill className="object-cover" sizes="200px" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <Film className="size-12 text-muted-foreground" />
                    </div>
                  )}
                  <span className="sr-only">Seleccionar</span>
                </button>
              ))}
            </div>
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

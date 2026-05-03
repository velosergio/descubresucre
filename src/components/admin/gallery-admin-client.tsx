"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Film, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";
import { cleanupGalleryOrphansAction, deleteGalleryAssetAction, uploadGalleryAssetAction } from "@/lib/actions/gallery";

export function GalleryAdminClient({ initial }: { initial: GalleryAssetDTO[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function onUpload(f: File | null) {
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    startTransition(async () => {
      const res = await uploadGalleryAssetAction(fd);
      if (res.ok) {
        toast.success("Archivo añadido a la galería");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    startTransition(async () => {
      const res = await deleteGalleryAssetAction(id);
      if (res.ok) {
        toast.success("Eliminado");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  function cleanupOrphans() {
    startTransition(async () => {
      const res = await cleanupGalleryOrphansAction();
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if (res.removed === 0) toast.success("No se encontraron registros huérfanos.");
      else toast.success(`Se eliminaron ${res.removed} registros huérfanos.`);
      router.refresh();
    });
  }

  return (
    <>
      <div className="rounded-lg border border-border/80 p-4">
        <Label htmlFor="gallery-upload">Subir imagen o vídeo</Label>
        <Input
          id="gallery-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          disabled={pending}
          className="mt-2 max-w-md"
          onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
        />
        <p className="mt-2 text-xs text-muted-foreground">JPEG, PNG, WebP hasta 12 MB; MP4/WebM hasta 80 MB.</p>
        <div className="mt-3">
          <Button type="button" variant="outline" disabled={pending} onClick={cleanupOrphans}>
            Limpiar registros huérfanos
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initial.map((a) => (
          <GalleryTile key={a.id} asset={a} onDelete={() => setDeleteId(a.id)} pending={pending} />
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este archivo?</AlertDialogTitle>
            <AlertDialogDescription>
              Si el banner o Destinos imperdibles lo están usando, la eliminación será rechazada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete()}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function GalleryTile({
  asset,
  onDelete,
  pending,
}: {
  asset: GalleryAssetDTO;
  onDelete: () => void;
  pending: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm">
      <div className="relative aspect-video bg-muted">
        {asset.kind === "IMAGE" ? (
          <Image src={asset.publicUrl} alt="" fill className="object-cover" sizes="400px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Film className="size-14 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <p className="truncate text-xs text-muted-foreground" title={asset.publicUrl}>
          {asset.publicUrl}
        </p>
        {asset.originalName ? (
          <p className="truncate text-xs font-medium">{asset.originalName}</p>
        ) : null}
        <Button type="button" variant="destructive" size="sm" disabled={pending} className="w-full gap-2" onClick={onDelete}>
          <Trash2 className="size-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}

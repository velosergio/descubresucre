import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { GalleryAssetKind } from "@/generated/prisma";
import { uploadGalleryAssetAction } from "@/lib/actions/gallery";

/** Sube un archivo nuevo a la galería y selecciona el resultado al terminar. */
export function useGalleryPickerUpload({
  kindFilter,
  onSelect,
  onOpenChange,
}: {
  kindFilter: GalleryAssetKind;
  onSelect: (publicUrl: string) => void;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadGalleryAssetAction(fd);

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
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return { uploading, fileInputRef, handleUpload };
}

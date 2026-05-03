import { prisma } from "@/lib/prisma";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";
import { mapExistingGalleryRowsToDTO } from "@/lib/gallery-assets";
import { GalleryAdminClient } from "@/components/admin/gallery-admin-client";

export default async function AdminGaleriaPage() {
  const rows = await prisma.galleryAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  const initial: GalleryAssetDTO[] = await mapExistingGalleryRowsToDTO(rows);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Galería de medios</h1>
        <p className="max-w-xl text-muted-foreground">
          Imágenes y vídeos reutilizables en el banner y en futuras secciones. Los archivos nuevos desde el banner también se registran
          aquí.
        </p>
      </div>

      <GalleryAdminClient initial={initial} />
    </div>
  );
}

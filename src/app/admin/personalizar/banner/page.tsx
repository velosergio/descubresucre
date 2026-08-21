import { HeroBannerSettingsForm } from "@/components/admin/hero-banner-settings-form";
import { parseCarouselSlides } from "@/lib/hero-appearance";
import { prisma } from "@/lib/prisma";

export default async function AdminHeroBannerPage() {
  const row = await prisma.heroAppearanceSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Banner principal
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Define si la portada muestra la imagen incorporada del proyecto, una imagen propia, un
          vídeo en bucle o un carrusel de imágenes.
        </p>
      </div>

      <HeroBannerSettingsForm
        initial={{
          heroMode: row?.heroMode ?? "IMAGE_DEFAULT",
          heroImageUrl: row?.heroImageUrl ?? null,
          heroVideoUrl: row?.heroVideoUrl ?? null,
          heroVideoSource: row?.heroVideoSource ?? null,
          carouselSlides: row?.carouselSlides ? parseCarouselSlides(row.carouselSlides) : [],
        }}
      />
    </div>
  );
}

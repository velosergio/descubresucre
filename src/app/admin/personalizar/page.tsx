import Link from "next/link";
import { ImageIcon, Images } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPersonalizarPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Personalizar</h1>
        <p className="max-w-xl text-muted-foreground">
          Ajusta la apariencia pública del sitio. Más opciones se irán añadiendo aquí.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        <Link href="/admin/personalizar/galeria" className="block transition-opacity hover:opacity-90">
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Images className="size-6 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Galería</CardTitle>
                <CardDescription>Imágenes y vídeos reutilizables para el banner y otras secciones.</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/personalizar/banner" className="block transition-opacity hover:opacity-90">
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <ImageIcon className="size-6 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Banner principal</CardTitle>
                <CardDescription>
                  Imagen, vídeo o carrusel de fondo en la portada (elige desde la galería o sube archivos nuevos).
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

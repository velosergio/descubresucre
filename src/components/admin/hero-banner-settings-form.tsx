"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GalleryPickerDialog } from "@/components/admin/gallery-picker-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { HeroMode, HeroVideoSource } from "@/generated/prisma";
import { uploadGalleryAssetAction } from "@/lib/actions/gallery";
import { saveHeroAppearanceAction } from "@/lib/actions/hero-appearance";
import type { HeroCarouselSlide } from "@/lib/hero-appearance";
import { isAllowedExternalVideoUrl } from "@/lib/hero-appearance";

const MODES: { value: HeroMode; label: string; hint: string }[] = [
  {
    value: "IMAGE_DEFAULT",
    label: "Imagen por defecto",
    hint: "Foto aérea de Sucre incluida en el sitio.",
  },
  { value: "IMAGE_CUSTOM", label: "Imagen subida", hint: "Una imagen tuya a pantalla completa." },
  { value: "VIDEO", label: "Vídeo de fondo", hint: "Archivo MP4/WebM o enlace directo HTTPS." },
  {
    value: "CAROUSEL",
    label: "Carrusel de imágenes",
    hint: "Mínimo dos imágenes; rotación automática.",
  },
];

export type HeroBannerInitial = {
  heroMode: HeroMode;
  heroImageUrl: string | null;
  heroVideoUrl: string | null;
  heroVideoSource: HeroVideoSource | null;
  carouselSlides: HeroCarouselSlide[];
};

export function HeroBannerSettingsForm({ initial }: { initial: HeroBannerInitial }) {
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<HeroMode>(initial.heroMode);
  const [heroImageUrl, setHeroImageUrl] = useState(initial.heroImageUrl ?? "");
  const [heroVideoUrl, setHeroVideoUrl] = useState(initial.heroVideoUrl ?? "");
  const [videoSource, setVideoSource] = useState<"UPLOAD" | "EXTERNAL_URL">(
    initial.heroVideoSource === "EXTERNAL_URL" ? "EXTERNAL_URL" : "UPLOAD",
  );
  const [carouselSlides, setCarouselSlides] = useState<HeroCarouselSlide[]>(
    initial.carouselSlides.length > 0 ? initial.carouselSlides : [],
  );

  const [pickHeroImageOpen, setPickHeroImageOpen] = useState(false);
  const [pickVideoOpen, setPickVideoOpen] = useState(false);
  const [pickCarouselOpen, setPickCarouselOpen] = useState(false);

  function buildPayload(): unknown {
    if (mode === "IMAGE_DEFAULT") return { heroMode: "IMAGE_DEFAULT" as const };
    if (mode === "IMAGE_CUSTOM") {
      return { heroMode: "IMAGE_CUSTOM" as const, heroImageUrl: heroImageUrl.trim() };
    }
    if (mode === "VIDEO") {
      return {
        heroMode: "VIDEO" as const,
        heroVideoUrl: heroVideoUrl.trim(),
        heroVideoSource: videoSource as HeroVideoSource,
      };
    }
    return { heroMode: "CAROUSEL" as const, carouselSlides };
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (
      mode === "VIDEO" &&
      videoSource === "EXTERNAL_URL" &&
      !isAllowedExternalVideoUrl(heroVideoUrl)
    ) {
      toast.error("URL de vídeo: usa HTTPS o http://127.0.0.1 / localhost en desarrollo.");
      return;
    }
    const payload = buildPayload();
    startTransition(async () => {
      const res = await saveHeroAppearanceAction(payload);
      if (res.ok) toast.success("Banner guardado");
      else toast.error(res.error);
    });
  }

  async function uploadToGallery(f: File | null, label: string) {
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    const res = await uploadGalleryAssetAction(fd);
    if (res.ok) {
      toast.success(`${label}: archivo en la galería`);
      return res.url;
    }
    toast.error(res.error);
    return null;
  }

  async function onUploadHeroImage(f: File | null) {
    const url = await uploadToGallery(f, "Imagen del hero");
    if (url) setHeroImageUrl(url);
  }

  async function onUploadVideo(f: File | null) {
    const url = await uploadToGallery(f, "Vídeo");
    if (url) {
      setHeroVideoUrl(url);
      setVideoSource("UPLOAD");
    }
  }

  async function onAddCarousel(f: File | null) {
    const url = await uploadToGallery(f, "Carrusel");
    if (url) setCarouselSlides((prev) => [...prev, { url, alt: "" }]);
  }

  return (
    <form onSubmit={onSave} className="max-w-xl space-y-8">
      <GalleryPickerDialog
        open={pickHeroImageOpen}
        onOpenChange={setPickHeroImageOpen}
        kindFilter="IMAGE"
        title="Elegir imagen del hero"
        onSelect={(url) => setHeroImageUrl(url)}
      />
      <GalleryPickerDialog
        open={pickVideoOpen}
        onOpenChange={setPickVideoOpen}
        kindFilter="VIDEO"
        title="Elegir vídeo de fondo"
        onSelect={(url) => {
          setHeroVideoUrl(url);
          setVideoSource("UPLOAD");
        }}
      />
      <GalleryPickerDialog
        open={pickCarouselOpen}
        onOpenChange={setPickCarouselOpen}
        kindFilter="IMAGE"
        title="Añadir imagen al carrusel"
        onSelect={(url) => setCarouselSlides((prev) => [...prev, { url, alt: "" }])}
      />

      <div className="space-y-3">
        <Label className="text-base">Modo del banner</Label>
        <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as HeroMode)}
          className="grid gap-3"
        >
          {MODES.map((m) => (
            <div
              key={m.value}
              className="flex items-start gap-3 rounded-lg border border-border/80 p-4 has-[[data-state=checked]]:border-primary/60"
            >
              <RadioGroupItem value={m.value} id={m.value} className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor={m.value} className="cursor-pointer font-medium leading-none">
                  {m.label}
                </Label>
                <p className="text-sm text-muted-foreground">{m.hint}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {mode === "IMAGE_CUSTOM" ? (
        <div className="space-y-4 rounded-lg border border-border/80 p-4">
          <Label>Imagen del hero</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickHeroImageOpen(true)}
            >
              De la galería
            </Button>
            <span className="self-center text-xs text-muted-foreground">o</span>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: wraps shadcn Input (file) */}
            <label className="cursor-pointer">
              <span className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent">
                Subir nuevo (se guarda en la galería)
              </span>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => void onUploadHeroImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          {heroImageUrl ? (
            <p className="break-all text-xs text-muted-foreground">
              Actual: <code>{heroImageUrl}</code>
            </p>
          ) : (
            <p className="text-sm text-amber-600 dark:text-amber-500">
              Elige o sube una imagen antes de guardar.
            </p>
          )}
        </div>
      ) : null}

      {mode === "VIDEO" ? (
        <div className="space-y-4 rounded-lg border border-border/80 p-4">
          <Label>Origen del vídeo</Label>
          <RadioGroup
            value={videoSource}
            onValueChange={(v) => setVideoSource(v as "UPLOAD" | "EXTERNAL_URL")}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="UPLOAD" id="vs-upload" />
              <Label htmlFor="vs-upload">Archivo</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="EXTERNAL_URL" id="vs-url" />
              <Label htmlFor="vs-url">URL externa</Label>
            </div>
          </RadioGroup>
          {videoSource === "UPLOAD" ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPickVideoOpen(true)}
                >
                  De la galería
                </Button>
                <span className="self-center text-xs text-muted-foreground">o</span>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: wraps shadcn Input (file) */}
                <label className="cursor-pointer">
                  <span className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent">
                    Subir nuevo (se guarda en la galería)
                  </span>
                  <Input
                    type="file"
                    accept="video/mp4,video/webm"
                    className="sr-only"
                    onChange={(e) => void onUploadVideo(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL del vídeo (MP4 directo, HTTPS)</Label>
              <Input
                id="videoUrl"
                value={heroVideoUrl}
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                placeholder="https://…"
                type="url"
              />
            </div>
          )}
          {heroVideoUrl ? (
            <p className="break-all text-xs text-muted-foreground">
              Activo: <code>{heroVideoUrl}</code>
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === "CAROUSEL" ? (
        <div className="space-y-4 rounded-lg border border-border/80 p-4">
          <Label>Añadir imágenes al carrusel</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickCarouselOpen(true)}
            >
              De la galería
            </Button>
            <span className="self-center text-xs text-muted-foreground">o</span>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: wraps shadcn Input (file) */}
            <label className="cursor-pointer">
              <span className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent">
                Subir nuevo (se guarda en la galería)
              </span>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => void onAddCarousel(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <ul className="space-y-2">
            {carouselSlides.map((s) => (
              <li key={s.url} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                  {s.url}
                </span>
                <Input
                  className="max-w-xs flex-1"
                  placeholder="Texto alternativo (opcional)"
                  value={s.alt ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCarouselSlides((prev) =>
                      prev.map((p) => (p.url === s.url ? { ...p, alt: v || undefined } : p)),
                    );
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCarouselSlides((p) => p.filter((x) => x.url !== s.url))}
                >
                  Quitar
                </Button>
              </li>
            ))}
          </ul>
          {carouselSlides.length < 2 ? (
            <p className="text-sm text-amber-600 dark:text-amber-500">
              Se necesitan al menos dos imágenes.
            </p>
          ) : null}
        </div>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar banner"}
      </Button>
    </form>
  );
}

"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { GalleryPickerDialog } from "@/components/admin/gallery-picker-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadGalleryAssetAction } from "@/lib/actions/gallery";
import {
  createImperdibleDestinationAction,
  updateImperdibleDestinationAction,
} from "@/lib/actions/imperdibles";
import { buildGoogleMapsSearchUrl } from "@/lib/google-maps-embed";
import { toServedMediaUrl } from "@/lib/media-url";
import { SUCRE_NATURAL_HUBS } from "@/lib/sucre-natural-hubs";

export type ImperdibleAdminRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string;
  bodyMarkdown: string;
  mapLat: number | null;
  mapLng: number | null;
  mapZoom: number;
  published: boolean;
  showOnHome: boolean;
  sortOrder: number;
  municipality: string;
  region: string;
  locationLabel: string;
  ecosystems: string;
  approach: string;
  specialWhy: string;
  howToArrive: string;
  climate: string;
  recommendedTime: string;
  audience: string;
  mapNote: string;
  liveActivitiesText: string;
  responsibleTipsText: string;
  biodiversityChipLabelsText: string;
  hubIds: string[];
  queHacerCategoryIds: string[];
  galleryUrls: string[];
  sourceIds: string[];
};

const emptyForm = (): Omit<ImperdibleAdminRow, "id"> => ({
  slug: "",
  title: "",
  subtitle: "",
  cardImageUrl: "",
  bodyMarkdown: "",
  mapLat: null,
  mapLng: null,
  mapZoom: 14,
  published: true,
  showOnHome: false,
  sortOrder: 0,
  municipality: "",
  region: "",
  locationLabel: "",
  ecosystems: "",
  approach: "",
  specialWhy: "",
  howToArrive: "",
  climate: "",
  recommendedTime: "",
  audience: "",
  mapNote: "",
  liveActivitiesText: "",
  responsibleTipsText: "",
  biodiversityChipLabelsText: "",
  hubIds: [],
  queHacerCategoryIds: [],
  galleryUrls: [],
  sourceIds: [],
});

function formFromInitial(
  initial: ImperdibleAdminRow,
): Omit<ImperdibleAdminRow, "id"> & { id?: string } {
  return {
    id: initial.id,
    slug: initial.slug,
    title: initial.title,
    subtitle: initial.subtitle,
    cardImageUrl: initial.cardImageUrl,
    bodyMarkdown: initial.bodyMarkdown,
    mapLat: initial.mapLat,
    mapLng: initial.mapLng,
    mapZoom: initial.mapZoom,
    published: initial.published,
    showOnHome: initial.showOnHome,
    sortOrder: initial.sortOrder,
    municipality: initial.municipality,
    region: initial.region,
    locationLabel: initial.locationLabel,
    ecosystems: initial.ecosystems,
    approach: initial.approach,
    specialWhy: initial.specialWhy,
    howToArrive: initial.howToArrive,
    climate: initial.climate,
    recommendedTime: initial.recommendedTime,
    audience: initial.audience,
    mapNote: initial.mapNote,
    liveActivitiesText: initial.liveActivitiesText,
    responsibleTipsText: initial.responsibleTipsText,
    biodiversityChipLabelsText: initial.biodiversityChipLabelsText,
    hubIds: initial.hubIds,
    queHacerCategoryIds: initial.queHacerCategoryIds,
    galleryUrls: initial.galleryUrls,
    sourceIds: initial.sourceIds,
  };
}

function DestinationFormInner({
  mode,
  initial,
  onOpenChange,
  queHacerCategories,
}: {
  mode: "create" | "edit";
  initial: ImperdibleAdminRow | null;
  onOpenChange: (v: boolean) => void;
  queHacerCategories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"card" | "gallery">("card");
  const [previewMd, setPreviewMd] = useState(false);
  const [form, setForm] = useState<Omit<ImperdibleAdminRow, "id"> & { id?: string }>(() =>
    mode === "edit" && initial ? formFromInitial(initial) : emptyForm(),
  );

  const mapsHelperUrl =
    form.mapLat != null && form.mapLng != null
      ? buildGoogleMapsSearchUrl(form.mapLat, form.mapLng)
      : "https://www.google.com/maps";
  const previewSrc = toServedMediaUrl(form.cardImageUrl);

  async function onUploadCard(f: File | null) {
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    startTransition(async () => {
      const res = await uploadGalleryAssetAction(fd);
      if (res.ok && res.kind === "IMAGE") {
        setForm((s) => ({ ...s, cardImageUrl: res.url }));
        toast.success("Imagen subida a la galería");
        router.refresh();
      } else if (res.ok) toast.error("Usa una imagen (JPEG, PNG o WebP), no vídeo.");
      else toast.error(res.error);
    });
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        slug: form.slug || undefined,
        cardImageUrl: form.cardImageUrl || null,
        bodyMarkdown: form.bodyMarkdown,
        mapLat: form.mapLat,
        mapLng: form.mapLng,
        mapZoom: form.mapZoom,
        published: form.published,
        showOnHome: form.showOnHome,
        sortOrder: form.sortOrder,
        municipality: form.municipality,
        region: form.region,
        locationLabel: form.locationLabel,
        ecosystems: form.ecosystems,
        approach: form.approach,
        specialWhy: form.specialWhy,
        howToArrive: form.howToArrive,
        climate: form.climate,
        recommendedTime: form.recommendedTime,
        audience: form.audience,
        mapNote: form.mapNote,
        liveActivities: form.liveActivitiesText
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean)
          .map((title) => ({ title })),
        responsibleTips: form.responsibleTipsText
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean),
        biodiversityChipLabels: form.biodiversityChipLabelsText
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean),
        hubIds: form.hubIds,
        queHacerCategoryIds: form.queHacerCategoryIds,
        galleryUrls: form.galleryUrls,
        sourceIds: form.sourceIds,
      };
      if (mode === "create") {
        const res = await createImperdibleDestinationAction(payload);
        if (res.ok) {
          toast.success("Destino creado");
          onOpenChange(false);
          router.refresh();
        } else toast.error(res.error);
      } else if (initial) {
        const res = await updateImperdibleDestinationAction(initial.id, payload);
        if (res.ok) {
          toast.success("Guardado");
          onOpenChange(false);
          router.refresh();
        } else toast.error(res.error);
      }
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "Nuevo destino" : "Editar destino"}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug (URL)</Label>
          <Input
            placeholder="se genera desde el título si lo dejas vacío"
            value={form.slug}
            onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Input
            value={form.subtitle}
            onChange={(e) => setForm((s) => ({ ...s, subtitle: e.target.value }))}
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label>Imagen de la tarjeta</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => {
                setPickerTarget("card");
                setPickerOpen(true);
              }}
            >
              <ImageIcon className="mr-2 size-4" />
              Galería
            </Button>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={pending}
              className="max-w-[200px]"
              onChange={(e) => void onUploadCard(e.target.files?.[0] ?? null)}
            />
          </div>
          {form.cardImageUrl ? (
            <div className="relative mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-md border">
              <Image
                src={previewSrc}
                alt=""
                fill
                className="object-cover"
                sizes="320px"
                unoptimized
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Elige o sube una imagen.</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label>Cuerpo (Markdown)</Label>
            <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewMd((v) => !v)}>
              {previewMd ? "Editar" : "Vista previa"}
            </Button>
          </div>
          {previewMd ? (
            <div className="prose prose-sm dark:prose-invert min-h-[120px] max-w-none rounded-md border bg-muted/40 p-3 text-sm">
              <ReactMarkdown>{form.bodyMarkdown || "—"}</ReactMarkdown>
            </div>
          ) : (
            <Textarea
              rows={8}
              value={form.bodyMarkdown}
              onChange={(e) => setForm((s) => ({ ...s, bodyMarkdown: e.target.value }))}
              disabled={pending}
              className="font-mono text-sm"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Latitud</Label>
            <Input
              type="number"
              step="any"
              value={form.mapLat ?? ""}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  mapLat: e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label>Longitud</Label>
            <Input
              type="number"
              step="any"
              value={form.mapLng ?? ""}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  mapLng: e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              disabled={pending}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Zoom del mapa (detalle)</Label>
          <Input
            type="number"
            min={1}
            max={21}
            value={form.mapZoom}
            onChange={(e) => setForm((s) => ({ ...s, mapZoom: Number(e.target.value) }))}
            disabled={pending}
          />
        </div>
        <a
          href={mapsHelperUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-primary underline"
        >
          Abrir en Google Maps (referencia de coordenadas)
        </a>

        <div className="space-y-2">
          <Label>Orden (manual)</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
            disabled={pending}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="pub"
            checked={form.published}
            onCheckedChange={(c) => setForm((s) => ({ ...s, published: c === true }))}
            disabled={pending}
          />
          <Label htmlFor="pub" className="cursor-pointer font-normal">
            Publicado
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="home"
            checked={form.showOnHome}
            onCheckedChange={(c) => setForm((s) => ({ ...s, showOnHome: c === true }))}
            disabled={pending}
          />
          <Label htmlFor="home" className="cursor-pointer font-normal">
            Destacar en la home (máx. 20)
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Hubs Sucre Natural</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {SUCRE_NATURAL_HUBS.map((hub) => (
              <div key={hub.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  id={`hub-${hub.id}`}
                  checked={form.hubIds.includes(hub.id)}
                  onCheckedChange={(c) =>
                    setForm((s) => ({
                      ...s,
                      hubIds:
                        c === true ? [...s.hubIds, hub.id] : s.hubIds.filter((id) => id !== hub.id),
                    }))
                  }
                  disabled={pending}
                />
                <Label htmlFor={`hub-${hub.id}`} className="cursor-pointer font-normal">
                  {hub.iconLabel}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categorías Qué hacer</Label>
          {queHacerCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Crea categorías en Personalizar → Qué hacer.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {queHacerCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    id={`qh-dest-cat-${cat.id}`}
                    checked={form.queHacerCategoryIds.includes(cat.id)}
                    onCheckedChange={(c) =>
                      setForm((s) => ({
                        ...s,
                        queHacerCategoryIds:
                          c === true
                            ? [...s.queHacerCategoryIds, cat.id]
                            : s.queHacerCategoryIds.filter((id) => id !== cat.id),
                      }))
                    }
                    disabled={pending}
                  />
                  <Label htmlFor={`qh-dest-cat-${cat.id}`} className="cursor-pointer font-normal">
                    {cat.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Municipio</Label>
            <Input
              value={form.municipality}
              onChange={(e) => setForm((s) => ({ ...s, municipality: e.target.value }))}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label>Región</Label>
            <Input
              value={form.region}
              onChange={(e) => setForm((s) => ({ ...s, region: e.target.value }))}
              disabled={pending}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Ubicación (etiqueta)</Label>
          <Input
            value={form.locationLabel}
            onChange={(e) => setForm((s) => ({ ...s, locationLabel: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Ecosistemas</Label>
          <Input
            value={form.ecosystems}
            onChange={(e) => setForm((s) => ({ ...s, ecosystems: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Enfoque</Label>
          <Input
            value={form.approach}
            onChange={(e) => setForm((s) => ({ ...s, approach: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Qué lo hace especial</Label>
          <Textarea
            rows={4}
            value={form.specialWhy}
            onChange={(e) => setForm((s) => ({ ...s, specialWhy: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Cómo llegar</Label>
          <Textarea
            rows={3}
            value={form.howToArrive}
            onChange={(e) => setForm((s) => ({ ...s, howToArrive: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Clima</Label>
            <Input
              value={form.climate}
              onChange={(e) => setForm((s) => ({ ...s, climate: e.target.value }))}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label>Tiempo recomendado</Label>
            <Input
              value={form.recommendedTime}
              onChange={(e) => setForm((s) => ({ ...s, recommendedTime: e.target.value }))}
              disabled={pending}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Para quién</Label>
          <Input
            value={form.audience}
            onChange={(e) => setForm((s) => ({ ...s, audience: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Nota de mapa</Label>
          <Input
            value={form.mapNote}
            onChange={(e) => setForm((s) => ({ ...s, mapNote: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Vive el destino (una actividad por línea)</Label>
          <Textarea
            rows={4}
            value={form.liveActivitiesText}
            onChange={(e) => setForm((s) => ({ ...s, liveActivitiesText: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Turismo responsable (una pauta por línea)</Label>
          <Textarea
            rows={4}
            value={form.responsibleTipsText}
            onChange={(e) => setForm((s) => ({ ...s, responsibleTipsText: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Chips de biodiversidad (uno por línea)</Label>
          <Textarea
            rows={3}
            value={form.biodiversityChipLabelsText}
            onChange={(e) => setForm((s) => ({ ...s, biodiversityChipLabelsText: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label>Galería de la ficha</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => {
              setPickerTarget("gallery");
              setPickerOpen(true);
            }}
          >
            Añadir imagen de galería
          </Button>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {form.galleryUrls.map((url) => (
              <li key={url} className="flex items-center justify-between gap-2">
                <span className="truncate">{url}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setForm((s) => ({ ...s, galleryUrls: s.galleryUrls.filter((u) => u !== url) }))
                  }
                >
                  Quitar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={pending}
        >
          Cancelar
        </Button>
        <Button type="button" onClick={() => submit()} disabled={pending || !form.title.trim()}>
          Guardar
        </Button>
      </DialogFooter>

      <GalleryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="IMAGE"
        title={
          pickerTarget === "card" ? "Elegir imagen de la tarjeta" : "Añadir imagen a la galería"
        }
        onSelect={(url) => {
          if (pickerTarget === "gallery") {
            setForm((s) => ({
              ...s,
              galleryUrls: s.galleryUrls.includes(url) ? s.galleryUrls : [...s.galleryUrls, url],
            }));
          } else {
            setForm((s) => ({ ...s, cardImageUrl: url }));
          }
        }}
      />
    </>
  );
}

export function ImperdiblesDestinationDialog({
  open,
  onOpenChange,
  mode,
  initial,
  mountKey,
  queHacerCategories = [],
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial: ImperdibleAdminRow | null;
  mountKey: number;
  queHacerCategories?: { id: string; name: string }[];
}) {
  const formKey = `${mode}-${initial?.id ?? "new"}-${mountKey}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        {open ? (
          <DestinationFormInner
            key={formKey}
            mode={mode}
            initial={initial}
            onOpenChange={onOpenChange}
            queHacerCategories={queHacerCategories}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

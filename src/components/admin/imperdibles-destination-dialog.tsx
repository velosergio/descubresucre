"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { ImageIcon } from "lucide-react";
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
import { GalleryPickerDialog } from "@/components/admin/gallery-picker-dialog";
import {
  createImperdibleDestinationAction,
  updateImperdibleDestinationAction,
} from "@/lib/actions/imperdibles";
import { uploadGalleryAssetAction } from "@/lib/actions/gallery";

export type ImperdibleAdminRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cardImageUrl: string;
  bodyMarkdown: string;
  mapLat: number;
  mapLng: number;
  mapZoom: number;
  published: boolean;
  sortOrder: number;
};

const emptyForm = (): Omit<ImperdibleAdminRow, "id"> => ({
  slug: "",
  title: "",
  subtitle: "",
  cardImageUrl: "",
  bodyMarkdown: "",
  mapLat: 9.3,
  mapLng: -75.4,
  mapZoom: 14,
  published: true,
  sortOrder: 0,
});

function formFromInitial(initial: ImperdibleAdminRow): Omit<ImperdibleAdminRow, "id"> & { id?: string } {
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
    sortOrder: initial.sortOrder,
  };
}

function DestinationFormInner({
  mode,
  initial,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initial: ImperdibleAdminRow | null;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewMd, setPreviewMd] = useState(false);
  const [form, setForm] = useState<Omit<ImperdibleAdminRow, "id"> & { id?: string }>(() =>
    mode === "edit" && initial ? formFromInitial(initial) : emptyForm(),
  );

  const mapsHelperUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${form.mapLat},${form.mapLng}`)}`;

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
        cardImageUrl: form.cardImageUrl,
        bodyMarkdown: form.bodyMarkdown,
        mapLat: form.mapLat,
        mapLng: form.mapLng,
        mapZoom: form.mapZoom,
        published: form.published,
        sortOrder: form.sortOrder,
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
            <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => setPickerOpen(true)}>
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
              <Image src={form.cardImageUrl} alt="" fill className="object-cover" sizes="320px" />
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
              value={form.mapLat}
              onChange={(e) => setForm((s) => ({ ...s, mapLat: Number(e.target.value) }))}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label>Longitud</Label>
            <Input
              type="number"
              step="any"
              value={form.mapLng}
              onChange={(e) => setForm((s) => ({ ...s, mapLng: Number(e.target.value) }))}
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
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
          Cancelar
        </Button>
        <Button type="button" onClick={() => submit()} disabled={pending || !form.title.trim() || !form.cardImageUrl}>
          Guardar
        </Button>
      </DialogFooter>

      <GalleryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="IMAGE"
        title="Elegir imagen de la galería"
        onSelect={(url) => setForm((s) => ({ ...s, cardImageUrl: url }))}
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
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial: ImperdibleAdminRow | null;
  mountKey: number;
}) {
  const formKey = `${mode}-${initial?.id ?? "new"}-${mountKey}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        {open ? (
          <DestinationFormInner key={formKey} mode={mode} initial={initial} onOpenChange={onOpenChange} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

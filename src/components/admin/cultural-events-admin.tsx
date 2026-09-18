"use client";

import { ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { GalleryPickerDialog } from "@/components/admin/gallery-picker-dialog";
import { TableRowActions } from "@/components/admin/table-row-actions";
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
import {
  createCulturalEventAction,
  deleteCulturalEventAction,
  updateCulturalEventAction,
} from "@/lib/actions/cultural-events";
import { uploadGalleryAssetAction } from "@/lib/actions/gallery";
import type { CulturalEventAdminRow } from "@/lib/get-cultural-events-home";
import { toServedMediaUrl } from "@/lib/media-url";

type EventFormState = {
  id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  imageUrl: string;
  mapLat: number | null;
  mapLng: number | null;
  published: boolean;
};

function splitIsoUtc(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const [date, rest] = iso.split("T");
  const time = rest ? rest.slice(0, 5) : "";
  return { date: date ?? "", time };
}

function toIsoUtc(date: string, time: string): string {
  return `${date}T${time || "00:00"}:00.000Z`;
}

function emptyForm(): EventFormState {
  return {
    title: "",
    description: "",
    category: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    allDay: true,
    imageUrl: "",
    mapLat: null,
    mapLng: null,
    published: true,
  };
}

function formFromRow(row: CulturalEventAdminRow): EventFormState {
  const start = splitIsoUtc(row.startsAt);
  const end = splitIsoUtc(row.endsAt);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    allDay: row.allDay,
    imageUrl: row.imageUrl ?? "",
    mapLat: row.mapLat,
    mapLng: row.mapLng,
    published: row.published,
  };
}

function EventDialogForm({
  mode,
  initial,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initial: CulturalEventAdminRow | null;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [form, setForm] = useState<EventFormState>(() =>
    mode === "edit" && initial ? formFromRow(initial) : emptyForm(),
  );

  async function onUploadImage(file: File | null) {
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const res = await uploadGalleryAssetAction(fd);
      if (res.ok && res.kind === "IMAGE") {
        setForm((s) => ({ ...s, imageUrl: res.url }));
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
        description: form.description,
        category: form.category,
        location: form.location,
        startsAt: form.startDate
          ? toIsoUtc(form.startDate, form.allDay ? "00:00" : form.startTime)
          : undefined,
        endsAt: form.endDate
          ? toIsoUtc(form.endDate, form.allDay ? "00:00" : form.endTime || form.startTime)
          : null,
        allDay: form.allDay,
        imageUrl: form.imageUrl || null,
        mapLat: form.mapLat,
        mapLng: form.mapLng,
        published: form.published,
      };
      if (mode === "create") {
        const res = await createCulturalEventAction(payload);
        if (res.ok) {
          toast.success("Evento creado");
          onOpenChange(false);
          router.refresh();
        } else toast.error(res.error);
      } else if (initial) {
        const res = await updateCulturalEventAction(initial.id, payload);
        if (res.ok) {
          toast.success("Guardado");
          onOpenChange(false);
          router.refresh();
        } else toast.error(res.error);
      }
    });
  }

  const previewSrc = form.imageUrl ? toServedMediaUrl(form.imageUrl) : null;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "Nuevo evento" : "Editar evento"}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="ev-title">Título</Label>
          <Input
            id="ev-title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev-location">Lugar</Label>
          <Input
            id="ev-location"
            value={form.location}
            onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev-category">Categoría</Label>
          <Input
            id="ev-category"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            disabled={pending}
            placeholder="Música, Arte, Teatro…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev-description">Descripción</Label>
          <Textarea
            id="ev-description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            disabled={pending}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="allday"
            checked={form.allDay}
            onCheckedChange={(c) => setForm((s) => ({ ...s, allDay: c === true }))}
            disabled={pending}
          />
          <Label htmlFor="allday" className="cursor-pointer font-normal">
            Todo el día (sin hora específica)
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="ev-start-date">Fecha de inicio</Label>
            <Input
              id="ev-start-date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))}
              disabled={pending}
            />
          </div>
          {form.allDay ? null : (
            <div className="space-y-2">
              <Label htmlFor="ev-start-time">Hora de inicio</Label>
              <Input
                id="ev-start-time"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((s) => ({ ...s, startTime: e.target.value }))}
                disabled={pending}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="ev-end-date">Fecha de fin (opcional, eventos de varios días)</Label>
            <Input
              id="ev-end-date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((s) => ({ ...s, endDate: e.target.value }))}
              disabled={pending}
            />
          </div>
          {form.allDay || !form.endDate ? null : (
            <div className="space-y-2">
              <Label htmlFor="ev-end-time">Hora de fin</Label>
              <Input
                id="ev-end-time"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((s) => ({ ...s, endTime: e.target.value }))}
                disabled={pending}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Imagen (opcional)</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => setPickerOpen(true)}
            >
              <ImageIcon className="mr-2 size-4" />
              Galería
            </Button>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={pending}
              className="max-w-[200px]"
              onChange={(e) => void onUploadImage(e.target.files?.[0] ?? null)}
            />
          </div>
          {previewSrc ? (
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
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="ev-map-lat">Latitud (opcional)</Label>
            <Input
              id="ev-map-lat"
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
            <Label htmlFor="ev-map-lng">Longitud (opcional)</Label>
            <Input
              id="ev-map-lng"
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

        <div className="flex items-center gap-2">
          <Checkbox
            id="published"
            checked={form.published}
            onCheckedChange={(c) => setForm((s) => ({ ...s, published: c === true }))}
            disabled={pending}
          />
          <Label htmlFor="published" className="cursor-pointer font-normal">
            Publicado
          </Label>
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
        <Button
          type="button"
          onClick={() => submit()}
          disabled={
            pending ||
            !form.title.trim() ||
            !form.description.trim() ||
            !form.category.trim() ||
            !form.location.trim() ||
            !form.startDate
          }
        >
          Guardar
        </Button>
      </DialogFooter>

      <GalleryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="IMAGE"
        title="Elegir imagen del evento"
        onSelect={(url) => setForm((s) => ({ ...s, imageUrl: url }))}
      />
    </>
  );
}

export function CulturalEventsAdmin({ initialEvents }: { initialEvents: CulturalEventAdminRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<CulturalEventAdminRow | null>(null);
  const [dialogMountKey, setDialogMountKey] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setDialogMode("create");
    setEditing(null);
    setDialogMountKey((k) => k + 1);
    setDialogOpen(true);
  }

  function openEdit(row: CulturalEventAdminRow) {
    setDialogMode("edit");
    setEditing(row);
    setDialogMountKey((k) => k + 1);
    setDialogOpen(true);
  }

  function confirmDelete() {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    startTransition(async () => {
      const res = await deleteCulturalEventAction(id);
      if (res.ok) {
        toast.success("Eliminado");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Eventos</h2>
        <Button type="button" onClick={() => openCreate()}>
          <Plus className="mr-2 size-4" />
          Nuevo
        </Button>
      </div>

      <div className="rounded-lg border border-border/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-3 font-medium">Título</th>
              <th className="p-3 font-medium">Fecha</th>
              <th className="p-3 font-medium">Lugar</th>
              <th className="p-3 font-medium">Publicado</th>
              <th className="p-3 w-24" />
            </tr>
          </thead>
          <tbody>
            {initialEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-muted-foreground">
                  No hay eventos. Crea uno con «Nuevo».
                </td>
              </tr>
            ) : (
              initialEvents.map((ev) => (
                <tr key={ev.id} className="border-b border-border/60 last:border-0">
                  <td className="p-3">{ev.title}</td>
                  <td className="p-3">{splitIsoUtc(ev.startsAt).date}</td>
                  <td className="p-3">{ev.location}</td>
                  <td className="p-3">{ev.published ? "Sí" : "No"}</td>
                  <td className="p-3">
                    <TableRowActions
                      onEdit={() => openEdit(ev)}
                      onDelete={() => setDeleteId(ev.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {dialogOpen ? (
            <EventDialogForm
              key={`${dialogMode}-${editing?.id ?? "new"}-${dialogMountKey}`}
              mode={dialogMode}
              initial={editing}
              onOpenChange={setDialogOpen}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="¿Eliminar este evento?"
        description="Se quitará de la home y ya no se podrá agregar al calendario."
        onConfirm={confirmDelete}
      />
    </>
  );
}

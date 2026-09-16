"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GalleryPickerDialog } from "@/components/admin/gallery-picker-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createQueHacerActivityAction,
  createQueHacerCategoryAction,
  deleteQueHacerActivityAction,
  deleteQueHacerCategoryAction,
  updateQueHacerActivityAction,
  updateQueHacerCategoryAction,
} from "@/lib/actions/que-hacer";
import { toServedMediaUrl } from "@/lib/media-url";
import { QUE_HACER_ICONS } from "@/lib/que-hacer-icons";
import { QUE_HACER_MAX_PHOTOS } from "@/lib/que-hacer-photos";

export type QueHacerActivityAdminRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  published: boolean;
  sortOrder: number;
  photoUrls: string[];
  photoAlts: (string | null)[];
  coverUrl: string;
  categoryIds: string[];
  destinationIds: string[];
};

export type QueHacerCategoryAdminRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

const emptyActivity: Omit<QueHacerActivityAdminRow, "id"> = {
  slug: "",
  title: "",
  description: "",
  iconKey: "compass",
  published: false,
  sortOrder: 0,
  photoUrls: [],
  photoAlts: [],
  coverUrl: "",
  categoryIds: [],
  destinationIds: [],
};

const emptyCategory: Omit<QueHacerCategoryAdminRow, "id"> = {
  slug: "",
  name: "",
  description: "",
  sortOrder: 0,
};

export function QueHacerAdmin({
  initialActivities,
  initialCategories,
  destinations,
}: {
  initialActivities: QueHacerActivityAdminRow[];
  initialCategories: QueHacerCategoryAdminRow[];
  destinations: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<"actividades" | "categorias">("actividades");
  const [form, setForm] = useState(emptyActivity);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState(emptyCategory);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  function saveActivity() {
    startTransition(async () => {
      const payload = {
        ...form,
        slug: form.slug || undefined,
        coverUrl: form.coverUrl || undefined,
      };
      const res = editingId
        ? await updateQueHacerActivityAction(editingId, payload)
        : await createQueHacerActivityAction(payload);
      if (res.ok) {
        toast.success(editingId ? "Actividad actualizada" : "Actividad creada");
        setEditingId(null);
        setForm(emptyActivity);
        router.refresh();
      } else toast.error(res.error);
    });
  }

  function saveCategory() {
    startTransition(async () => {
      const payload = {
        name: catForm.name,
        slug: catForm.slug || undefined,
        description: catForm.description || null,
        sortOrder: catForm.sortOrder,
      };
      const res = editingCatId
        ? await updateQueHacerCategoryAction(editingCatId, payload)
        : await createQueHacerCategoryAction(payload);
      if (res.ok) {
        toast.success(editingCatId ? "Categoría actualizada" : "Categoría creada");
        setEditingCatId(null);
        setCatForm(emptyCategory);
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={tab === "actividades" ? "default" : "outline"}
          onClick={() => setTab("actividades")}
        >
          Actividades
        </Button>
        <Button
          type="button"
          variant={tab === "categorias" ? "default" : "outline"}
          onClick={() => setTab("categorias")}
        >
          Categorías
        </Button>
      </div>

      {tab === "actividades" ? (
        <>
          <div className="space-y-3 rounded-xl border p-4">
            <h2 className="font-display text-lg font-semibold">
              {editingId ? "Editar actividad" : "Nueva actividad"}
            </h2>
            <Input
              placeholder="Título"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            />
            <Input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
            />
            <Textarea
              placeholder="Descripción"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
            <div className="space-y-1">
              <Label htmlFor="qh-icon">Pictograma</Label>
              <select
                id="qh-icon"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={form.iconKey}
                onChange={(e) => setForm((s) => ({ ...s, iconKey: e.target.value }))}
              >
                {QUE_HACER_ICONS.map((ic) => (
                  <option key={ic.key} value={ic.key}>
                    {ic.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              type="number"
              placeholder="Orden"
              value={form.sortOrder}
              onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
            />
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                id="qh-published"
                checked={form.published}
                onCheckedChange={(c) => setForm((s) => ({ ...s, published: c === true }))}
              />
              <Label htmlFor="qh-published" className="cursor-pointer font-normal">
                Publicado
              </Label>
            </div>
            {form.published && form.photoUrls.length === 0 ? (
              <p className="text-sm text-destructive">
                Para publicar necesitas al menos una foto de la galería.
              </p>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-medium">Fotos (máx. {QUE_HACER_MAX_PHOTOS})</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={form.photoUrls.length >= QUE_HACER_MAX_PHOTOS}
                onClick={() => setPickerOpen(true)}
              >
                Añadir de la galería
              </Button>
              <ul className="space-y-2">
                {form.photoUrls.map((url, i) => (
                  <li key={url} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="qh-cover"
                      checked={form.coverUrl === url}
                      onChange={() => setForm((s) => ({ ...s, coverUrl: url }))}
                      aria-label={`Portada: foto ${i + 1}`}
                    />
                    <span className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={toServedMediaUrl(url)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">{url}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setForm((s) => {
                          const photoUrls = s.photoUrls.filter((u) => u !== url);
                          const photoAlts = s.photoAlts.filter((_, idx) => idx !== i);
                          return {
                            ...s,
                            photoUrls,
                            photoAlts,
                            coverUrl: s.coverUrl === url ? (photoUrls[0] ?? "") : s.coverUrl,
                          };
                        })
                      }
                    >
                      Quitar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Categorías</p>
              {initialCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no hay categorías.</p>
              ) : (
                initialCategories.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id={`qh-cat-${c.id}`}
                      checked={form.categoryIds.includes(c.id)}
                      onCheckedChange={(chk) =>
                        setForm((s) => ({
                          ...s,
                          categoryIds:
                            chk === true
                              ? [...s.categoryIds, c.id]
                              : s.categoryIds.filter((id) => id !== c.id),
                        }))
                      }
                    />
                    <Label htmlFor={`qh-cat-${c.id}`} className="cursor-pointer font-normal">
                      {c.name}
                    </Label>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Destinos publicados</p>
              {destinations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay destinos publicados.</p>
              ) : (
                destinations.map((d) => (
                  <div key={d.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id={`qh-dest-${d.id}`}
                      checked={form.destinationIds.includes(d.id)}
                      onCheckedChange={(chk) =>
                        setForm((s) => ({
                          ...s,
                          destinationIds:
                            chk === true
                              ? [...s.destinationIds, d.id]
                              : s.destinationIds.filter((id) => id !== d.id),
                        }))
                      }
                    />
                    <Label htmlFor={`qh-dest-${d.id}`} className="cursor-pointer font-normal">
                      {d.title}
                    </Label>
                  </div>
                ))
              )}
            </div>

            <Button type="button" onClick={saveActivity} disabled={pending}>
              Guardar
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyActivity);
                }}
              >
                Cancelar
              </Button>
            ) : null}
          </div>

          <ul className="space-y-2">
            {initialActivities.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>
                  {row.title}{" "}
                  <span className="text-muted-foreground">
                    /{row.slug}
                    {row.published ? "" : " · borrador"}
                  </span>
                </span>
                <span className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(row.id);
                      setForm({ ...row });
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      startTransition(async () => {
                        const res = await deleteQueHacerActivityAction(row.id);
                        if (res.ok) {
                          toast.success("Eliminada");
                          if (editingId === row.id) {
                            setEditingId(null);
                            setForm(emptyActivity);
                          }
                          router.refresh();
                        } else toast.error(res.error);
                      })
                    }
                  >
                    Borrar
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="space-y-3 rounded-xl border p-4">
            <h2 className="font-display text-lg font-semibold">
              {editingCatId ? "Editar categoría" : "Nueva categoría"}
            </h2>
            <Input
              placeholder="Nombre"
              value={catForm.name}
              onChange={(e) => setCatForm((s) => ({ ...s, name: e.target.value }))}
            />
            <Input
              placeholder="Slug"
              value={catForm.slug}
              onChange={(e) => setCatForm((s) => ({ ...s, slug: e.target.value }))}
            />
            <Textarea
              placeholder="Descripción (opcional)"
              value={catForm.description}
              onChange={(e) => setCatForm((s) => ({ ...s, description: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Orden"
              value={catForm.sortOrder}
              onChange={(e) => setCatForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
            />
            <Button type="button" onClick={saveCategory} disabled={pending}>
              Guardar categoría
            </Button>
            {editingCatId ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingCatId(null);
                  setCatForm(emptyCategory);
                }}
              >
                Cancelar
              </Button>
            ) : null}
          </div>
          <ul className="space-y-2">
            {initialCategories.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>
                  {row.name} <span className="text-muted-foreground">/{row.slug}</span>
                </span>
                <span className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCatId(row.id);
                      setCatForm({ ...row });
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      startTransition(async () => {
                        const res = await deleteQueHacerCategoryAction(row.id);
                        if (res.ok) {
                          toast.success("Eliminada");
                          router.refresh();
                        } else toast.error(res.error);
                      })
                    }
                  >
                    Borrar
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <GalleryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="IMAGE"
        title="Elegir foto de la galería"
        onSelect={(publicUrl) =>
          setForm((s) => {
            if (s.photoUrls.includes(publicUrl) || s.photoUrls.length >= QUE_HACER_MAX_PHOTOS) {
              return s;
            }
            return {
              ...s,
              photoUrls: [...s.photoUrls, publicUrl],
              photoAlts: [...s.photoAlts, null],
              coverUrl: s.coverUrl || publicUrl,
            };
          })
        }
      />
    </div>
  );
}

"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  type ImperdibleAdminRow,
  ImperdiblesDestinationDialog,
} from "@/components/admin/imperdibles-destination-dialog";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  deleteImperdibleDestinationAction,
  saveImperdiblesSectionAction,
} from "@/lib/actions/imperdibles";

export type ImperdiblesSettingsDTO = {
  displayMode: "GRID_THREE" | "CAROUSEL";
  itemOrder: "MANUAL" | "RANDOM";
  headingTitle: string | null;
  headingSubtitle: string | null;
  carouselIntervalMs: number;
};

export function ImperdiblesAdminClient({
  initialSettings,
  initialDestinations,
}: {
  initialSettings: ImperdiblesSettingsDTO;
  initialDestinations: ImperdibleAdminRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [section, setSection] = useState(initialSettings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<ImperdibleAdminRow | null>(null);
  const [dialogMountKey, setDialogMountKey] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setDialogMode("create");
    setEditing(null);
    setDialogMountKey((k) => k + 1);
    setDialogOpen(true);
  }

  function openEdit(row: ImperdibleAdminRow) {
    setDialogMode("edit");
    setEditing(row);
    setDialogMountKey((k) => k + 1);
    setDialogOpen(true);
  }

  function saveSection() {
    startTransition(async () => {
      const res = await saveImperdiblesSectionAction(section);
      if (res.ok) {
        toast.success("Ajustes de sección guardados");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    startTransition(async () => {
      const res = await deleteImperdibleDestinationAction(id);
      if (res.ok) {
        toast.success("Eliminado");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <>
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle>Presentación en la portada</CardTitle>
          <CardDescription>
            Modo de visualización y orden de los destinos publicados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Modo</Label>
            <RadioGroup
              value={section.displayMode}
              onValueChange={(v) =>
                setSection((s) => ({
                  ...s,
                  displayMode: v as ImperdiblesSettingsDTO["displayMode"],
                }))
              }
              className="flex flex-col gap-2"
              disabled={pending}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="GRID_THREE" id="dm-grid" />
                <Label htmlFor="dm-grid" className="cursor-pointer font-normal">
                  Tres destacados (rejilla)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="CAROUSEL" id="dm-car" />
                <Label htmlFor="dm-car" className="cursor-pointer font-normal">
                  Carrusel (autoplay y flechas)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Orden de los ítems</Label>
            <RadioGroup
              value={section.itemOrder}
              onValueChange={(v) =>
                setSection((s) => ({ ...s, itemOrder: v as ImperdiblesSettingsDTO["itemOrder"] }))
              }
              className="flex flex-col gap-2"
              disabled={pending}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="MANUAL" id="ord-man" />
                <Label htmlFor="ord-man" className="cursor-pointer font-normal">
                  Manual (campo orden en cada destino)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="RANDOM" id="ord-rnd" />
                <Label htmlFor="ord-rnd" className="cursor-pointer font-normal">
                  Aleatorio en cada carga de la portada
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="h-title">Título de la sección (opcional)</Label>
              <Input
                id="h-title"
                value={section.headingTitle ?? ""}
                onChange={(e) =>
                  setSection((s) => ({ ...s, headingTitle: e.target.value || null }))
                }
                disabled={pending}
                placeholder="Destinos Imperdibles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h-sub">Subtítulo (opcional)</Label>
              <Input
                id="h-sub"
                value={section.headingSubtitle ?? ""}
                onChange={(e) =>
                  setSection((s) => ({ ...s, headingSubtitle: e.target.value || null }))
                }
                disabled={pending}
              />
            </div>
          </div>

          {section.displayMode === "CAROUSEL" ? (
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="interval">Autoplay cada (ms)</Label>
              <Input
                id="interval"
                type="number"
                min={2000}
                max={60000}
                step={500}
                value={section.carouselIntervalMs}
                onChange={(e) =>
                  setSection((s) => ({ ...s, carouselIntervalMs: Number(e.target.value) }))
                }
                disabled={pending}
              />
            </div>
          ) : null}

          <Button type="button" onClick={() => saveSection()} disabled={pending}>
            Guardar ajustes de sección
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Destinos</h2>
        <Button type="button" onClick={() => openCreate()} disabled={pending}>
          <Plus className="mr-2 size-4" />
          Nuevo
        </Button>
      </div>

      <div className="rounded-lg border border-border/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-3 font-medium">Título</th>
              <th className="p-3 font-medium">Slug</th>
              <th className="p-3 font-medium">Publicado</th>
              <th className="p-3 font-medium w-28">Orden</th>
              <th className="p-3 w-24" />
            </tr>
          </thead>
          <tbody>
            {initialDestinations.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-muted-foreground">
                  No hay destinos. Crea uno con «Nuevo».
                </td>
              </tr>
            ) : (
              initialDestinations.map((d) => (
                <tr key={d.id} className="border-b border-border/60 last:border-0">
                  <td className="p-3">{d.title}</td>
                  <td className="p-3 font-mono text-xs">{d.slug}</td>
                  <td className="p-3">{d.published ? "Sí" : "No"}</td>
                  <td className="p-3">{d.sortOrder}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(d)}
                        aria-label="Editar"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(d.id)}
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ImperdiblesDestinationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initial={editing}
        mountKey={dialogMountKey}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este destino?</AlertDialogTitle>
            <AlertDialogDescription>
              Se quitará de la portada y la URL de detalle dejará de existir.
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

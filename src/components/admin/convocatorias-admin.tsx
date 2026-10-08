"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
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
  createConvocatoriaAction,
  deleteConvocatoriaAction,
  updateConvocatoriaAction,
} from "@/lib/actions/convocatorias";
import { isDeadlineOpen, startOfUtcDay } from "@/lib/convocatoria-deadline";
import type { ConvocatoriaAdminRow } from "@/lib/get-convocatorias-home";

type FormState = {
  id?: string;
  title: string;
  description: string;
  audience: string;
  type: string;
  deadline: string;
  externalUrl: string;
  published: boolean;
};

function emptyForm(): FormState {
  return {
    title: "",
    description: "",
    audience: "",
    type: "",
    deadline: "",
    externalUrl: "",
    published: true,
  };
}

function formFromRow(row: ConvocatoriaAdminRow): FormState {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    audience: row.audience,
    type: row.type,
    deadline: row.deadline.slice(0, 10),
    externalUrl: row.externalUrl,
    published: row.published,
  };
}

function statusLabel(row: ConvocatoriaAdminRow): string {
  if (!row.published) return "Borrador";
  if (!isDeadlineOpen(new Date(row.deadline))) return "Vencida";
  return "Abierta";
}

function ConvocatoriaDialogForm({
  mode,
  initial,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initial: ConvocatoriaAdminRow | null;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(() =>
    mode === "edit" && initial ? formFromRow(initial) : emptyForm(),
  );
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      const payload = {
        title: form.title,
        description: form.description,
        audience: form.audience,
        type: form.type,
        deadline: form.deadline
          ? startOfUtcDay(new Date(`${form.deadline}T00:00:00.000Z`)).toISOString()
          : undefined,
        externalUrl: form.externalUrl,
        published: form.published,
      };
      if (mode === "create") {
        const res = await createConvocatoriaAction(payload);
        if (res.ok) {
          toast.success("Convocatoria creada");
          onOpenChange(false);
          router.refresh();
        } else {
          setError(res.error);
          toast.error(res.error);
        }
      } else if (initial) {
        const res = await updateConvocatoriaAction(initial.id, payload);
        if (res.ok) {
          toast.success("Guardado");
          onOpenChange(false);
          router.refresh();
        } else {
          setError(res.error);
          toast.error(res.error);
        }
      }
    });
  }

  const canSave =
    form.title.trim() &&
    form.description.trim() &&
    form.audience.trim() &&
    form.type.trim() &&
    form.deadline &&
    form.externalUrl.trim();

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Nueva convocatoria" : "Editar convocatoria"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="conv-title">Título</Label>
          <Input
            id="conv-title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-description">Descripción</Label>
          <Textarea
            id="conv-description"
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            disabled={pending}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-audience">Audiencia</Label>
          <Input
            id="conv-audience"
            value={form.audience}
            onChange={(e) => setForm((s) => ({ ...s, audience: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-type">Tipo</Label>
          <Input
            id="conv-type"
            value={form.type}
            onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
            disabled={pending}
            placeholder="Arte, Turismo, Formación…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-deadline">Fecha límite</Label>
          <Input
            id="conv-deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm((s) => ({ ...s, deadline: e.target.value }))}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-url">Enlace externo</Label>
          <Input
            id="conv-url"
            type="url"
            value={form.externalUrl}
            onChange={(e) => setForm((s) => ({ ...s, externalUrl: e.target.value }))}
            disabled={pending}
            placeholder="https://"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="conv-published"
            checked={form.published}
            onCheckedChange={(c) => setForm((s) => ({ ...s, published: c === true }))}
            disabled={pending}
          />
          <Label htmlFor="conv-published" className="cursor-pointer font-normal">
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
        <Button type="button" onClick={() => submit()} disabled={pending || !canSave}>
          Guardar
        </Button>
      </DialogFooter>
    </>
  );
}

export function ConvocatoriasAdmin({ initialItems }: { initialItems: ConvocatoriaAdminRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<ConvocatoriaAdminRow | null>(null);
  const [dialogMountKey, setDialogMountKey] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setDialogMode("create");
    setEditing(null);
    setDialogMountKey((k) => k + 1);
    setDialogOpen(true);
  }

  function openEdit(row: ConvocatoriaAdminRow) {
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
      const res = await deleteConvocatoriaAction(id);
      if (res.ok) {
        toast.success("Eliminado");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Listado</h2>
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
              <th className="p-3 font-medium">Tipo</th>
              <th className="p-3 font-medium">Fecha límite</th>
              <th className="p-3 font-medium">Estado</th>
              <th className="w-24 p-3" />
            </tr>
          </thead>
          <tbody>
            {initialItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-muted-foreground">
                  No hay convocatorias. Crea una con «Nuevo».
                </td>
              </tr>
            ) : (
              initialItems.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-0">
                  <td className="p-3">{row.title}</td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3">{row.deadline.slice(0, 10)}</td>
                  <td className="p-3">{statusLabel(row)}</td>
                  <td className="p-3">
                    <TableRowActions
                      onEdit={() => openEdit(row)}
                      onDelete={() => setDeleteId(row.id)}
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
            <ConvocatoriaDialogForm
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
        title="¿Eliminar esta convocatoria?"
        description="Se quitará de la home y dejará de ser visible para los visitantes."
        onConfirm={confirmDelete}
      />
    </>
  );
}

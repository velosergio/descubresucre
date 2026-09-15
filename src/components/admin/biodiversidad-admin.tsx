"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createBiodiversityEntryAction,
  deleteBiodiversityEntryAction,
  updateBiodiversityEntryAction,
} from "@/lib/actions/sucre-natural";

export type BioAdminRow = {
  id: string;
  slug: string;
  kind: "FAUNA" | "FLORA" | "ECOSYSTEM";
  groupKey: string;
  commonName: string;
  scientificName: string;
  summary: string;
  whereFound: string;
  published: boolean;
  destinationIds: string[];
};

export function BiodiversidadAdmin({
  initialEntries,
  destinations,
}: {
  initialEntries: BioAdminRow[];
  destinations: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const empty: Omit<BioAdminRow, "id"> = {
    slug: "",
    kind: "FAUNA",
    groupKey: "mamiferos",
    commonName: "",
    scientificName: "",
    summary: "",
    whereFound: "",
    published: true,
    destinationIds: [],
  };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      const payload = {
        ...form,
        scientificName: form.scientificName || null,
        whereFound: form.whereFound || null,
      };
      const res = editingId
        ? await updateBiodiversityEntryAction(editingId, payload)
        : await createBiodiversityEntryAction(payload);
      if (res.ok) {
        toast.success(editingId ? "Especie actualizada" : "Especie creada");
        setEditingId(null);
        setForm(empty);
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-xl border p-4">
        <h2 className="font-display text-lg font-semibold">
          {editingId ? "Editar ficha" : "Nueva ficha"}
        </h2>
        <Input
          placeholder="Nombre común"
          value={form.commonName}
          onChange={(e) => setForm((s) => ({ ...s, commonName: e.target.value }))}
        />
        <Input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
        />
        <select
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={form.kind}
          onChange={(e) => setForm((s) => ({ ...s, kind: e.target.value as BioAdminRow["kind"] }))}
        >
          <option value="FAUNA">Fauna</option>
          <option value="FLORA">Flora</option>
          <option value="ECOSYSTEM">Ecosistema</option>
        </select>
        <Input
          placeholder="Grupo (mamiferos, aves…)"
          value={form.groupKey}
          onChange={(e) => setForm((s) => ({ ...s, groupKey: e.target.value }))}
        />
        <Input
          placeholder="Nombre científico (opcional)"
          value={form.scientificName}
          onChange={(e) => setForm((s) => ({ ...s, scientificName: e.target.value }))}
        />
        <Textarea
          placeholder="Por qué importa / hábitat"
          value={form.summary}
          onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
        />
        <Textarea
          placeholder="Dónde se encuentra"
          value={form.whereFound}
          onChange={(e) => setForm((s) => ({ ...s, whereFound: e.target.value }))}
        />
        <div className="flex items-center gap-2 text-sm">
          <Checkbox
            id="bio-published"
            checked={form.published}
            onCheckedChange={(c) => setForm((s) => ({ ...s, published: c === true }))}
          />
          <Label htmlFor="bio-published" className="cursor-pointer font-normal">
            Publicado
          </Label>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Destinos relacionados</p>
          {destinations.map((d) => (
            <div key={d.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                id={`bio-dest-${d.id}`}
                checked={form.destinationIds.includes(d.id)}
                onCheckedChange={(c) =>
                  setForm((s) => ({
                    ...s,
                    destinationIds:
                      c === true
                        ? [...s.destinationIds, d.id]
                        : s.destinationIds.filter((id) => id !== d.id),
                  }))
                }
              />
              <Label htmlFor={`bio-dest-${d.id}`} className="cursor-pointer font-normal">
                {d.title}
              </Label>
            </div>
          ))}
        </div>
        <Button type="button" onClick={save} disabled={pending}>
          Guardar
        </Button>
      </div>
      <ul className="space-y-2">
        {initialEntries.map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <span>
              {row.commonName} <span className="text-muted-foreground">/{row.slug}</span>
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
                    const res = await deleteBiodiversityEntryAction(row.id);
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
    </div>
  );
}

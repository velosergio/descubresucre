"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createNatureExperienceAction,
  deleteNatureExperienceAction,
  updateNatureExperienceAction,
} from "@/lib/actions/sucre-natural";

export type ExpAdminRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  whereText: string;
  whatYouDoText: string;
  specialWhy: string;
  recommendationsText: string;
  published: boolean;
  destinationIds: string[];
};

export function ExperienciasNaturalezaAdmin({
  initialRows,
  destinations,
}: {
  initialRows: ExpAdminRow[];
  destinations: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const empty: Omit<ExpAdminRow, "id"> = {
    slug: "",
    title: "",
    tagline: "",
    whereText: "",
    whatYouDoText: "",
    specialWhy: "",
    recommendationsText: "",
    published: true,
    destinationIds: [],
  };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const selectedDestinationIds = useMemo(() => new Set(form.destinationIds), [form.destinationIds]);

  function payload() {
    return {
      slug: form.slug,
      title: form.title,
      tagline: form.tagline || null,
      whereText: form.whereText || null,
      whatYouDo: form.whatYouDoText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      specialWhy: form.specialWhy || null,
      recommendations: form.recommendationsText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      published: form.published,
      destinationIds: form.destinationIds,
    };
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-xl border p-4">
        <h2 className="font-display text-lg font-semibold">
          {editingId ? "Editar experiencia" : "Nueva experiencia"}
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
        <Input
          placeholder="Lema"
          value={form.tagline}
          onChange={(e) => setForm((s) => ({ ...s, tagline: e.target.value }))}
        />
        <Textarea
          placeholder="Dónde vivirla"
          value={form.whereText}
          onChange={(e) => setForm((s) => ({ ...s, whereText: e.target.value }))}
        />
        <Textarea
          placeholder="Qué se hace (una por línea)"
          value={form.whatYouDoText}
          onChange={(e) => setForm((s) => ({ ...s, whatYouDoText: e.target.value }))}
        />
        <Textarea
          placeholder="Por qué es especial"
          value={form.specialWhy}
          onChange={(e) => setForm((s) => ({ ...s, specialWhy: e.target.value }))}
        />
        <Textarea
          placeholder="Recomendaciones (una por línea)"
          value={form.recommendationsText}
          onChange={(e) => setForm((s) => ({ ...s, recommendationsText: e.target.value }))}
        />
        <div className="flex items-center gap-2 text-sm">
          <Checkbox
            id="exp-published"
            checked={form.published}
            onCheckedChange={(c) => setForm((s) => ({ ...s, published: c === true }))}
          />
          <Label htmlFor="exp-published" className="cursor-pointer font-normal">
            Publicado
          </Label>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Destinos relacionados</p>
          {destinations.map((d) => (
            <div key={d.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                id={`exp-dest-${d.id}`}
                checked={selectedDestinationIds.has(d.id)}
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
              <Label htmlFor={`exp-dest-${d.id}`} className="cursor-pointer font-normal">
                {d.title}
              </Label>
            </div>
          ))}
        </div>
        <Button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = editingId
                ? await updateNatureExperienceAction(editingId, payload())
                : await createNatureExperienceAction(payload());
              if (res.ok) {
                toast.success("Guardado");
                setEditingId(null);
                setForm(empty);
                router.refresh();
              } else toast.error(res.error);
            })
          }
        >
          Guardar
        </Button>
      </div>
      <ul className="space-y-2">
        {initialRows.map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <span>{row.title}</span>
            <span className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingId(row.id);
                  setForm(row);
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
                    const res = await deleteNatureExperienceAction(row.id);
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

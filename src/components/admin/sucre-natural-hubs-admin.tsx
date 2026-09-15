"use client";

import { useRouter } from "next/navigation";
import type { TransitionStartFunction } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSucreNaturalHubAction } from "@/lib/actions/sucre-natural";
import { SUCRE_NATURAL_HUBS } from "@/lib/sucre-natural-hubs";

export type HubAdminRow = {
  id: string;
  title: string;
  tagline: string;
  introMarkdown: string;
  coverImageUrl: string;
};

export function SucreNaturalHubsAdmin({ initialHubs }: { initialHubs: HubAdminRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const byId = new Map(initialHubs.map((h) => [h.id, h]));

  return (
    <div className="space-y-8">
      {SUCRE_NATURAL_HUBS.map((def) => {
        const row = byId.get(def.id);
        return (
          <HubEditor
            key={def.id}
            id={def.id}
            label={def.iconLabel}
            initial={{
              id: def.id,
              title: row?.title || def.title,
              tagline: row?.tagline || def.tagline,
              introMarkdown: row?.introMarkdown || "",
              coverImageUrl: row?.coverImageUrl || "",
            }}
            pending={pending}
            startTransition={startTransition}
            onSaved={() => router.refresh()}
          />
        );
      })}
    </div>
  );
}

function HubEditor({
  id,
  label,
  initial,
  pending,
  startTransition,
  onSaved,
}: {
  id: string;
  label: string;
  initial: HubAdminRow;
  pending: boolean;
  startTransition: TransitionStartFunction;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  return (
    <form
      className="space-y-3 rounded-xl border border-border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await saveSucreNaturalHubAction({
            id,
            title: form.title,
            tagline: form.tagline || null,
            introMarkdown: form.introMarkdown || null,
            coverImageUrl: form.coverImageUrl || null,
          });
          if (res.ok) {
            toast.success(`Hub ${label} guardado`);
            onSaved();
          } else toast.error(res.error);
        });
      }}
    >
      <h2 className="font-display text-lg font-semibold">{label}</h2>
      <div className="space-y-2">
        <Label>Título</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Lema</Label>
        <Input
          value={form.tagline}
          onChange={(e) => setForm((s) => ({ ...s, tagline: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Texto introductorio</Label>
        <Textarea
          rows={3}
          value={form.introMarkdown}
          onChange={(e) => setForm((s) => ({ ...s, introMarkdown: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Imagen de portada (ruta /uploads/gallery/images/…)</Label>
        <Input
          value={form.coverImageUrl}
          onChange={(e) => setForm((s) => ({ ...s, coverImageUrl: e.target.value }))}
        />
      </div>
      <Button type="submit" disabled={pending}>
        Guardar hub
      </Button>
    </form>
  );
}

"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { TransitionStartFunction } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GalleryPickerDialog } from "@/components/admin/gallery-picker-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSucreNaturalHubAction } from "@/lib/actions/sucre-natural";
import { toServedMediaUrl } from "@/lib/media-url";
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const previewSrc = form.coverImageUrl ? toServedMediaUrl(form.coverImageUrl) : "";

  return (
    <>
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
          <Label>Imagen de portada</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => setPickerOpen(true)}
            >
              <ImageIcon className="mr-2 size-4" />
              Elegir de la galería
            </Button>
            {form.coverImageUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() => setForm((s) => ({ ...s, coverImageUrl: "" }))}
              >
                Quitar
              </Button>
            ) : null}
          </div>
          {form.coverImageUrl ? (
            <div className="relative mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-md border">
              <Image
                src={previewSrc}
                alt={`Portada de ${label}`}
                fill
                className="object-cover"
                sizes="320px"
                unoptimized
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Elige una imagen en Personalizar</p>
          )}
        </div>
        <Button type="submit" disabled={pending}>
          Guardar hub
        </Button>
      </form>
      <GalleryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="IMAGE"
        title={`Portada de ${label}`}
        onSelect={(url) => setForm((s) => ({ ...s, coverImageUrl: url }))}
      />
    </>
  );
}

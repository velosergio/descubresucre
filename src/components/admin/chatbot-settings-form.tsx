"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveChatbotWebhookAction } from "@/lib/actions/chatbot-settings";

interface ChatbotSettingsFormProps {
  initialWebhookUrl: string;
  callbackHint: string;
}

export function ChatbotSettingsForm({ initialWebhookUrl, callbackHint }: ChatbotSettingsFormProps) {
  const urlRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const currentUrl = urlRef.current?.value ?? "";
    startTransition(async () => {
      const res = await saveChatbotWebhookAction({ n8nWebhookUrl: currentUrl });
      if (res.ok) {
        toast.success("Configuración guardada");
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="n8nWebhookUrl">URL del webhook n8n</Label>
        <Input
          ref={urlRef}
          id="n8nWebhookUrl"
          name="n8nWebhookUrl"
          type="url"
          placeholder="https://…/webhook/…"
          defaultValue={initialWebhookUrl}
          autoComplete="off"
        />
        <p className="text-sm text-muted-foreground">
          Next.js envía el trabajo a esta URL; n8n debe responder de inmediato y luego llamar al callback
          con la respuesta.
        </p>
      </div>

      <div className="rounded-lg border border-border/80 bg-muted/40 p-4 text-sm">
        <p className="font-medium text-foreground">Callback para n8n (solo referencia)</p>
        <code className="mt-2 block break-all text-xs text-muted-foreground">{callbackHint}</code>
        <p className="mt-2 text-muted-foreground">
          Usa el mismo valor para <code className="text-xs">N8N_CALLBACK_SECRET</code> en{" "}
          <code className="text-xs">.env</code> y en el workflow (cabecera{" "}
          <code className="text-xs">X-N8N-Secret</code> o campo <code className="text-xs">secret</code>).
        </p>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar"}
      </Button>
    </form>
  );
}

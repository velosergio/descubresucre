import { prisma } from "@/lib/prisma";
import { getSiteOrigin } from "@/lib/site-url";
import { ChatbotSettingsForm } from "@/components/admin/chatbot-settings-form";

export default async function AdminConfigPage() {
  const row = await prisma.chatbotSettings.findUnique({ where: { id: "singleton" } });
  const origin = getSiteOrigin();
  const callbackHint = `${origin}/api/chat/n8n-callback`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Configuración</h1>
        <p className="max-w-xl text-muted-foreground">
          Integración del asistente con n8n: define el webhook donde Next.js envía cada mensaje.
        </p>
      </div>

      <ChatbotSettingsForm initialWebhookUrl={row?.n8nWebhookUrl ?? ""} callbackHint={callbackHint} />
    </div>
  );
}

import { SucreNaturalHubsAdmin } from "@/components/admin/sucre-natural-hubs-admin";
import { prisma } from "@/lib/prisma";
import { SUCRE_NATURAL_HUBS } from "@/lib/sucre-natural-hubs";

export default async function AdminSucreNaturalHubsPage() {
  const rows = await prisma.sucreNaturalHub.findMany();
  const byId = new Map(rows.map((r) => [r.id, r]));
  const initialHubs = SUCRE_NATURAL_HUBS.map((h) => {
    const row = byId.get(h.id);
    return {
      id: h.id,
      title: row?.title || h.title,
      tagline: row?.tagline || h.tagline || "",
      introMarkdown: row?.introMarkdown || "",
      coverImageUrl: row?.coverImageUrl || "",
    };
  });
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold">Sucre Natural</h1>
        <p className="text-muted-foreground">
          Edita lema, texto e imagen de los siete hubs. No se pueden crear ni borrar temas.
        </p>
      </div>
      <SucreNaturalHubsAdmin initialHubs={initialHubs} />
    </div>
  );
}

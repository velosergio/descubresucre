import { CulturalEventsAdmin } from "@/components/admin/cultural-events-admin";
import { getAllCulturalEventsForAdmin } from "@/lib/get-cultural-events-home";

export default async function AdminEventosPage() {
  const events = await getAllCulturalEventsForAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Eventos y agenda cultural
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Gestiona los eventos que se muestran en la home, agrupados por mes, con opción de agregar
          a calendario.
        </p>
      </div>

      <CulturalEventsAdmin initialEvents={events} />
    </div>
  );
}

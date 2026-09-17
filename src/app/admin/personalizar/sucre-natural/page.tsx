import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminSucreNaturalHubsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold">Sucre Natural</h1>
        <p className="text-muted-foreground">
          La gestión de temas (ex-hubs) se hace ahora desde Actividades en Qué hacer. Esta sección
          ya no edita portadas de hubs.
        </p>
      </div>
      <div className="rounded-xl border border-border/80 bg-muted/30 p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Edita lemas, intros, acentos y listados en Personalizar → Qué hacer. Biodiversidad y
          experiencias siguen disponibles en sus menús propios.
        </p>
        <Button asChild>
          <Link href="/admin/personalizar/que-hacer">Ir a Actividades</Link>
        </Button>
      </div>
    </div>
  );
}

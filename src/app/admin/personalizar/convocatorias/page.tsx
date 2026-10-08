import { ConvocatoriasAdmin } from "@/components/admin/convocatorias-admin";
import { getAllConvocatoriasForAdmin } from "@/lib/get-convocatorias-home";

export default async function AdminConvocatoriasPage() {
  const items = await getAllConvocatoriasForAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-1 border-b border-border/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Convocatorias
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Gestiona las oportunidades culturales y turísticas de la home, con enlace externo a
          inscripción o más información.
        </p>
      </div>

      <ConvocatoriasAdmin initialItems={items} />
    </div>
  );
}

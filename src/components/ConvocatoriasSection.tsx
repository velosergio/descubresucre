import * as m from "framer-motion/m";
import { ArrowRight, Clock, Megaphone, Users } from "lucide-react";
import { useTiltCard } from "@/hooks/use-tilt-card";
import { EXPO_OUT } from "@/lib/motion";

const convocatorias = [
  {
    title: "Convocatoria para Artistas Visuales",
    description: "Inscripciones abiertas para la exposición departamental de artes plásticas 2026.",
    deadline: "30 de Marzo, 2026",
    audience: "Artistas visuales de Sucre",
    type: "Arte",
  },
  {
    title: "Emprendimiento Turístico Comunitario",
    description:
      "Apoyo técnico y financiero para proyectos de turismo comunitario en municipios de Sucre.",
    deadline: "15 de Abril, 2026",
    audience: "Emprendedores y comunidades",
    type: "Turismo",
  },
  {
    title: "Formación en Gestión Cultural",
    description: "Programa gratuito de formación para gestores culturales del departamento.",
    deadline: "20 de Abril, 2026",
    audience: "Gestores culturales",
    type: "Formación",
  },
  {
    title: "Festival del Porro - Participación de Bandas",
    description:
      "Inscripción de bandas y agrupaciones musicales para el Festival Nacional del Porro 2026.",
    deadline: "30 de Mayo, 2026",
    audience: "Agrupaciones musicales",
    type: "Música",
  },
];

const typeColors: Record<string, string> = {
  Arte: "bg-secondary/10 text-secondary border-secondary/20",
  Turismo: "bg-primary/10 text-primary border-primary/20",
  Formación: "bg-accent/30 text-accent-foreground border-accent/40",
  Música: "bg-tropical-coral/10 text-tropical-coral border-tropical-coral/20",
};

function ConvocatoriaCard({
  conv,
  index,
}: {
  conv: (typeof convocatorias)[number];
  index: number;
}) {
  const tilt = useTiltCard<HTMLDivElement>();
  return (
    <m.div
      initial={{ opacity: 0, y: 26, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EXPO_OUT }}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: mousemove/mouseleave solo animan un tilt decorativo, no gatillan ninguna acción */}
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="tilt-card group cursor-pointer rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-start justify-between mb-3">
          <span
            className={`text-xs font-body font-medium rounded-full px-3 py-1 border ${typeColors[conv.type]}`}
          >
            {conv.type}
          </span>
        </div>
        <h3 className="font-display font-bold text-lg text-foreground mb-2">{conv.title}</h3>
        <p className="text-muted-foreground font-body text-sm mb-4">{conv.description}</p>
        <div className="flex items-center gap-4 text-sm font-body">
          <span className="flex items-center gap-1.5 text-tropical-coral">
            <Clock className="w-3.5 h-3.5" />
            {conv.deadline}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            {conv.audience}
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-body font-medium">
            Más información{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </m.div>
  );
}

const ConvocatoriasSection = () => {
  return (
    <section id="convocatorias" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-4">
            <Megaphone className="w-4 h-4 text-secondary" />
            <span className="text-sm font-body font-medium text-secondary">
              Oportunidades abiertas
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Convocatorias
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Participa en las oportunidades culturales y turísticas del departamento
          </p>
        </m.div>

        <div className="grid md:grid-cols-2 gap-6">
          {convocatorias.map((conv, i) => (
            <ConvocatoriaCard key={conv.title} conv={conv} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConvocatoriasSection;

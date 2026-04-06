import * as m from "framer-motion/m";
import { Music, Theater, Paintbrush, BookOpen } from "lucide-react";

const agendaItems = [
  { day: "5", month: "Mar", title: "Concierto de Gaitas y Tambores", category: "Música", icon: Music, location: "Plaza Cultural, Sincelejo" },
  { day: "8", month: "Mar", title: "Exposición Artesanal Zenú", category: "Arte", icon: Paintbrush, location: "Museo Antropológico" },
  { day: "12", month: "Mar", title: "Teatro Comunitario: Raíces", category: "Teatro", icon: Theater, location: "Casa de la Cultura, Sincelejo" },
  { day: "15", month: "Mar", title: "Feria del Libro Caribeño", category: "Literatura", icon: BookOpen, location: "Biblioteca Departamental" },
  { day: "18", month: "Mar", title: "Noche de Porros y Fandangos", category: "Música", icon: Music, location: "Parque Santander, Sincelejo" },
  { day: "22", month: "Mar", title: "Muestra de Cine Regional", category: "Arte", icon: Paintbrush, location: "Teatro Municipal" },
  { day: "25", month: "Mar", title: "Taller de Hamacas Tradicionales", category: "Arte", icon: Paintbrush, location: "San Jacinto" },
  { day: "29", month: "Mar", title: "Festival de Decimeros", category: "Literatura", icon: BookOpen, location: "Ovejas, Sucre" },
];

const categoryColors: Record<string, string> = {
  Música: "bg-primary/10 text-primary",
  Arte: "bg-secondary/10 text-secondary",
  Teatro: "bg-tropical-coral/10 text-tropical-coral",
  Literatura: "bg-accent/80 text-accent-foreground",
};

const CulturalAgenda = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Agenda <span className="text-primary">Cultural</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Actividades culturales, festivales y presentaciones de este mes
          </p>
        </m.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agendaItems.map((item, i) => (
            <m.div
              key={`${item.day}-${item.month}-${item.title}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4 card-hover cursor-pointer border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="text-center bg-primary/10 rounded-lg px-3 py-2 shrink-0">
                  <span className="block text-2xl font-display font-bold text-primary">{item.day}</span>
                  <span className="text-xs text-primary font-body">{item.month}</span>
                </div>
                <div className="min-w-0">
                  <span className={`inline-block text-xs font-body font-medium rounded-full px-2 py-0.5 mb-1.5 ${categoryColors[item.category]}`}>
                    {item.category}
                  </span>
                  <h3 className="font-display font-semibold text-sm text-foreground leading-tight">{item.title}</h3>
                  <p className="text-xs text-muted-foreground font-body mt-1">{item.location}</p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CulturalAgenda;

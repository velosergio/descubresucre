import Image from "next/image";
import * as m from "framer-motion/m";
import { Calendar, MapPin } from "lucide-react";
import festivalImg from "@/assets/festival-sucre.jpg";
import culturaImg from "@/assets/cultura-sucre.jpg";
import playaImg from "@/assets/playa-tolu.jpg";
import gastroImg from "@/assets/gastronomia-sucre.jpg";

const events = [
  {
    title: "Fiestas del 20 de Enero",
    date: "20 - 25 Enero 2026",
    location: "Sincelejo",
    description: "Las tradicionales corralejas y el festival más grande de Sucre con desfiles, música y cultura.",
    image: festivalImg,
  },
  {
    title: "Festival del Porro",
    date: "15 - 20 Junio 2026",
    location: "San Pelayo",
    description: "Celebración de la música de porro con orquestas y bandas de todo el Caribe colombiano.",
    image: culturaImg,
  },
  {
    title: "Festival del Mar",
    date: "5 - 8 Julio 2026",
    location: "Tolú",
    description: "Deportes acuáticos, gastronomía marina y actividades culturales frente al mar.",
    image: playaImg,
  },
  {
    title: "Feria Gastronómica Sucreña",
    date: "10 - 12 Agosto 2026",
    location: "Sincelejo",
    description: "Los mejores sabores de la cocina caribeña reunidos en un solo lugar.",
    image: gastroImg,
  },
];

const EventsSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Próximos <span className="text-tropical-coral">Eventos</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            No te pierdas los eventos más importantes del departamento
          </p>
        </m.div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((ev, i) => (
            <m.div
              key={ev.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm card-hover flex flex-col sm:flex-row"
            >
              <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48 sm:self-stretch sm:min-h-[12rem]">
                <Image
                  src={ev.image}
                  alt={ev.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
              <div className="p-5 flex flex-col justify-center">
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{ev.title}</h3>
                <div className="flex items-center gap-2 text-sm text-primary font-body mb-1">
                  <Calendar className="w-4 h-4" />
                  {ev.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary font-body mb-3">
                  <MapPin className="w-4 h-4" />
                  {ev.location}
                </div>
                <p className="text-muted-foreground font-body text-sm">{ev.description}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;

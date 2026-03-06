import { motion } from "framer-motion";
import { Waves, Palette, UtensilsCrossed, TreePine, Heart } from "lucide-react";
import playaImg from "@/assets/playa-tolu.jpg";
import culturaImg from "@/assets/cultura-sucre.jpg";
import gastroImg from "@/assets/gastronomia-sucre.jpg";
import natImg from "@/assets/naturaleza-sucre.jpg";
import festivalImg from "@/assets/festival-sucre.jpg";

const activities = [
  { icon: Waves, title: "Playas", desc: "Tolú, Coveñas, San Bernardo, Rincón del Mar", image: playaImg },
  { icon: Palette, title: "Cultura", desc: "Artesanías Zenú, museos, arquitectura colonial", image: culturaImg },
  { icon: UtensilsCrossed, title: "Gastronomía", desc: "Arroz de coco, mote de queso, fritos costeños", image: gastroImg },
  { icon: TreePine, title: "Naturaleza", desc: "Manglares, ciénagas, reservas ecológicas", image: natImg },
  { icon: Heart, title: "Experiencias", desc: "Corralejas, música de gaitas, vida local", image: festivalImg },
];

const ActivitiesSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Qué hacer en <span className="text-secondary">Sucre</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Actividades para todos los gustos en el corazón del Caribe colombiano
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {activities.map((act, i) => (
            <motion.div
              key={act.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-card rounded-2xl overflow-hidden card-hover cursor-pointer"
            >
              <div className="aspect-square relative">
                <img src={act.image} alt={act.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                  <act.icon className="w-10 h-10 mb-3" />
                  <h3 className="font-display font-bold text-lg">{act.title}</h3>
                  <p className="text-xs text-primary-foreground/70 text-center px-4 mt-1 font-body">{act.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;

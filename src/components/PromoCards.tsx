import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import playaImg from "@/assets/playa-tolu.jpg";
import festivalImg from "@/assets/festival-sucre.jpg";
import islasImg from "@/assets/islas-sucre.jpg";

const destinations = [
  {
    title: "Playas de Tolú y Coveñas",
    description: "Arena blanca, aguas cristalinas y atardeceres mágicos en el Golfo de Morrosquillo.",
    image: playaImg,
  },
  {
    title: "Islas de San Bernardo",
    description: "Un archipiélago paradisíaco con snorkel, buceo y la isla más densamente poblada del mundo.",
    image: islasImg,
  },
  {
    title: "Fiestas y Tradiciones",
    description: "Corralejas, porros, gaitas y la alegría del Caribe colombiano en cada festival.",
    image: festivalImg,
  },
];

const PromoCards = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Destinos <span className="text-primary">Imperdibles</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Explora los rincones más fascinantes del departamento de Sucre
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] card-hover cursor-pointer"
            >
              <img
                src={dest.image}
                alt={dest.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 gradient-card-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-display font-bold text-primary-foreground mb-2">{dest.title}</h3>
                <p className="text-primary-foreground/70 font-body text-sm mb-4">{dest.description}</p>
                <span className="inline-flex items-center gap-2 text-tropical-gold font-body text-sm font-medium group-hover:gap-3 transition-all">
                  Explorar <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCards;

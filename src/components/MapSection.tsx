import { useState } from "react";
import { MapPin, Navigation, Waves, Landmark, TreePine, UtensilsCrossed } from "lucide-react";
import * as m from "framer-motion/m";

type Category = "all" | "playas" | "cultura" | "naturaleza" | "gastronomía";

interface Destination {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: Category;
  description: string;
  color: string;
}

const destinations: Destination[] = [
  { id: 1, name: "Playa Blanca, Tolú", lat: 9.5256, lng: -75.5811, category: "playas", description: "Arena blanca y aguas cristalinas del Golfo de Morrosquillo.", color: "hsl(174, 62%, 35%)" },
  { id: 2, name: "Islas de San Bernardo", lat: 9.7667, lng: -75.8833, category: "playas", description: "Archipiélago paradisíaco con aguas turquesas y arrecifes de coral.", color: "hsl(174, 62%, 35%)" },
  { id: 3, name: "Coveñas", lat: 9.4033, lng: -75.6847, category: "playas", description: "Playas tranquilas, manglares y rica oferta gastronómica.", color: "hsl(174, 62%, 35%)" },
  { id: 4, name: "Sincelejo – Centro Histórico", lat: 9.3047, lng: -75.3953, category: "cultura", description: "Capital del departamento, sede de las Fiestas en Corralejas.", color: "hsl(28, 85%, 55%)" },
  { id: 5, name: "San Juan de Betulia", lat: 9.35, lng: -75.24, category: "cultura", description: "Tradiciones ganaderas y festivales folclóricos de la sabana.", color: "hsl(28, 85%, 55%)" },
  { id: 6, name: "Ciénaga de la Caimanera", lat: 9.4778, lng: -75.6083, category: "naturaleza", description: "Ecosistema de manglar con avistamiento de aves y caimanes.", color: "hsl(120, 40%, 40%)" },
  { id: 7, name: "Serranía de San Jacinto", lat: 9.8167, lng: -75.1167, category: "naturaleza", description: "Bosques secos, cascadas y senderos ecológicos.", color: "hsl(120, 40%, 40%)" },
  { id: 8, name: "Tolú – Zona Gastronómica", lat: 9.5311, lng: -75.5722, category: "gastronomía", description: "Ceviche, arroz con coco, patacón y cocadas del Caribe.", color: "hsl(5, 72%, 60%)" },
  { id: 9, name: "Ovejas", lat: 9.5333, lng: -75.2333, category: "cultura", description: "Cuna del Festival Nacional de Gaitas.", color: "hsl(28, 85%, 55%)" },
  { id: 10, name: "San Onofre", lat: 9.7333, lng: -75.5333, category: "playas", description: "Playas vírgenes de Rincón del Mar y herencia afrocolombiana.", color: "hsl(174, 62%, 35%)" },
];

const categories: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "Todos", icon: <MapPin className="w-4 h-4" /> },
  { key: "playas", label: "Playas", icon: <Waves className="w-4 h-4" /> },
  { key: "cultura", label: "Cultura", icon: <Landmark className="w-4 h-4" /> },
  { key: "naturaleza", label: "Naturaleza", icon: <TreePine className="w-4 h-4" /> },
  { key: "gastronomía", label: "Gastronomía", icon: <UtensilsCrossed className="w-4 h-4" /> },
];

const MapSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const filtered = activeCategory === "all" ? destinations : destinations.filter((d) => d.category === activeCategory);

  const mapCenter = selectedDest
    ? { lat: selectedDest.lat, lng: selectedDest.lng, zoom: 12 }
    : { lat: 9.45, lng: -75.5, zoom: 9 };

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.5}%2C${mapCenter.lat - 0.3}%2C${mapCenter.lng + 0.5}%2C${mapCenter.lat + 0.3}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`;

  return (
    <section id="mapa" className="section-padding bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-sm font-body font-semibold text-primary uppercase tracking-widest mb-3">
            <Navigation className="w-4 h-4" />
            Explora el mapa
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Destinos turísticos de <span className="text-primary">Sucre</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Navega por el mapa interactivo y descubre playas, cultura, naturaleza y gastronomía en todo el departamento.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setSelectedDest(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground hover:bg-primary/10 border border-border"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-border" style={{ height: 500 }}>
            <iframe
              key={`${mapCenter.lat}-${mapCenter.lng}`}
              width="100%"
              height="100%"
              src={mapSrc}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Mapa de Sucre"
            />
          </div>

          {/* Destination list */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((dest) => (
              <m.button
                key={dest.id}
                layout
                onClick={() => setSelectedDest(dest)}
                className={`w-full text-left p-4 rounded-xl border transition-all font-body ${
                  selectedDest?.id === dest.id
                    ? "bg-primary/10 border-primary shadow-md"
                    : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    style={{ background: dest.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{dest.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{dest.description}</p>
                    <span className="inline-block mt-2 text-xs font-medium text-primary capitalize">{dest.category}</span>
                  </div>
                </div>
              </m.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;

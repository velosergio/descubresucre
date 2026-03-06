import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, X, Navigation, Palmtree, UtensilsCrossed, Landmark, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createCustomIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

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
  { id: 1, name: "Playa Blanca, Tolú", lat: 9.5256, lng: -75.5811, category: "playas", description: "Arena blanca y aguas cristalinas del Golfo de Morrosquillo, perfecta para el descanso y los deportes acuáticos.", color: "hsl(174, 62%, 35%)" },
  { id: 2, name: "Islas de San Bernardo", lat: 9.7667, lng: -75.8833, category: "playas", description: "Archipiélago paradisíaco con aguas turquesas, arrecifes de coral y la famosa isla artificial de Santa Cruz del Islote.", color: "hsl(174, 62%, 35%)" },
  { id: 3, name: "Coveñas", lat: 9.4033, lng: -75.6847, category: "playas", description: "Destino costero con playas tranquilas, manglares y una rica oferta gastronómica de mariscos.", color: "hsl(174, 62%, 35%)" },
  { id: 4, name: "Sincelejo – Centro Histórico", lat: 9.3047, lng: -75.3953, category: "cultura", description: "Capital del departamento, sede de las famosas Fiestas en Corralejas y del patrimonio sabanero.", color: "hsl(28, 85%, 55%)" },
  { id: 5, name: "San Juan de Betulia", lat: 9.35, lng: -75.24, category: "cultura", description: "Municipio de tradiciones ganaderas y festivales folclóricos de la sabana sucreña.", color: "hsl(28, 85%, 55%)" },
  { id: 6, name: "Reserva Natural Ciénaga de la Caimanera", lat: 9.4778, lng: -75.6083, category: "naturaleza", description: "Ecosistema de manglar y ciénaga con avistamiento de aves, caimanes y flora tropical única.", color: "hsl(120, 40%, 40%)" },
  { id: 7, name: "Serranía de San Jacinto", lat: 9.8167, lng: -75.1167, category: "naturaleza", description: "Montañas de los Montes de María con bosques secos, cascadas y senderos ecológicos.", color: "hsl(120, 40%, 40%)" },
  { id: 8, name: "Tolú – Zona Gastronómica", lat: 9.5311, lng: -75.5722, category: "gastronomía", description: "Ceviche de camarón, arroz con coco, patacón con queso y cocadas: los sabores del Caribe colombiano.", color: "hsl(5, 72%, 60%)" },
  { id: 9, name: "Ovejas", lat: 9.5333, lng: -75.2333, category: "cultura", description: "Cuna del Festival Nacional de Gaitas, patrimonio musical de Colombia y tradición oral sabanera.", color: "hsl(28, 85%, 55%)" },
  { id: 10, name: "San Onofre", lat: 9.7333, lng: -75.5333, category: "playas", description: "Playas vírgenes de Rincón del Mar y rica herencia afrocolombiana con música de bullerengue.", color: "hsl(174, 62%, 35%)" },
];

const categories: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "Todos", icon: <MapPin className="w-4 h-4" /> },
  { key: "playas", label: "Playas", icon: <Waves className="w-4 h-4" /> },
  { key: "cultura", label: "Cultura", icon: <Landmark className="w-4 h-4" /> },
  { key: "naturaleza", label: "Naturaleza", icon: <Palmtree className="w-4 h-4" /> },
  { key: "gastronomía", label: "Gastronomía", icon: <UtensilsCrossed className="w-4 h-4" /> },
];

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 12, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

const MapSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);

  const filtered = activeCategory === "all" ? destinations : destinations.filter((d) => d.category === activeCategory);

  const handleMarkerClick = (dest: Destination) => {
    setSelectedDest(dest);
    setFlyTarget({ lat: dest.lat, lng: dest.lng });
  };

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
                setFlyTarget(null);
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
            <MapContainer
              center={[9.45, -75.5]}
              zoom={9}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} />}
              {filtered.map((dest) => (
                <Marker
                  key={dest.id}
                  position={[dest.lat, dest.lng]}
                  icon={createCustomIcon(dest.color)}
                  eventHandlers={{ click: () => handleMarkerClick(dest) }}
                >
                  <Popup>
                    <strong className="text-sm">{dest.name}</strong>
                    <p className="text-xs mt-1 text-gray-600">{dest.description}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Destination list */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((dest) => (
              <motion.button
                key={dest.id}
                layout
                onClick={() => handleMarkerClick(dest)}
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
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;

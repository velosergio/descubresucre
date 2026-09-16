import type { LucideIcon } from "lucide-react";
import {
  Bike,
  Binoculars,
  Bird,
  Camera,
  Compass,
  Droplets,
  Fish,
  Flower2,
  Footprints,
  Heart,
  Landmark,
  Leaf,
  MapPin,
  Mountain,
  Music,
  Palette,
  Palmtree,
  Sailboat,
  Sparkles,
  Sun,
  Tent,
  TreePine,
  Utensils,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

export type QueHacerIconDef = {
  key: string;
  label: string;
  Icon: LucideIcon;
};

export const QUE_HACER_FALLBACK_ICON: QueHacerIconDef = {
  key: "compass",
  label: "Explorar",
  Icon: Compass,
};

export const QUE_HACER_ICONS: readonly QueHacerIconDef[] = [
  { key: "waves", label: "Playas y mar", Icon: Waves },
  { key: "palette", label: "Cultura", Icon: Palette },
  { key: "utensils-crossed", label: "Gastronomía", Icon: UtensilsCrossed },
  { key: "tree-pine", label: "Naturaleza", Icon: TreePine },
  { key: "heart", label: "Experiencias", Icon: Heart },
  QUE_HACER_FALLBACK_ICON,
  { key: "binoculars", label: "Avistamiento", Icon: Binoculars },
  { key: "droplets", label: "Agua", Icon: Droplets },
  { key: "footprints", label: "Senderos", Icon: Footprints },
  { key: "leaf", label: "Biodiversidad", Icon: Leaf },
  { key: "mountain", label: "Paisaje", Icon: Mountain },
  { key: "music", label: "Música", Icon: Music },
  { key: "camera", label: "Fotografía", Icon: Camera },
  { key: "sun", label: "Sol", Icon: Sun },
  { key: "sailboat", label: "Navegación", Icon: Sailboat },
  { key: "map-pin", label: "Lugar", Icon: MapPin },
  { key: "landmark", label: "Patrimonio", Icon: Landmark },
  { key: "fish", label: "Pesca", Icon: Fish },
  { key: "tent", label: "Campamento", Icon: Tent },
  { key: "bike", label: "Ciclismo", Icon: Bike },
  { key: "sparkles", label: "Festividad", Icon: Sparkles },
  { key: "flower-2", label: "Flora", Icon: Flower2 },
  { key: "bird", label: "Aves", Icon: Bird },
  { key: "palmtree", label: "Palma", Icon: Palmtree },
  { key: "utensils", label: "Comida", Icon: Utensils },
];

const ICON_BY_KEY = new Map(QUE_HACER_ICONS.map((d) => [d.key, d]));

export function isQueHacerIconKey(value: string): boolean {
  return ICON_BY_KEY.has(value);
}

export function resolveQueHacerIcon(iconKey: string | null | undefined): QueHacerIconDef {
  const key = iconKey?.trim() ?? "";
  return ICON_BY_KEY.get(key) ?? QUE_HACER_FALLBACK_ICON;
}

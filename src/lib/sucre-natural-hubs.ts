import type { LucideIcon } from "lucide-react";
import { Binoculars, Droplets, Footprints, Leaf, Mountain, Trees, Waves } from "lucide-react";

export const SUCRE_NATURAL_HUB_IDS = [
  "playas",
  "cienagas",
  "rios",
  "paisajes",
  "biodiversidad",
  "senderos",
  "experiencias",
] as const;

export type SucreNaturalHubId = (typeof SUCRE_NATURAL_HUB_IDS)[number];

export type SucreNaturalHubDef = {
  id: SucreNaturalHubId;
  title: string;
  tagline: string;
  sortOrder: number;
  accentHsl: string;
  icon: LucideIcon;
  iconLabel: string;
};

const HUB_ID_SET = new Set<string>(SUCRE_NATURAL_HUB_IDS);

export function isSucreNaturalHubId(value: string): value is SucreNaturalHubId {
  return HUB_ID_SET.has(value);
}

export const SUCRE_NATURAL_HUBS: readonly SucreNaturalHubDef[] = [
  {
    id: "playas",
    title: "Playas de Sucre",
    tagline: "Mar, naturaleza y experiencias que te conectan con lo esencial.",
    sortOrder: 1,
    accentHsl: "174 62% 35%",
    icon: Waves,
    iconLabel: "Playas",
  },
  {
    id: "cienagas",
    title: "Ciénagas de Sucre",
    tagline: "Vida, agua y biodiversidad que nos conectan.",
    sortOrder: 2,
    accentHsl: "142 40% 32%",
    icon: Droplets,
    iconLabel: "Ciénagas",
  },
  {
    id: "rios",
    title: "Ríos de Sucre",
    tagline: "Naturaleza, vida y tradición",
    sortOrder: 3,
    accentHsl: "25 35% 38%",
    icon: Trees,
    iconLabel: "Ríos",
  },
  {
    id: "paisajes",
    title: "Paisajes",
    tagline: "Diversidad de paisajes, una sola tierra",
    sortOrder: 4,
    accentHsl: "130 35% 30%",
    icon: Mountain,
    iconLabel: "Paisajes",
  },
  {
    id: "biodiversidad",
    title: "Biodiversidad de Sucre",
    tagline: "Una riqueza natural que nos hace únicos",
    sortOrder: 5,
    accentHsl: "32 80% 42%",
    icon: Leaf,
    iconLabel: "Biodiversidad",
  },
  {
    id: "senderos",
    title: "Senderos de Sucre",
    tagline: "Camina, descubre y conecta con la naturaleza",
    sortOrder: 6,
    accentHsl: "270 35% 38%",
    icon: Footprints,
    iconLabel: "Senderos",
  },
  {
    id: "experiencias",
    title: "Experiencias de turismo en naturaleza",
    tagline: "Vive Sucre, en armonía con su entorno",
    sortOrder: 7,
    accentHsl: "18 80% 45%",
    icon: Binoculars,
    iconLabel: "Experiencias",
  },
];

export function getSucreNaturalHubDef(id: SucreNaturalHubId): SucreNaturalHubDef {
  const found = SUCRE_NATURAL_HUBS.find((h) => h.id === id);
  if (!found) throw new Error(`Hub desconocido: ${id}`);
  return found;
}

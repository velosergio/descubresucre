import type { QueHacerListingModeId } from "@/lib/que-hacer-listing-mode";

export type QueHacerTemaSeedItem = {
  slug: string;
  title: string;
  description: string;
  tagline: string;
  iconKey: string;
  accentHsl: string;
  listingMode: QueHacerListingModeId;
  sortOrder: number;
  assetFile: string;
};

/** Seven canonical themes (ex Sucre Natural hubs). */
export const QUE_HACER_TEMAS_SEED: readonly QueHacerTemaSeedItem[] = [
  {
    slug: "playas",
    title: "Playas de Sucre",
    description: "Mar, playas y experiencias del Golfo de Morrosquillo.",
    tagline: "Mar, naturaleza y experiencias que te conectan con lo esencial.",
    iconKey: "waves",
    accentHsl: "174 62% 35%",
    listingMode: "DESTINATIONS",
    sortOrder: 1,
    assetFile: "playa-tolu.jpg",
  },
  {
    slug: "cienagas",
    title: "Ciénagas de Sucre",
    description: "Humedales, vida y biodiversidad que nos conectan.",
    tagline: "Vida, agua y biodiversidad que nos conectan.",
    iconKey: "droplets",
    accentHsl: "142 40% 32%",
    listingMode: "DESTINATIONS",
    sortOrder: 2,
    assetFile: "naturaleza-sucre.jpg",
  },
  {
    slug: "rios",
    title: "Ríos de Sucre",
    description: "Naturaleza, vida y tradición a orillas del agua.",
    tagline: "Naturaleza, vida y tradición",
    iconKey: "tree-pine",
    accentHsl: "25 35% 38%",
    listingMode: "DESTINATIONS",
    sortOrder: 3,
    assetFile: "naturaleza-sucre.jpg",
  },
  {
    slug: "paisajes",
    title: "Paisajes",
    description: "Diversidad de paisajes en una sola tierra.",
    tagline: "Diversidad de paisajes, una sola tierra",
    iconKey: "mountain",
    accentHsl: "130 35% 30%",
    listingMode: "DESTINATIONS",
    sortOrder: 4,
    assetFile: "naturaleza-sucre.jpg",
  },
  {
    slug: "biodiversidad",
    title: "Biodiversidad de Sucre",
    description: "Fauna, flora y ecosistemas que nos hacen únicos.",
    tagline: "Una riqueza natural que nos hace únicos",
    iconKey: "leaf",
    accentHsl: "32 80% 42%",
    listingMode: "BIODIVERSITY",
    sortOrder: 5,
    assetFile: "naturaleza-sucre.jpg",
  },
  {
    slug: "senderos",
    title: "Senderos de Sucre",
    description: "Camina, descubre y conecta con la naturaleza.",
    tagline: "Camina, descubre y conecta con la naturaleza",
    iconKey: "footprints",
    accentHsl: "270 35% 38%",
    listingMode: "DESTINATIONS",
    sortOrder: 6,
    assetFile: "naturaleza-sucre.jpg",
  },
  {
    slug: "experiencias",
    title: "Experiencias de turismo en naturaleza",
    description: "Vive Sucre en armonía con su entorno.",
    tagline: "Vive Sucre, en armonía con su entorno",
    iconKey: "binoculars",
    accentHsl: "18 80% 45%",
    listingMode: "EXPERIENCES",
    sortOrder: 7,
    assetFile: "festival-sucre.jpg",
  },
];

/** Mock 007 seedManaged slugs to unpublish (not canonical themes). */
export const QUE_HACER_MOCK_SLUGS_TO_UNPUBLISH = ["cultura", "gastronomia", "naturaleza"] as const;

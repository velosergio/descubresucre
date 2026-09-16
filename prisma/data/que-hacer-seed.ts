export type QueHacerSeedItem = {
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  sortOrder: number;
  assetFile: string;
};

export const QUE_HACER_SEED_ITEMS: readonly QueHacerSeedItem[] = [
  {
    slug: "playas",
    name: "Playas",
    description: "Tolú, Coveñas, San Bernardo, Rincón del Mar",
    iconKey: "waves",
    sortOrder: 1,
    assetFile: "playa-tolu.jpg",
  },
  {
    slug: "cultura",
    name: "Cultura",
    description: "Artesanías Zenú, museos, arquitectura colonial",
    iconKey: "palette",
    sortOrder: 2,
    assetFile: "cultura-sucre.jpg",
  },
  {
    slug: "gastronomia",
    name: "Gastronomía",
    description: "Arroz de coco, mote de queso, fritos costeños",
    iconKey: "utensils-crossed",
    sortOrder: 3,
    assetFile: "gastronomia-sucre.jpg",
  },
  {
    slug: "naturaleza",
    name: "Naturaleza",
    description: "Manglares, ciénagas, reservas ecológicas",
    iconKey: "tree-pine",
    sortOrder: 4,
    assetFile: "naturaleza-sucre.jpg",
  },
  {
    slug: "experiencias",
    name: "Experiencias",
    description: "Corralejas, música de gaitas, vida local",
    iconKey: "heart",
    sortOrder: 5,
    assetFile: "festival-sucre.jpg",
  },
];

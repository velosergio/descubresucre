import type { SucreNaturalHubId } from "../../src/lib/sucre-natural-hubs";

export type SeedHub = {
  id: SucreNaturalHubId;
  title: string;
  tagline: string;
  introMarkdown: string;
  sortOrder: number;
};

export type SeedDestination = {
  slug: string;
  title: string;
  subtitle: string;
  municipality: string | null;
  region: string | null;
  locationLabel: string | null;
  ecosystems: string | null;
  approach: string | null;
  specialWhy: string;
  howToArrive: string | null;
  climate: string | null;
  recommendedTime: string | null;
  audience: string | null;
  mapNote: string | null;
  liveActivities: { title: string }[];
  responsibleTips: string[];
  biodiversityChipLabels: string[];
  hubIds: SucreNaturalHubId[];
  sourceSlugs: string[];
};

export type SeedSpecies = {
  slug: string;
  kind: "FAUNA" | "FLORA" | "ECOSYSTEM";
  groupKey: string;
  commonName: string;
  scientificName: string | null;
  summary: string;
  whereFound: string | null;
  destinationSlugs: string[];
};

export type SeedExperience = {
  slug: string;
  title: string;
  tagline: string;
  whereText: string;
  whatYouDo: string[];
  specialWhy: string;
  recommendations: string[];
  destinationSlugs: string[];
};

export type SeedSource = {
  slug: string;
  name: string;
  url: string;
  note: string;
};

const TIPS_PLAYA = [
  "Lleva contigo tus residuos.",
  "No extraigas plantas, conchas o animales.",
  "Respeta la vida marina y el entorno.",
  "Apoya el comercio local.",
];

export const SEED_HUBS: SeedHub[] = [
  {
    id: "playas",
    title: "Playas de Sucre",
    tagline: "Mar, naturaleza y experiencias que te conectan con lo esencial.",
    introMarkdown: "Descubre · Explora · Conecta. Turismo de naturaleza y sostenibilidad.",
    sortOrder: 1,
  },
  {
    id: "cienagas",
    title: "Ciénagas de Sucre",
    tagline: "Vida, agua y biodiversidad que nos conectan.",
    introMarkdown: "Agua, biodiversidad, comunidad y sostenibilidad.",
    sortOrder: 2,
  },
  {
    id: "rios",
    title: "Ríos de Sucre",
    tagline: "Naturaleza, vida y tradición",
    introMarkdown: "Agua que da vida, cultura que nos une.",
    sortOrder: 3,
  },
  {
    id: "paisajes",
    title: "Paisajes",
    tagline: "Diversidad de paisajes, una sola tierra",
    introMarkdown: "Paisajes que inspiran: montañas, cascadas, bosques, ríos, playas y sabanas.",
    sortOrder: 4,
  },
  {
    id: "biodiversidad",
    title: "Biodiversidad de Sucre",
    tagline: "Una riqueza natural que nos hace únicos",
    introMarkdown: "Fauna, flora, bosques y ecosistemas, agua y especies únicas.",
    sortOrder: 5,
  },
  {
    id: "senderos",
    title: "Senderos de Sucre",
    tagline: "Camina, descubre y conecta con la naturaleza",
    introMarkdown: "Senderismo, paisajes únicos, exploración y conservación del territorio.",
    sortOrder: 6,
  },
  {
    id: "experiencias",
    title: "Experiencias de turismo en naturaleza",
    tagline: "Vive Sucre, en armonía con su entorno",
    introMarkdown:
      "Senderismo, aves, navegación, buceo y careteo, espeleología y naturaleza nocturna.",
    sortOrder: 7,
  },
];

export const SEED_SOURCES: SeedSource[] = [
  {
    slug: "carsucre",
    name: "CARSUCRE",
    url: "https://carsucre.gov.co/",
    note: "Corporación Autónoma Regional de Sucre",
  },
  {
    slug: "colombia-travel",
    name: "Colombia Travel",
    url: "https://colombia.travel/es/destinos-ocultos-colombia/reserva-natural-sanguare",
    note: "Reserva Natural Sanguaré y destinos de naturaleza en Sucre",
  },
  {
    slug: "corpomojana",
    name: "CORPOMOJANA",
    url: "https://www.corpomojana.gov.co/",
    note: "Corporación para el Desarrollo Sostenible de La Mojana y el San Jorge",
  },
  {
    slug: "instituto-humboldt",
    name: "Instituto Humboldt",
    url: "https://revistas.humboldt.org.co/index.php/biota/article/view/1022",
    note: "Biota Colombiana: Mamíferos del departamento de Sucre, Colombia",
  },
  {
    slug: "parques-nacionales",
    name: "Parques Nacionales Naturales de Colombia",
    url: "https://www.parquesnacionales.gov.co/",
    note: "Áreas protegidas y ecosistemas",
  },
  {
    slug: "minambiente",
    name: "Ministerio de Ambiente y Desarrollo Sostenible de Colombia",
    url: "https://www.minambiente.gov.co/",
    note: "Biodiversidad, ecosistemas y conservación",
  },
  {
    slug: "gobernacion-sucre",
    name: "Gobernación de Sucre",
    url: "https://www.sucre.gov.co/",
    note: "Información institucional y turística del departamento",
  },
];

function playa(p: {
  slug: string;
  title: string;
  municipality: string;
  subtitle: string;
  locationLabel: string;
  ecosystems: string;
  approach: string;
  specialWhy: string;
  chips: string[];
  activities: string[];
  howToArrive: string;
  audience?: string;
  recommendedTime?: string;
  mapNote: string;
}): SeedDestination {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    municipality: p.municipality,
    region: "Golfo de Morrosquillo · Caribe colombiano",
    locationLabel: p.locationLabel,
    ecosystems: p.ecosystems,
    approach: p.approach,
    specialWhy: p.specialWhy,
    howToArrive: p.howToArrive,
    climate: "Cálido tropical",
    recommendedTime: p.recommendedTime ?? "1 día o medio día",
    audience: p.audience ?? "Familias, parejas, viajeros de naturaleza",
    mapNote: p.mapNote,
    liveActivities: p.activities.map((title) => ({ title })),
    responsibleTips: TIPS_PLAYA,
    biodiversityChipLabels: p.chips,
    hubIds: ["playas"],
    sourceSlugs: [],
  };
}

export const SEED_DESTINATIONS: SeedDestination[] = [
  playa({
    slug: "rincon-del-mar",
    title: "Rincón del Mar",
    municipality: "San Onofre",
    subtitle:
      "Un rincón tranquilo del Caribe, donde el mar, la naturaleza y la comunidad se encuentran.",
    locationLabel: "San Onofre, Sucre",
    ecosystems: "Playa · mar · manglar · bosque seco tropical",
    approach: "Naturaleza y turismo sostenible",
    specialWhy:
      "Rincón del Mar combina playas de aguas cristalinas, ecosistemas costeros y una fuerte identidad comunitaria. Aquí la naturaleza y la cultura se encuentran, ofreciendo una experiencia auténtica y diferente en el Caribe sucreño.",
    chips: ["Peces", "Corales", "Manglares", "Aves"],
    activities: [
      "Snorkel y buceo",
      "Recorridos en manglares",
      "Atardeceres",
      "Gastronomía local",
      "Turismo comunitario",
    ],
    howToArrive: "Desde Sincelejo (aprox. 1,5 h)",
    recommendedTime: "1–2 días",
    mapNote: "San Onofre",
  }),
  playa({
    slug: "playa-el-frances",
    title: "Playa El Francés",
    municipality: "Tolú",
    subtitle: "Arena blanca, mar tranquilo y la esencia del Caribe.",
    locationLabel: "Tolú, Sucre",
    ecosystems: "Playa · mar · bosque seco tropical",
    approach: "Naturaleza y turismo sostenible",
    specialWhy:
      "La Playa El Francés es un lugar de aguas tranquilas y cristalinas, ideal para disfrutar del mar en un ambiente relajado y auténtico. Su paisaje combina la belleza del Caribe con la cercanía de la vida local.",
    chips: ["Peces", "Corales", "Aves marinas", "Manglares cercanos"],
    activities: [
      "Relájate en la playa",
      "Practica deportes acuáticos",
      "Disfruta la gastronomía local",
      "Captura atardeceres únicos",
    ],
    howToArrive: "Desde Tolú, en lancha o transporte terrestre (aprox. 15 min)",
    audience: "Familias, parejas, viajeros relajados",
    mapNote: "Tolú, Sucre · Ensenada y bruma viva",
  }),
  playa({
    slug: "playa-la-bocana",
    title: "Playa La Bocana",
    municipality: "Tolú",
    subtitle: "Donde la brisa del mar se mezcla con la calidez de su gente.",
    locationLabel: "Tolú, Sucre",
    ecosystems: "Playa · mar · manglar",
    approach: "Naturaleza y turismo sostenible",
    specialWhy:
      "La Bocana es una playa tranquila y fascinante, donde se mezclan las aguas del mar Caribe con la vida del manglar. Su cercanía al Golfo de Morrosquillo la convierte en un lugar ideal para disfrutar de la naturaleza, la cultura local y la gastronomía sucreña.",
    chips: ["Peces", "Aves marinas", "Manglares", "Crustáceos"],
    activities: ["Paseo en lancha", "Gastronomía local", "Avistamiento de aves", "Fotografía"],
    howToArrive: "Desde Tolú, en lancha o vehículo (aprox. 15 min)",
    mapNote: "Tolú, Sucre",
  }),
  playa({
    slug: "playa-del-malecon",
    title: "Playa del Malecón",
    municipality: "Tolú",
    subtitle: "El encanto del Caribe en cada paso.",
    locationLabel: "Tolú, Sucre",
    ecosystems: "Playa · mar · urbano costero",
    approach: "Turismo sostenible y cultura local",
    specialWhy:
      "El Malecón de Tolú es un lugar lleno de vida, con su brisa marina, su gente cálida y una vista privilegiada del mar Caribe. Aquí se mezclan la tradición, la cultura y la alegría caribeña.",
    chips: ["Peces", "Aves marinas", "Crustáceos", "Ecosistemas costeros"],
    activities: [
      "Paseo por el malecón",
      "Gastronomía local",
      "Avistamiento de aves",
      "Ambiente familiar",
    ],
    howToArrive: "Desde Tolú, en lancha o vehículo (aprox. 10 min)",
    audience: "Familias, parejas, amigos y viajeros de naturaleza",
    mapNote: "Tolú, Sucre",
  }),
  playa({
    slug: "playa-puerto-viejo",
    title: "Playa Puerto Viejo",
    municipality: "Tolú",
    subtitle: "Un rincón tranquilo donde el mar, la naturaleza y la cultura se encuentran.",
    locationLabel: "Tolú, Sucre",
    ecosystems: "Playa · mar · manglar",
    approach: "Turismo sostenible y cultura local",
    specialWhy:
      "La Playa Puerto Viejo es un lugar ideal para quienes buscan tranquilidad, aguas cálidas y un ambiente auténtico. Su cercanía al mar y su entorno natural la convierten en un destino perfecto para disfrutar del Caribe.",
    chips: ["Peces", "Aves marinas", "Manglares", "Crustáceos"],
    activities: [
      "Paseo en lancha",
      "Gastronomía local",
      "Avistamiento de aves",
      "Ambiente familiar",
    ],
    howToArrive: "Desde Tolú, en lancha o vehículo (aprox. 10 min)",
    mapNote: "Tolú, Sucre",
  }),
  playa({
    slug: "playa-la-marta",
    title: "Playa La Marta",
    municipality: "Tolú",
    subtitle: "Un rincón tranquilo del Caribe, donde la naturaleza y la calma se encuentran.",
    locationLabel: "Tolú, Sucre (sobre la vía a Coveñas)",
    ecosystems: "Playa · mar · manglares (Ciénaga La Caimanera)",
    approach: "Turismo sostenible y cultura local",
    specialWhy:
      "Playa La Marta es un destino tranquilo y poco concurrido, ideal para quienes buscan disfrutar del mar, la brisa caribeña y la belleza de la Ciénaga La Caimanera.",
    chips: ["Peces", "Aves marinas", "Manglares"],
    activities: [
      "Paseo en lancha",
      "Gastronomía local",
      "Avistamiento de aves",
      "Ambiente familiar",
    ],
    howToArrive: "Desde Tolú, en la vía a Coveñas (aprox. 15 min)",
    mapNote: "La Marta · Tolú · Coveñas",
  }),
  playa({
    slug: "segunda-ensenada",
    title: "Segunda Ensenada",
    municipality: "Coveñas",
    subtitle: "Playas tranquilas, aguas cálidas y un ambiente perfecto para descansar y disfrutar.",
    locationLabel: "Coveñas, Sucre (sobre la vía a Tolú)",
    ecosystems: "Playa · mar · manglares",
    approach: "Turismo sostenible y cultura local",
    specialWhy:
      "La Segunda Ensenada es una playa de aguas tranquilas y cristalinas, ideal para quienes buscan descanso, naturaleza y un ambiente familiar.",
    chips: ["Peces", "Aves marinas", "Manglares", "Crustáceos"],
    activities: [
      "Paseo en lancha",
      "Gastronomía local",
      "Avistamiento de aves",
      "Ambiente familiar",
    ],
    howToArrive: "Desde Tolú, en la vía a Coveñas (aprox. 10 min)",
    mapNote: "Segunda Ensenada · Coveñas",
  }),
  playa({
    slug: "playa-el-eden",
    title: "Playa El Edén",
    municipality: "Coveñas",
    subtitle: "Un rincón de aguas tranquilas, arrecifes y naturaleza, ideal para desconectar.",
    locationLabel: "Coveñas, Sucre (sobre la vía a Tolú)",
    ecosystems: "Playa · arrecifes · manglares",
    approach: "Turismo sostenible y cuidado del mar",
    specialWhy:
      "Playa El Edén es un paraíso de aguas cristalinas y arena suave. Su cercanía a los arrecifes de coral la convierte en un lugar ideal para practicar snorkel.",
    chips: ["Peces de arrecife", "Corales", "Aves marinas", "Crustáceos"],
    activities: [
      "Paseo en lancha",
      "Gastronomía local",
      "Avistamiento de aves",
      "Ambiente familiar",
    ],
    howToArrive: "Desde Tolú, en la vía a Coveñas (aprox. 15 min)",
    audience: "Familias, parejas, amigos y amantes del mar",
    mapNote: "El Edén · Coveñas",
  }),
  {
    slug: "cienaga-caimito",
    title: "Ciénaga Caimito",
    subtitle: "Un paraíso de manglares, tranquilidad y vida silvestre en el corazón de Sucre.",
    municipality: "Caimito",
    region: "Golfo de Morrosquillo",
    locationLabel: "Municipio de Caimito, Sucre",
    ecosystems: "Laguna costera · manglares",
    approach: "Naturaleza y biodiversidad",
    specialWhy:
      "Una laguna costera rodeada de manglares, rica en biodiversidad y parte del ecosistema del Golfo de Morrosquillo.",
    howToArrive:
      "Desde Sincelejo o Tolú, toma la vía hacia Caimito. El trayecto es de aproximadamente 1 hora.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Golfo de Morrosquillo · Tolú · Ciénaga Caimito · Caimito",
    liveActivities: [
      { title: "Recorridos en lancha" },
      { title: "Avistamiento de aves" },
      { title: "Fotografía de naturaleza" },
      { title: "Conexión con la cultura local" },
    ],
    responsibleTips: ["Cuida los humedales y no arrojes residuos."],
    biodiversityChipLabels: ["Aves", "Manglares", "Peces", "Cangrejos", "Vegetación nativa"],
    hubIds: ["cienagas"],
    sourceSlugs: [],
  },
  {
    slug: "cienaga-san-benito",
    title: "Ciénaga San Benito",
    subtitle: "Agua, vida y tradición",
    municipality: "San Benito Abad",
    region: "Sistema cenagoso del San Jorge",
    locationLabel: "San Benito Abad, Sucre",
    ecosystems: "Humedal · pesca · cultura",
    approach: "Naturaleza y cultura anfibia",
    specialWhy:
      "Un humedal lleno de vida, parte del sistema cenagoso del San Jorge, donde la naturaleza, la pesca y la cultura se encuentran.",
    howToArrive:
      "Desde Tolú, toma la vía hacia San Benito Abad. El trayecto es de aproximadamente 20 a 30 minutos.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Mar Caribe · Tolú · San Benito Abad · Ciénaga San Benito",
    liveActivities: [
      { title: "Recorridos en canoa" },
      { title: "Fotografía de naturaleza" },
      { title: "Pesca artesanal" },
      { title: "Conexión con comunidades locales" },
    ],
    responsibleTips: ["Respeta la fauna y las comunidades locales."],
    biodiversityChipLabels: [
      "Aves",
      "Peces",
      "Manglares",
      "Vegetación acuática",
      "Fauna silvestre",
    ],
    hubIds: ["cienagas"],
    sourceSlugs: [],
  },
  {
    slug: "cienaga-la-caimanera",
    title: "Ciénaga La Caimanera",
    subtitle: "Un laberinto de manglares donde el agua y la vida se encuentran.",
    municipality: "Coveñas",
    region: "Caribe colombiano",
    locationLabel: "Coveñas, Sucre",
    ecosystems: "Manglar · mar Caribe",
    approach: "Naturaleza y biodiversidad",
    specialWhy:
      "Es un ecosistema de manglares que conecta con el mar Caribe, ideal para quienes buscan naturaleza, tranquilidad y contacto con la biodiversidad.",
    howToArrive:
      "Desde Coveñas, a pocos minutos de la vía principal. Puedes llegar en carro, moto o con tours locales en lancha o canoa.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Coveñas · Ciénaga La Caimanera · vía principal",
    liveActivities: [
      { title: "Recorridos en canoa" },
      { title: "Avistamiento de aves" },
      { title: "Fotografía de naturaleza" },
      { title: "Educación ambiental" },
    ],
    responsibleTips: ["Respeta la fauna y el entorno."],
    biodiversityChipLabels: ["Aves", "Manglares", "Peces", "Reptiles", "Caimán aguja"],
    hubIds: ["cienagas"],
    sourceSlugs: [],
  },
  {
    slug: "cienaga-de-san-marcos",
    title: "Ciénaga de San Marcos",
    subtitle: "Agua, paisaje y vida en el corazón del San Jorge.",
    municipality: "San Marcos",
    region: "San Jorge y La Mojana",
    locationLabel: "San Marcos, Sucre",
    ecosystems: "Humedal · río San Jorge",
    approach: "Biodiversidad y pesca",
    specialWhy:
      "Un humedal conectado al sistema del río San Jorge, de gran importancia para la biodiversidad, la pesca y la regulación del agua.",
    howToArrive:
      "Se accede por vía terrestre hasta San Marcos; desde el municipio existen embarcaderos y recorridos sobre la ciénaga.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "San Marcos · Ciénaga de San Marcos · Río San Jorge",
    liveActivities: [
      { title: "Recorrido en canoa" },
      { title: "Observación de aves" },
      { title: "Fotografía de naturaleza" },
      { title: "Paisaje al atardecer" },
    ],
    responsibleTips: ["No arrojes residuos a los humedales."],
    biodiversityChipLabels: ["Aves", "Peces", "Humedales", "Paisajes ribereños", "Pesca artesanal"],
    hubIds: ["cienagas"],
    sourceSlugs: [],
  },
  {
    slug: "cienaga-de-la-leche",
    title: "Ciénaga de La Leche",
    subtitle: "Un espejo de agua donde el paisaje se encuentra con la tranquilidad.",
    municipality: "Tolú",
    region: "Santiago de Tolú",
    locationLabel: "Santiago de Tolú, Sucre",
    ecosystems: "Humedal costero · manglares",
    approach: "Naturaleza y interpretación ambiental",
    specialWhy:
      "Es un ecosistema de humedal costero, con manglares y gran riqueza de biodiversidad, ubicado en Santiago de Tolú.",
    howToArrive:
      "Desde Tolú, toma la vía hacia la zona de la ciénaga. Puedes llegar en vehículo particular, moto o con tours locales.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Tolú · Ciénaga La Leche",
    liveActivities: [
      { title: "Recorrido en canoa o kayak" },
      { title: "Avistamiento de aves" },
      { title: "Fotografía de naturaleza" },
      { title: "Interpretación ambiental" },
    ],
    responsibleTips: ["Cuida los manglares."],
    biodiversityChipLabels: ["Manglares", "Aves", "Peces", "Fauna silvestre"],
    hubIds: ["cienagas"],
    sourceSlugs: [],
  },
  {
    slug: "rio-san-jorge",
    title: "Río San Jorge",
    subtitle: "Agua, vida y tradición",
    municipality: "San Marcos",
    region: "Caribe y La Mojana",
    locationLabel: "Sucre, Colombia",
    ecosystems: "Río · ribera · sistema hídrico",
    approach: "Naturaleza y cultura",
    specialWhy:
      "El río San Jorge es el principal río del departamento de Sucre. Atraviesa gran parte del territorio y hace parte del sistema hídrico de la región Caribe y la Mojana.",
    howToArrive:
      "Desde Sincelejo, toma la vía hacia San Marcos. El recorrido es aproximadamente de 1 a 2 horas.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Río San Jorge",
    liveActivities: [
      { title: "Paseos en lancha o canoa" },
      { title: "Pesca artesanal" },
      { title: "Observación de aves" },
      { title: "Fotografía de naturaleza" },
    ],
    responsibleTips: [
      "No arrojes basura al río.",
      "Respeta la flora y la fauna.",
      "Apoya a las comunidades locales.",
      "Usa productos biodegradables.",
    ],
    biodiversityChipLabels: ["Aves", "Peces", "Vegetación de ribera", "Reptiles"],
    hubIds: ["rios"],
    sourceSlugs: ["corpomojana", "gobernacion-sucre", "minambiente"],
  },
  {
    slug: "rio-cauca",
    title: "Río Cauca",
    subtitle: "Naturaleza que conecta territorios",
    municipality: "La Mojana",
    region: "La Mojana Sucreña",
    locationLabel: "La Mojana Sucreña",
    ecosystems: "Río · ribera · humedal",
    approach: "Naturaleza y cultura",
    specialWhy:
      "El río Cauca es un importante componente del sistema hídrico de La Mojana. En Sucre, bordea San Benito Abad, Caimito y parte de San Marcos.",
    howToArrive:
      "Desde Sincelejo o Tolú, toma la vía hacia San Benito Abad. Desde allí toma el acceso hacia la zona de la Mojana (aprox. 1 a 2 horas).",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Río Benítez · San Benito Abad · Río Cauca · Caimito · San Marcos · Sucre",
    liveActivities: [
      { title: "Paseo en lancha o canoa" },
      { title: "Pesca artesanal" },
      { title: "Observación de aves" },
      { title: "Conexión con la cultura local" },
    ],
    responsibleTips: ["Respeta las riberas y las comunidades."],
    biodiversityChipLabels: ["Aves acuáticas", "Peces", "Vegetación de ribera", "Tortugas"],
    hubIds: ["rios"],
    sourceSlugs: [],
  },
  {
    slug: "paisaje-de-la-mojana",
    title: "Paisaje de la Mojana",
    subtitle: "Naturaleza que conecta vida",
    municipality: "La Mojana",
    region: "Depresión Momposina · sur de Sucre",
    locationLabel: "Sur de Sucre: Guaranda, Majagual, Sucre, San Marcos, Caimito y San Benito Abad",
    ecosystems: "Humedales · ríos · ciénagas · caños · bosques inundables",
    approach: "Paisaje y cultura anfibia",
    specialWhy:
      "Un paisaje de humedales de la Depresión Momposina, formado por ríos, ciénagas, caños, meandros y bosques inundables. Regula el agua, alberga biodiversidad y sostiene la pesca y la agricultura.",
    howToArrive:
      "En el sur de Sucre, en municipios como Guaranda, Majagual, Sucre, San Marcos, Caimito y San Benito Abad.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "San Benito Abad · Majagual · Guaranda · Sucre · San Marcos · Caimito · La Mojana",
    liveActivities: [
      { title: "Navegación en canoa" },
      { title: "Observación de aves" },
      { title: "Paisajes de humedal" },
      { title: "Acercamiento a la cultura local" },
    ],
    responsibleTips: [
      "Cuida los humedales, no arrojes residuos y respeta la fauna y las comunidades.",
    ],
    biodiversityChipLabels: [
      "Ciénagas y caños",
      "Ríos y bosques inundables",
      "Aves y fauna acuática",
      "Pesca",
    ],
    hubIds: ["paisajes"],
    sourceSlugs: [],
  },
  {
    slug: "reserva-natural-sanguare",
    title: "Reserva Natural Sanguaré",
    subtitle: "Naturaleza que se vive",
    municipality: "San Onofre",
    region: "Zona costera de Sucre",
    locationLabel: "San Onofre, Sucre",
    ecosystems: "Bosque seco tropical · manglares · lagunas · sabanas · ecosistemas marinos",
    approach: "Conservación y ecoturismo",
    specialWhy:
      "Es un área protegida que combina bosque seco tropical, manglares, lagunas, sabanas y ecosistemas marinos. Conserva una gran biodiversidad y protege los manglares costeros.",
    howToArrive:
      "Desde Sincelejo o Tolú, toma la vía hacia San Onofre. El recorrido es de aproximadamente 1 a 1,5 horas.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Reserva Natural Sanguaré · San Onofre · Montes de María · Sucre",
    liveActivities: [
      { title: "Senderismo" },
      { title: "Observación de aves" },
      { title: "Naturaleza nocturna" },
    ],
    responsibleTips: ["Respeta el área protegida y recorre con guía."],
    biodiversityChipLabels: ["Manglares", "Bosque seco tropical", "Aves", "Fauna marina"],
    hubIds: ["paisajes", "senderos"],
    sourceSlugs: ["colombia-travel"],
  },
  {
    slug: "cavernas-de-toluviejo",
    title: "Cavernas de Toluviejo",
    subtitle: "Naturaleza, formaciones únicas y mucha historia",
    municipality: "Toluviejo",
    region: "Montes de María",
    locationLabel: "Toluviejo, Sucre",
    ecosystems: "Cavernas · bosque tropical",
    approach: "Geología y ecoturismo",
    specialWhy:
      "Un conjunto de cavernas y formaciones rocosas, rodeadas de bosque tropical. Es hogar de flora y fauna, y parte del patrimonio natural y cultural de Sucre.",
    howToArrive:
      "Desde Toluviejo, por la vía al municipio de San Onofre. El recorrido es de aproximadamente 30 a 45 minutos.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Cavernas de Toluviejo · Toluviejo · Montes de María",
    liveActivities: [{ title: "Recorridos guiados" }, { title: "Espeleología" }],
    responsibleTips: ["Explora con guía, no toques las formaciones y respeta la fauna."],
    biodiversityChipLabels: ["Cuevas", "Bosque tropical", "Fauna y flora local"],
    hubIds: ["paisajes"],
    sourceSlugs: [],
  },
  {
    slug: "salto-del-sereno",
    title: "Salto del Sereno",
    subtitle: "Naturaleza que inspira",
    municipality: "San Onofre",
    region: "Sucre",
    locationLabel: "San Onofre, Sucre",
    ecosystems: "Cascada · poza · vegetación",
    approach: "Naturaleza y senderos",
    specialWhy:
      "Es una caída de agua natural que forma una poza de aguas cristalinas, rodeada de vegetación y rocas. Hace parte del equilibrio natural de la región y es un refugio para la biodiversidad.",
    howToArrive:
      "Desde San Onofre, por vía terrestre hacia el corregimiento El Porvenir. El recorrido es de aproximadamente 30 a 40 minutos.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Salto del Sereno · San Onofre · Sucre",
    liveActivities: [{ title: "Baño en poza natural" }, { title: "Senderismo" }],
    responsibleTips: ["No dejes residuos en la cascada."],
    biodiversityChipLabels: ["Cascada", "Vegetación nativa", "Fauna silvestre"],
    hubIds: ["paisajes"],
    sourceSlugs: [],
  },
  {
    slug: "montes-de-maria",
    title: "Montes de María",
    subtitle: "Naturaleza que inspira",
    municipality: "Toluviejo",
    region: "Montes de María",
    locationLabel: "Sucre",
    ecosystems: "Montañas · bosque seco · tradición",
    approach: "Paisaje, cultura y senderos",
    specialWhy:
      "Un paisaje de montañas, bosques secos y tradición, que combina naturaleza, cultura y gente hospitalaria. Conserva la biodiversidad y forma parte de la identidad cultural de Sucre.",
    howToArrive:
      "Desde Sincelejo a Tolú, toma la vía hacia Toluviejo o Colosó. El recorrido es de aproximadamente 1 a 2 horas.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Montes de María · Toluviejo · Colosó · Chalán · Sucre",
    liveActivities: [
      { title: "Miradores" },
      { title: "Senderos ecológicos" },
      { title: "Tradiciones y cultura local" },
    ],
    responsibleTips: ["Respeta los bosques secos y las comunidades."],
    biodiversityChipLabels: ["Bosques secos tropicales", "Miradores", "Senderos"],
    hubIds: ["paisajes"],
    sourceSlugs: [],
  },
  {
    slug: "serrania-de-coraza",
    title: "Serranía de Coraza",
    subtitle: "Senderos entre bosque, montaña y agua",
    municipality: "Colosó",
    region: "Montes de María",
    locationLabel: "Colosó, Chalán y Toluviejo, Montes de María",
    ecosystems: "Bosque seco tropical · arroyos y cascadas",
    approach: "Senderismo y conservación",
    specialWhy:
      "Es una de las áreas naturales más representativas de los Montes de María. Conserva bosque seco tropical, protege fuentes de agua y alberga una gran biodiversidad.",
    howToArrive:
      "Desde Sincelejo toma la vía hacia Toluviejo y, luego, el desvío a Colosó o Chalán. Desde estos municipios se continúa por vías terciarias y senderos naturales hasta la serranía.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Toluviejo · Chalán · Colosó · Sucre",
    liveActivities: [
      { title: "Senderismo" },
      { title: "Miradores" },
      { title: "Observación de flora y fauna" },
    ],
    responsibleTips: ["Camina por los senderos señalados y no dejes residuos."],
    biodiversityChipLabels: ["Bosque seco tropical", "Arroyos y cascadas", "Flora y fauna"],
    hubIds: ["senderos"],
    sourceSlugs: [],
  },
  {
    slug: "salto-del-cauca",
    title: "Salto del Cauca",
    subtitle: "Aventura entre cascadas y bosque seco",
    municipality: "Chalán",
    region: "Montes de María",
    locationLabel: "Chalán, Sucre · entorno de la Reserva Natural Altamira",
    ecosystems: "Cascadas · bosque seco tropical · montaña",
    approach: "Senderismo de mayor exigencia",
    specialWhy:
      "Es uno de los atractivos naturales destacados de Chalán y forma parte de una ruta de senderismo de mayor exigencia física, con bosque, paisaje montañoso y biodiversidad de los Montes de María.",
    howToArrive:
      "La ruta puede iniciar en la plaza principal de Chalán y continuar mediante senderos hacia el Salto del Cauca. La caminata es exigente (referencia de unos 8,5 km).",
    climate: null,
    recommendedTime: null,
    audience: "Personas con buen estado físico",
    mapNote: "Chalán · Sucre",
    liveActivities: [{ title: "Caminata exigente" }, { title: "Cascadas y piscinas naturales" }],
    responsibleTips: ["Infórmate sobre el nivel de dificultad y ve con guía local."],
    biodiversityChipLabels: [
      "Cascadas",
      "Bosque seco tropical",
      "Flora y fauna de los Montes de María",
    ],
    hubIds: ["senderos"],
    sourceSlugs: [],
  },
  {
    slug: "senderos-de-toluviejo",
    title: "Senderos de Toluviejo",
    subtitle: "Naturaleza, cultura y paisajes únicos",
    municipality: "Toluviejo",
    region: "Bosque seco tropical",
    locationLabel: "Toluviejo, Sucre",
    ecosystems: "Bosque seco tropical · cañones · miradores",
    approach: "Turismo sostenible y cultura campesina",
    specialWhy:
      "Permite conocer el bosque seco tropical, la cultura campesina y la riqueza natural de Toluviejo, impulsando la conservación y el desarrollo local.",
    howToArrive:
      "Desde Sincelejo se toma la vía hacia Toluviejo. Una vez en el municipio, se accede a los senderos a pie o con guías locales.",
    climate: null,
    recommendedTime: null,
    audience: null,
    mapNote: "Sincelejo → Toluviejo",
    liveActivities: [
      { title: "Sendero del Agua" },
      { title: "Sendero de Flora y Fauna" },
      { title: "Sendero El Saltón" },
    ],
    responsibleTips: ["Recorre con guías locales y respeta el bosque seco."],
    biodiversityChipLabels: ["Bosque seco tropical", "Flora y fauna nativa", "Miradores"],
    hubIds: ["senderos"],
    sourceSlugs: [],
  },
  {
    slug: "caminatas-en-sanguare",
    title: "Caminatas en Sanguaré",
    subtitle: "Bosque seco, humedales y vida silvestre",
    municipality: "San Onofre",
    region: "Zona costera",
    locationLabel: "Reserva Natural Sanguaré, San Onofre",
    ecosystems: "Bosque seco tropical · humedales · lagunas",
    approach: "Aventura y conservación",
    specialWhy:
      "Ecosistema clave que conserva bosque seco tropical, humedales y una gran diversidad de flora y fauna, y protege especies en peligro.",
    howToArrive:
      "Desde San Onofre, se toma la vía hacia el sector de Sanguaré. Acceso en vehículo hasta la entrada y luego caminatas de dificultad media y alta.",
    climate: null,
    recommendedTime: null,
    audience: "Quienes disfrutan la aventura y la naturaleza",
    mapNote: "San Onofre → Sanguaré",
    liveActivities: [{ title: "Caminatas por senderos" }, { title: "Observación de aves" }],
    responsibleTips: ["Permanece en los senderos de la reserva."],
    biodiversityChipLabels: [
      "Bosque seco tropical",
      "Humedales",
      "Aves migratorias",
      "Fauna silvestre",
    ],
    hubIds: ["senderos"],
    sourceSlugs: [],
  },
];

function fauna(
  slug: string,
  groupKey: string,
  name: string,
  summary: string,
  whereFound?: string,
  destinationSlugs: string[] = [],
): SeedSpecies {
  return {
    slug,
    kind: "FAUNA",
    groupKey,
    commonName: name,
    scientificName: null,
    summary,
    whereFound: whereFound ?? null,
    destinationSlugs,
  };
}

export const SEED_SPECIES: SeedSpecies[] = [
  fauna(
    "titi-cabeciblanco",
    "mamiferos",
    "Tití cabeciblanco",
    "Pequeño primate muy ágil y sociable. Se reconoce por su distintiva cabeza blanca y su gran habilidad para saltar entre los árboles.",
    undefined,
    ["reserva-natural-sanguare"],
  ),
  fauna(
    "jaguar",
    "mamiferos",
    "Jaguar",
    "El felino más grande de América. Es fuerte, solitario y un gran nadador. Cumple un papel clave en el equilibrio del ecosistema.",
  ),
  fauna(
    "oso-hormiguero",
    "mamiferos",
    "Oso hormiguero",
    "Tiene una larga lengua que puede extender hasta 60 cm para alimentarse de hormigas y termitas. Es un gran aliado del ecosistema por su control de insectos.",
  ),
  fauna(
    "mono-aullador",
    "mamiferos",
    "Mono aullador",
    "Se distingue por su potente vocalización, que puede escucharse a varios kilómetros. Vive en grupos y se alimenta principalmente de frutas y hojas.",
  ),
  fauna(
    "mono-nocturno",
    "mamiferos",
    "Mono nocturno",
    "De hábitos nocturnos, posee grandes ojos que le permiten ver en la oscuridad. Se alimenta de frutas, hojas y néctar.",
  ),
  fauna(
    "nutria",
    "mamiferos",
    "Nutria",
    "Excelente nadadora, vive en ríos, ciénagas y manglares. Se alimenta de peces, crustáceos y pequeños animales acuáticos.",
  ),
  fauna(
    "tortuga-del-rio-sinu",
    "reptiles-anfibios",
    "Tortuga del río Sinú",
    "Habita en ríos, ciénagas y lagunas de la región. Es clave para el equilibrio del ecosistema acuático.",
  ),
  fauna(
    "iguana-comun",
    "reptiles-anfibios",
    "Iguana común",
    "Se encuentra en bosques, manglares y zonas cálidas. Es herbívora y cumple un papel importante en la dispersión de semillas.",
  ),
  fauna(
    "caiman-aguja",
    "reptiles-anfibios",
    "Caimán aguja",
    "Habita en ríos, ciénagas y humedales. Es un gran controlador de poblaciones de peces y otros animales acuáticos.",
  ),
  fauna(
    "rana-tigre",
    "reptiles-anfibios",
    "Rana tigre",
    "Vive en zonas húmedas, cerca de ríos y lagunas. Su piel ayuda a mantener el equilibrio del ecosistema y es un indicador de la calidad del agua.",
  ),
  fauna(
    "serpiente-boa",
    "reptiles-anfibios",
    "Serpiente boa",
    "Habita en bosques, sabanas y zonas cercanas al agua. No es venenosa y se alimenta principalmente de roedores, aves y otros animales pequeños.",
  ),
  fauna(
    "guacamaya-roja",
    "aves",
    "Guacamaya roja",
    "Dispersa semillas y contribuye a la regeneración de los bosques. Es un emblema de la biodiversidad caribeña.",
    "Bosques secos, miradores y zonas rurales de Sucre, especialmente en cercanías de los Montes de María y San Onofre.",
  ),
  fauna(
    "garza-real",
    "aves",
    "Garza real",
    "Controla peces y otras especies acuáticas, manteniendo el equilibrio de los humedales y ciénagas.",
    "Ciénagas, lagunas, ríos y zonas costeras, como la Ciénaga de La Caimanera.",
  ),
  fauna(
    "turpial-de-caribe",
    "aves",
    "Turpial de Caribe",
    "Es un gran polinizador y dispersor de semillas. Su presencia indica la buena salud del ecosistema.",
    "Bosques, jardines, cultivos y zonas urbanas de Sucre.",
  ),
  fauna(
    "martin-pescador",
    "aves",
    "Martín pescador",
    "Controla poblaciones de peces y mantiene el equilibrio en los ecosistemas acuáticos.",
    "Ríos, quebradas, ciénagas y cuerpos de agua dulce.",
  ),
  fauna(
    "ibis-cara-roja",
    "aves",
    "Ibis cara roja",
    "Ayuda a controlar insectos y pequeños organismos acuáticos en humedales y ciénagas.",
    "Ciénagas, manglares y zonas inundables, como la Ciénaga de La Caimanera.",
  ),
  fauna(
    "caricare",
    "aves",
    "Caricare",
    "Controla roedores y otras presas naturales, evitando el desequilibrio en los ecosistemas.",
    "Zonas abiertas, sabanas, cultivos y áreas rurales de Sucre.",
  ),
  fauna(
    "colibri-esmeralda",
    "aves",
    "Colibrí esmeralda",
    "Poliniza flores y favorece la reproducción de muchas plantas de la región.",
    "Jardines, bosques, matorrales y zonas rurales de todo el departamento.",
  ),
  fauna(
    "jacana",
    "aves",
    "Jacana",
    "Controla insectos y pequeños invertebrados. Es un indicador de la calidad del agua y los humedales.",
    "Ciénagas, lagunas y zonas inundables, como la Ciénaga de San Marcos.",
  ),
  {
    slug: "bosque-seco-tropical",
    kind: "ECOSYSTEM",
    groupKey: "bosques",
    commonName: "Bosque seco tropical",
    scientificName: null,
    summary:
      "Uno de los ecosistemas más representativos de Sucre, adaptado a las largas temporadas de sequía. Es clave para la biodiversidad y la protección del agua y el suelo.",
    whereFound: "Colosó, Chalán, Toluviejo y alrededores de Montes de María.",
    destinationSlugs: ["serrania-de-coraza", "montes-de-maria", "senderos-de-toluviejo"],
  },
  {
    slug: "bosques-de-manglar-san-onofre",
    kind: "ECOSYSTEM",
    groupKey: "bosques",
    commonName: "Bosques de manglar San Onofre",
    scientificName: null,
    summary:
      "Protegen la línea costera, sirven como hábitat de crianza para peces y crustáceos, y ayudan a reducir la erosión.",
    whereFound: "Humedales costeros, estuarios y zonas de manglar de San Onofre.",
    destinationSlugs: ["rincon-del-mar", "reserva-natural-sanguare"],
  },
  {
    slug: "bosques-de-corcho",
    kind: "ECOSYSTEM",
    groupKey: "bosques",
    commonName: "Bosques de corcho",
    scientificName: null,
    summary:
      "Estos bosques conviven con manglares, raicero y ciénagas, y proporcionan refugio a la fauna silvestre.",
    whereFound:
      "San Onofre, especialmente en los alrededores de San Antonio, Labarco y Bocacerrada.",
    destinationSlugs: [],
  },
  {
    slug: "bosques-y-vegetacion-de-sanguare",
    kind: "ECOSYSTEM",
    groupKey: "bosques",
    commonName: "Bosques y vegetación de Sanguaré",
    scientificName: null,
    summary:
      "El mosaico de bosque seco, manglares y vegetación costera sostiene la vida silvestre y conecta los ecosistemas terrestres y marinos.",
    whereFound: "San Onofre, Reserva Natural Sanguaré.",
    destinationSlugs: ["reserva-natural-sanguare"],
  },
  {
    slug: "ceiba",
    kind: "FLORA",
    groupKey: "flora",
    commonName: "Ceiba",
    scientificName: "Ceiba trichistandra",
    summary: "Da sombra, alberga fauna y ayuda a mantener el equilibrio del ecosistema.",
    whereFound: "En bosques secos y zonas rurales de Sucre.",
    destinationSlugs: [],
  },
  {
    slug: "guayacan",
    kind: "FLORA",
    groupKey: "flora",
    commonName: "Guayacán",
    scientificName: "Handroanthus chrysanthus",
    summary:
      "Aporta belleza al paisaje, atrae polinizadores y contribuye a la conservación del suelo.",
    whereFound:
      "En bosques secos y zonas de transición, especialmente en San Onofre y Los Palmitos.",
    destinationSlugs: [],
  },
  {
    slug: "palma-de-corozo",
    kind: "FLORA",
    groupKey: "flora",
    commonName: "Palma de corozo",
    scientificName: "Acrocomia aculeata",
    summary:
      "Sus frutos alimentan a varias especies y sus hojas se usan en la artesanía y la cultura local.",
    whereFound: "En bosques secos, sabanas y zonas rurales de Sucre.",
    destinationSlugs: [],
  },
  {
    slug: "orquidea-del-caribe",
    kind: "FLORA",
    groupKey: "flora",
    commonName: "Orquídea del Caribe",
    scientificName: "Cattleya trianae",
    summary:
      "Es símbolo de biodiversidad y atrae polinizadores, además de tener gran valor cultural y ornamental.",
    whereFound: "En bosques húmedos y zonas de montaña de Sucre.",
    destinationSlugs: [],
  },
  {
    slug: "manglares-rhizophora-mangle",
    kind: "FLORA",
    groupKey: "flora",
    commonName: "Manglares",
    scientificName: "Rhizophora mangle",
    summary:
      "Protegen la costa, evitan la erosión y son hogar de muchas especies marinas y terrestres.",
    whereFound: "En la franja costera de Coveñas, Rincón del Mar y San Antero.",
    destinationSlugs: ["rincon-del-mar", "cienaga-la-caimanera"],
  },
];

export const SEED_EXPERIENCES: SeedExperience[] = [
  {
    slug: "senderismo-y-trekking",
    title: "Senderismo y trekking",
    tagline: "Camina por paisajes únicos y vive la naturaleza de Sucre",
    whereText:
      "Serranía de Coraza (Colosó, Chalán y Toluviejo); Montes de María; Senderos de Toluviejo y La Piche; Reserva Natural Sanguaré – San Onofre",
    whatYouDo: [
      "Caminatas por bosque seco tropical",
      "Ascensos y recorridos por montañas y miradores",
      "Cascadas, arroyos y paisajes rurales",
      "Observación de fauna y flora durante el recorrido",
    ],
    specialWhy:
      "Te permite conectar con la belleza natural de Sucre, disfrutar de paisajes impresionantes y descubrir la riqueza cultural y biodiversidad de la región.",
    recommendations: [
      "Usa ropa y calzado cómodo.",
      "Lleva agua, protección solar y gorra.",
      "Respeta la fauna, flora y el entorno.",
      "Infórmate sobre el nivel de dificultad de cada ruta.",
    ],
    destinationSlugs: [
      "serrania-de-coraza",
      "montes-de-maria",
      "senderos-de-toluviejo",
      "reserva-natural-sanguare",
    ],
  },
  {
    slug: "avistamiento-de-aves",
    title: "Avistamiento de aves",
    tagline: "Colores, sonidos y vida en cada rincón de Sucre",
    whereText:
      "Reserva Natural Sanguaré; Ciénaga de La Caimanera; Montes de María y bosques secos; zonas rurales de Toluviejo, Colosó y Chalán",
    whatYouDo: [
      "Observar aves residentes y migratorias",
      "Conocer sus hábitats naturales",
      "Fotografiar especies únicas",
      "Aprender sobre la importancia de su conservación",
    ],
    specialWhy:
      "Sucre es un paraíso para los amantes de las aves: manglares, ciénagas, bosques secos y zonas rurales llenos de vida.",
    recommendations: [
      "Lleva binoculares y cámara.",
      "Usa ropa cómoda y de colores neutrales.",
      "Mantén silencio y respeto por la fauna.",
      "Visita con guías locales.",
    ],
    destinationSlugs: [
      "reserva-natural-sanguare",
      "cienaga-la-caimanera",
      "montes-de-maria",
      "senderos-de-toluviejo",
      "serrania-de-coraza",
    ],
  },
  {
    slug: "navegacion-cienagas-y-manglares",
    title: "Navegación por las ciénagas y manglares",
    tagline: "Naturaleza que se vive desde el agua",
    whereText: "Ciénaga de La Caimanera y otros humedales costeros.",
    whatYouDo: [
      "Recorre manglares y ciénagas",
      "Observa aves y fauna",
      "Disfruta la tranquilidad del entorno",
    ],
    specialWhy: "Conecta con la riqueza natural de los manglares y la vida silvestre del Caribe.",
    recommendations: [
      "Ropa cómoda y ligera.",
      "Protección solar.",
      "Repelente de insectos.",
      "Respeta la fauna y el entorno.",
    ],
    destinationSlugs: ["cienaga-la-caimanera"],
  },
  {
    slug: "buceo-y-careteo",
    title: "Buceo y careteo",
    tagline: "Un mundo de color bajo el mar",
    whereText: "Archipiélago de San Bernardo (Parques Nacionales Naturales).",
    whatYouDo: [
      "Explorar arrecifes de coral",
      "Observar peces de colores y vida marina",
      "Disfrutar de aguas cristalinas y paisajes únicos",
    ],
    specialWhy:
      "Sus aguas cálidas y cristalinas, los arrecifes de coral y la gran biodiversidad marina hacen de esta experiencia algo inolvidable.",
    recommendations: [
      "Usa chaleco salvavidas y equipo adecuado.",
      "Respeta la vida marina y los corales.",
      "Lleva protector solar biodegradable.",
    ],
    destinationSlugs: [],
  },
  {
    slug: "espeleologia-cavernas-de-toluviejo",
    title: "Espeleología · Cavernas de Toluviejo",
    tagline: "Explora el mundo bajo tierra",
    whereText: "Toluviejo, Sucre. Las cavernas se encuentran cerca de la plaza principal.",
    whatYouDo: [
      "Recorridos guiados",
      "Exploración de cavernas",
      "Observación de formaciones rocosas",
      "Interpretación de la naturaleza",
    ],
    specialWhy:
      "Protege un patrimonio geológico y natural, permite conocer la formación de las rocas y fortalece el ecoturismo local.",
    recommendations: ["Explora con guía, no toques las formaciones y respeta la fauna."],
    destinationSlugs: ["cavernas-de-toluviejo"],
  },
  {
    slug: "naturaleza-nocturna",
    title: "Naturaleza nocturna",
    tagline: "Otro mundo, la misma naturaleza",
    whereText:
      "Principalmente en la Reserva Natural Sanguaré y en otros humedales del departamento.",
    whatYouDo: [
      "Observar el plancton bioluminiscente en la laguna de Sanguaré",
      "Escuchar los sonidos de la fauna nocturna",
      "Disfrutar el cielo estrellado",
    ],
    specialWhy:
      "Permite valorar y conservar los ecosistemas, fomenta el turismo sostenible y genera conciencia sobre la riqueza natural de Sucre.",
    recommendations: [
      "Lleva ropa cómoda y ligera.",
      "Usa repelente de insectos.",
      "Lleva linterna o luz frontal.",
      "Respeta la fauna y el entorno.",
    ],
    destinationSlugs: ["reserva-natural-sanguare"],
  },
];

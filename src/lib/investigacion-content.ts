/**
 * Contenido de la landing pública del proyecto de investigación (/investigacion).
 * Fuente: Anexo 2 «Investigación en curso» (RedCOLSI, nodo Sucre) y la guía de póster del
 * XIII Encuentro Nacional de Semilleros CUN 2026-2. Es contenido editorial estático: si cambian
 * las cifras del informe, se actualizan aquí y no en los componentes.
 */

export const RESEARCH_META = {
  title: "Sucre Vivo",
  subtitle:
    "Plataforma digital con inteligencia artificial para la promoción del patrimonio cultural y turístico del departamento de Sucre",
  category: "Investigación en curso",
  institution: "Corporación Unificada Nacional de Educación Superior (CUN)",
  seedbed: "Semillero Investigación y Gestión Microempresarial",
  program: "Ingeniería de Sistemas",
  node: "Nodo Sucre · RedCOLSI",
  area: "Ingenierías",
  authors: ["Sergio Veloza González", "Erika Astrid Araque Geney"],
  speaker: "Sergio Veloza González",
  event: {
    name: "XIII Encuentro Nacional de Semilleros de Investigación CUN 2026-2",
    motto: "Praxis investigativa: Convergencia de Saberes para la Innovación y el Desarrollo",
    dateLabel: "17 de noviembre de 2026",
    modality: "Ponencia virtual",
  },
} as const;

export const RESEARCH_SECTIONS = [
  { id: "contexto", label: "Contexto", number: "01" },
  { id: "objetivos", label: "Objetivos", number: "02" },
  { id: "metodologia", label: "Metodología", number: "03" },
  { id: "hallazgos", label: "Hallazgos", number: "04" },
  { id: "beneficios", label: "Beneficios", number: "05" },
  { id: "proyeccion", label: "Proyección", number: "06" },
  { id: "tecnologias", label: "Tecnologías", number: "07" },
] as const;

export type ResearchSectionId = (typeof RESEARCH_SECTIONS)[number]["id"];

/* ---------- 01 · Contexto ---------- */

export const CONTEXT_STATS = {
  hotelOccupancy: { sucre: 42.9, national: 56.9, period: "noviembre de 2023" },
  ictrc: { rank: 25, total: 32, year: 2020 },
  internalTourism: { overnight: 13300, sameDay: 22300, year: 2022 },
  foreignVisitorsShare: "< 0,1 %",
  lodgingConstructionChange: -62.2,
  lodgingIncomeChange: -3.6,
  lodgingEmploymentChange: 3.8,
} as const;

export const ICTRC_STRENGTHS = [
  "Festividades, gastronomía y cultura local",
  "Estrategias de mercadeo turístico",
  "Amplias áreas naturales con potencial ecoturístico",
] as const;

export const ICTRC_WEAKNESSES = [
  "Cero categorizaciones hoteleras y cero certificaciones",
  "Baja inversión pública en turismo",
  "Formación y capital humano limitado en turismo",
  "Conectividad aérea limitada",
] as const;

export const DIGITAL_GAP = [
  {
    title: "Adopción digital baja",
    text: "Pequeños y medianos empresarios sin herramientas para promocionar, reservar y atender al viajero moderno.",
  },
  {
    title: "Oferta dispersa",
    text: "Información cultural y turística fragmentada, sin un lugar común para consultarla.",
  },
  {
    title: "Saberes en riesgo",
    text: "Tradiciones que viven en la oralidad y pueden perderse con el relevo generacional.",
  },
  {
    title: "Presencia en línea limitada",
    text: "Pocos pagos digitales, conectividad irregular y habilidades digitales por fortalecer.",
  },
] as const;

export const CONTEXT_SOURCES = [
  "MinCIT (2024). Perfiles Económicos Departamentales: Sucre",
  "COTELCO (2020). Índice de Competitividad Turística Regional de Colombia",
  "Alcaldía de Sincelejo. Plan Sectorial de Turismo 2023-2025",
  "Comisión Regional de Competitividad e Innovación Sucre (2022). Boletín N.° 10",
] as const;

/* ---------- 02 · Objetivos ---------- */

export const GENERAL_OBJECTIVE =
  "Implementar una plataforma digital inteligente, con herramientas de inteligencia artificial, para centralizar, organizar y promover la oferta cultural y turística del departamento de Sucre, facilitando el acceso y la apropiación social del patrimonio territorial por parte de ciudadanos, visitantes y actores del ecosistema cultural y turístico.";

export type ObjectiveStatus = "logrado" | "en-curso" | "proximo";

export const SPECIFIC_OBJECTIVES: {
  verb: string;
  text: string;
  status: ObjectiveStatus;
  evidence: string;
}[] = [
  {
    verb: "Caracterizar",
    text: "Las brechas de acceso, sistematización y apropiación social de la oferta cultural y turística de Sucre, a partir del análisis territorial, tecnológico y de los actores del ecosistema.",
    status: "logrado",
    evidence:
      "Encuesta estructurada y entrevistas semiestructuradas aplicadas; resultados triangulados en nueve dimensiones.",
  },
  {
    verb: "Diseñar",
    text: "Una plataforma digital inteligente que incorpore inteligencia artificial para la centralización, organización, consulta y promoción de la oferta cultural y turística.",
    status: "en-curso",
    evidence:
      "Requerimientos funcionales y no funcionales definidos; prototipo publicado en sucrevivo.com con agente de IA y panel de administración.",
  },
  {
    verb: "Evaluar",
    text: "El uso, la satisfacción y el nivel de apropiación de la plataforma mediante indicadores de interacción, participación, visibilidad y acceso a la oferta territorial.",
    status: "proximo",
    evidence:
      "Indicadores definidos; la medición se hará con usuarios reales tras las pruebas de usabilidad.",
  },
];

/* ---------- 03 · Metodología ---------- */

export const MUNICIPALITIES = ["Sincelejo", "Tolú", "Coveñas", "Sampués", "Morroa"] as const;

export const ACTOR_SECTORS = [
  "Artesanos",
  "Sabedores",
  "Sector hotelero",
  "Restaurantes de comida tradicional",
  "Organizadores de festividades",
  "Agencias de viajes",
] as const;

export const SAMPLE_PER_SECTOR = 5;

export const INSTRUMENTS = [
  {
    title: "Encuesta estructurada",
    kind: "Cuantitativo",
    text: "Escala de 1 a 5 sobre infraestructura digital, patrimonio cultural y disposición hacia la IA.",
  },
  {
    title: "Entrevista semiestructurada",
    kind: "Cualitativo",
    text: "Sabedores culturales, gestores turísticos, autoridades locales, operadores y líderes comunitarios.",
  },
] as const;

export const RESEARCH_PHASES: {
  name: string;
  title: string;
  steps: string[];
  status: ObjectiveStatus;
}[] = [
  {
    name: "Fase 1",
    title: "Caracterización",
    steps: [
      "Recolección de información territorial y tecnológica",
      "Encuesta y entrevistas a actores",
      "Análisis de brechas y triangulación",
    ],
    status: "logrado",
  },
  {
    name: "Fase 2",
    title: "Prototipo",
    steps: [
      "Elaboración del prototipo",
      "Integración de contenidos digitales",
      "Pruebas de usabilidad con usuarios reales",
      "Ajustes funcionales, validación final e informe técnico",
    ],
    status: "en-curso",
  },
  {
    name: "Fase 3",
    title: "Evaluación",
    steps: [
      "Indicadores de uso y satisfacción",
      "Nivel de apropiación y visibilidad",
      "Mejora continua basada en datos",
    ],
    status: "proximo",
  },
];

export const DATA_GOVERNANCE = [
  {
    title: "Minimización y finalidad",
    text: "Solo los datos estrictamente necesarios, usados con fines culturales, académicos y de promoción del turismo sostenible.",
  },
  {
    title: "Consentimiento y transparencia",
    text: "Consentimiento informado y reconocimiento de fuentes cuando la información proviene de comunidades o actores locales.",
  },
  {
    title: "Calidad y validación",
    text: "Fuentes confiables y verificación comunitaria para evitar sesgos, desactualización o apropiación indebida de saberes.",
  },
  {
    title: "Uso ético y supervisión humana de la IA",
    text: "La IA apoya la difusión del conocimiento; no sustituye el saber comunitario. Sus contenidos se revisan.",
  },
  {
    title: "Seguridad y acceso controlado",
    text: "Protección y control de acceso a la información almacenada, con integridad y trazabilidad de los datos.",
  },
] as const;

/* ---------- 04 · Hallazgos ---------- */

export const SURVEY_DIMENSIONS = [
  { label: "Patrimonio cultural", score: 3.04, note: "Promedio más bajo del instrumento" },
  { label: "Infraestructura digital", score: 3.49, note: "Nivel moderado" },
  { label: "Disposición hacia la IA", score: 4.26, note: "Promedio más alto" },
] as const;

export type IndicatorGroup = "condiciones" | "disposicion";

export const SURVEY_INDICATORS: { label: string; value: number; group: IndicatorGroup }[] = [
  {
    label: "Considera necesaria la digitalización de los saberes",
    value: 93,
    group: "disposicion",
  },
  { label: "Confía en la tecnología para el turismo sostenible", value: 93, group: "disposicion" },
  { label: "Participaría en la validación comunitaria de la app", value: 93, group: "disposicion" },
  { label: "Usa herramientas digitales para promocionarse", value: 69.4, group: "condiciones" },
  { label: "Percibe apoyo institucional para usar tecnología", value: 39.3, group: "condiciones" },
  { label: "Percibe articulación digital entre actores", value: 24.1, group: "condiciones" },
  { label: "Saberes y tradiciones formalmente documentados", value: 23, group: "condiciones" },
  { label: "Participa en la recopilación del patrimonio", value: 15.4, group: "condiciones" },
];

export const TRIANGULATION: {
  dimension: string;
  quantitative: string;
  qualitative: string;
  interpretation: string;
  implication: string;
}[] = [
  {
    dimension: "Digitalización de la oferta",
    quantitative: "69,4 % usa herramientas digitales para promocionar sus actividades.",
    qualitative: "Uso de redes y herramientas digitales, pero individual y fragmentado.",
    interpretation: "Hay apropiación inicial, pero no una estrategia articulada de promoción.",
    implication: "Centralizar la oferta cultural y turística en una plataforma común.",
  },
  {
    dimension: "Articulación entre actores",
    quantitative: "Solo 24,1 % percibe articulación de los actores por medios digitales.",
    qualitative: "Dificultad para conectar actores y promocionar la oferta en conjunto.",
    interpretation: "La baja articulación es una de las principales brechas del ecosistema.",
    implication: "Directorio de actores, perfiles y mecanismos de conexión territorial.",
  },
  {
    dimension: "Apoyo institucional",
    quantitative: "Solo 39,3 % percibe apoyo institucional para el uso de tecnología.",
    qualitative: "Se menciona la ausencia o insuficiencia de acompañamiento institucional.",
    interpretation: "La transformación digital requiere acompañamiento, no solo infraestructura.",
    implication: "Contenidos de orientación, capacitación y articulación institucional.",
  },
  {
    dimension: "Documentación del patrimonio",
    quantitative: "Solo 23 % considera que los saberes están formalmente documentados.",
    qualitative: "Predomina la transmisión oral e intergeneracional.",
    interpretation: "Oportunidad para fortalecer la documentación y preservación digital.",
    implication: "Módulo de memoria cultural con contenidos autorizados.",
  },
  {
    dimension: "Participación en documentación",
    quantitative: "Solo 15,4 % participa activamente en la recopilación del patrimonio.",
    qualitative: "Se reconoce la necesidad de preservar, pero hay límites para documentar.",
    interpretation: "La participación comunitaria en la sistematización aún es limitada.",
    implication: "Mecanismos de participación y validación comunitaria de contenidos.",
  },
  {
    dimension: "Disposición hacia la digitalización",
    quantitative: "93 % considera necesaria la digitalización de los saberes.",
    qualitative: "Todos los entrevistados valoran preservar y difundir con tecnología.",
    interpretation: "Alta disposición a la transformación digital pese a las brechas.",
    implication: "La plataforma cuenta con condiciones favorables de aceptación.",
  },
  {
    dimension: "IA y turismo sostenible",
    quantitative: "93 % confía en la tecnología para fortalecer el turismo sostenible.",
    qualitative: "ChatGPT y Gemini, conocidos sobre todo por actores con más experiencia.",
    interpretation: "Percepción favorable de la IA, con apropiación desigual.",
    implication: "IA accesible y explicable para consulta, recomendación y organización.",
  },
  {
    dimension: "Validación comunitaria",
    quantitative: "93 % participaría en la validación de una aplicación turística.",
    qualitative: "Se exige respeto por la identidad, la autoría y la autenticidad cultural.",
    interpretation: "La participación de la comunidad es condición de legitimidad.",
    implication: "Validación participativa antes y durante la implementación.",
  },
  {
    dimension: "Protección cultural",
    quantitative: "Baja documentación formal del patrimonio.",
    qualitative: "Riesgos de apropiación indebida, folclorización y alteración de tradiciones.",
    interpretation: "La digitalización debe proteger y reconocer los saberes.",
    implication: "Autoría, consentimiento, procedencia y criterios de publicación.",
  },
];

export const QUALITATIVE_CATEGORIES = [
  {
    id: "estado",
    title: "Estado del turismo cultural",
    text: "Oferta con potencial en artesanías, tradiciones, gastronomía y saberes ancestrales, pero con límites de inversión y promoción. Sincelejo se ve como articulador y Morroa destaca por su riqueza artesanal.",
    quotes: ["Tomando fuerza", "Regular", "Mejorando, pero falta inversión"],
  },
  {
    id: "limitaciones",
    title: "Limitaciones para la difusión",
    text: "Barreras económicas, tecnológicas, formativas e institucionales: pocos recursos para promoción, conectividad rural irregular y poco acompañamiento.",
    quotes: ["Recursos limitados", "Conectividad rural", "Formación digital"],
  },
  {
    id: "saberes",
    title: "Transmisión y digitalización de saberes",
    text: "La oralidad intergeneracional predomina. La digitalización se valora, con preocupación por la apropiación indebida, la pérdida de autenticidad y la folclorización.",
    quotes: ["Oralidad", "Autenticidad", "Reconocimiento de autoría"],
  },
  {
    id: "ia",
    title: "Conocimiento y uso de la IA",
    text: "ChatGPT y Gemini son las herramientas más mencionadas. Algunos sabedores conocen poco la IA, pero están dispuestos a aprender: hace falta formación y acompañamiento.",
    quotes: ["ChatGPT", "Gemini", "Disposición a aprender"],
  },
  {
    id: "expectativas",
    title: "Expectativas frente a la plataforma",
    text: "Fácil de usar, visual, con geolocalización, eventos, historias, directorio de actores y varios idiomas, y que represente con respeto la identidad del territorio.",
    quotes: ["Fácil de usar", "Mapa", "Varios idiomas"],
  },
] as const;

export const REQUIREMENT_COUNTS = { functional: 14, nonFunctional: 10 } as const;

export const PROTOTYPE_MODULES = [
  {
    title: "Banner principal",
    text: "Fotografía y video del territorio con acceso directo al asistente.",
    href: "/#hero",
  },
  {
    title: "Agente con IA",
    text: "Asistente conversacional conectado a n8n que orienta sobre destinos, actividades y eventos.",
    href: "/#hero",
  },
  {
    title: "Destinos imperdibles",
    text: "Fichas con descripción, ubicación y atractivos de cada destino.",
    href: "/#imperdibles",
  },
  {
    title: "Qué hacer",
    text: "Actividades culturales y de naturaleza organizadas por tema.",
    href: "/#que-hacer",
  },
  {
    title: "Agenda cultural",
    text: "Eventos por mes con fecha, lugar y opción de agregarlos al calendario.",
    href: "/#agenda-cultural",
  },
  {
    title: "Sucre Natural",
    text: "Fichas interactivas de playas, ciénagas, ríos, paisajes y biodiversidad.",
    href: "/sucre-natural",
  },
  {
    title: "Convocatorias",
    text: "Oportunidades culturales y turísticas abiertas en el departamento.",
    href: "/#convocatorias",
  },
  {
    title: "Panel de administración",
    text: "Gestión de contenidos, publicación y roles para el equipo editorial.",
    href: null,
  },
] as const;

/* ---------- 05 · Beneficios ---------- */

export const BENEFITS = [
  {
    id: "academia",
    audience: "Comunidad académica",
    headline: "Conocimiento interdisciplinario con evidencia del territorio",
    items: [
      "Cruza cultura, turismo, gestión del patrimonio y tecnologías emergentes.",
      "Metodología mixta y triangulación replicables en otros departamentos.",
      "Evidencia para futuras investigaciones y políticas públicas de transformación digital cultural.",
      "Formación de semilleristas en IA aplicada, desarrollo web y gobernanza de datos.",
    ],
  },
  {
    id: "productivo",
    audience: "Sector productivo",
    headline: "Visibilidad para quienes hacen el turismo de Sucre",
    items: [
      "Vitrina común para artesanos, hoteles, restaurantes, agencias y organizadores de festividades.",
      "Promoción de destinos, actividades y eventos sin depender solo de redes individuales.",
      "Reducción de la brecha digital con herramientas accesibles y acompañamiento.",
      "Dinamización de economías locales y del turismo con pernoctación.",
    ],
  },
  {
    id: "sociedad",
    audience: "Sociedad",
    headline: "Patrimonio vivo, accesible y protegido",
    items: [
      "Preservación de saberes tradicionales que hoy dependen de la oralidad.",
      "Consulta abierta, en cualquier momento, con un asistente de IA en lenguaje natural.",
      "Participación comunitaria en la construcción y validación de contenidos.",
      "Turismo cultural responsable que respeta la identidad del territorio.",
    ],
  },
] as const;

/* ---------- 06 · Proyección ---------- */

export type RequirementStatus = "hecho" | "en-progreso" | "pendiente";

export const FUNCTIONAL_REQUIREMENTS: {
  need: string;
  feature: string;
  status: RequirementStatus;
}[] = [
  { need: "Oferta dispersa", feature: "Directorio cultural y turístico", status: "en-progreso" },
  { need: "Baja articulación entre actores", feature: "Perfiles de actores", status: "pendiente" },
  {
    need: "Escasa documentación de saberes",
    feature: "Memoria cultural digital",
    status: "pendiente",
  },
  {
    need: "Riesgo de apropiación indebida",
    feature: "Ficha de autoría y procedencia",
    status: "pendiente",
  },
  { need: "Necesidad de visibilidad", feature: "Catálogo de oferta territorial", status: "hecho" },
  {
    need: "Desconocimiento de actividades",
    feature: "Agenda cultural y turística",
    status: "hecho",
  },
  { need: "Dificultad para localizar actores", feature: "Mapa interactivo", status: "en-progreso" },
  { need: "Contenidos visuales", feature: "Galería multimedia", status: "hecho" },
  { need: "Barreras de apropiación", feature: "Módulo de formación digital", status: "pendiente" },
  { need: "Consulta personalizada", feature: "Asistente con IA", status: "hecho" },
  { need: "Diferencias lingüísticas", feature: "Contenido multilingüe", status: "pendiente" },
  {
    need: "Necesidad de participación",
    feature: "Participación comunitaria",
    status: "pendiente",
  },
  { need: "Información sin sistematizar", feature: "Panel de administración", status: "hecho" },
  { need: "Evaluar resultados", feature: "Panel de indicadores", status: "pendiente" },
];

export const ROADMAP_STAGES = [
  {
    title: "Actores, patrimonio y mapa",
    items: [
      "Directorio de actores del territorio",
      "Memoria cultural con ficha de autoría",
      "Validación comunitaria de contenidos",
      "Mapa unificado con geolocalización",
    ],
  },
  {
    title: "Viaje planificado",
    items: ["Rutas e itinerarios por municipio", "«Mi viaje»: favoritos y calendario"],
  },
  {
    title: "Agente más inteligente",
    items: [
      "Base de conocimiento (RAG) con fichas y saberes",
      "Respuestas con mapas y tarjetas",
      "Transparencia y supervisión humana de la IA",
    ],
  },
  {
    title: "Acceso, formación y evaluación",
    items: [
      "Sitio y asistente en español e inglés",
      "Formación digital para actores",
      "Accesibilidad WCAG 2.2 AA",
      "Panel de indicadores de uso y apropiación",
    ],
  },
] as const;

export const EVALUATION_INDICATORS = [
  { title: "Uso", text: "Visitas, consultas al asistente y contenidos explorados." },
  { title: "Satisfacción", text: "Percepción de ciudadanos, visitantes y actores." },
  { title: "Apropiación", text: "Actores que publican, validan y actualizan su oferta." },
  { title: "Visibilidad", text: "Alcance de destinos, eventos y saberes del territorio." },
] as const;

/* ---------- 07 · Tecnologías ---------- */

export const REPOSITORY_URL = "https://github.com/velosergio/descubresucre";

export type TechCategory = "frontend" | "backend" | "ia" | "calidad" | "infraestructura";

export const TECH_CATEGORIES: { value: TechCategory; label: string }[] = [
  { value: "frontend", label: "Interfaz" },
  { value: "backend", label: "Servidor y datos" },
  { value: "ia", label: "Inteligencia artificial" },
  { value: "calidad", label: "Calidad" },
  { value: "infraestructura", label: "Infraestructura" },
];

/**
 * `icon` es la clave de un logo de marca (tech-icons.ts); las tecnologías sin logo
 * disponible usan un icono genérico que resuelve el componente por `id`.
 */
export const TECH_STACK: {
  id: string;
  name: string;
  category: TechCategory;
  role: string;
  icon: string | null;
}[] = [
  {
    id: "nextjs",
    name: "Next.js 16",
    category: "frontend",
    role: "App Router con Server Components: páginas públicas y panel en un mismo proyecto.",
    icon: "nextjs",
  },
  {
    id: "react",
    name: "React 19",
    category: "frontend",
    role: "Componentes de la interfaz, del asistente y del panel de administración.",
    icon: "react",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    role: "Tipado de punta a punta, del esquema de datos a los componentes.",
    icon: "typescript",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS 4",
    category: "frontend",
    role: "Sistema visual con tokens de color y tipografía propios de Sucre Vivo.",
    icon: "tailwind",
  },
  {
    id: "shadcn",
    name: "shadcn/ui + Radix",
    category: "frontend",
    role: "Primitivas accesibles: diálogos, pestañas, acordeones y formularios.",
    icon: "shadcn",
  },
  {
    id: "motion",
    name: "Framer Motion",
    category: "frontend",
    role: "Animaciones de entrada e infografías como las de esta página.",
    icon: null,
  },
  {
    id: "googlemaps",
    name: "Google Maps",
    category: "frontend",
    role: "Mapa interactivo de destinos del departamento.",
    icon: "googlemaps",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    role: "Entorno de ejecución del servidor Next.js.",
    icon: "nodejs",
  },
  {
    id: "prisma",
    name: "Prisma 7",
    category: "backend",
    role: "ORM tipado y migraciones versionadas del modelo de datos.",
    icon: "prisma",
  },
  {
    id: "mariadb",
    name: "MariaDB / MySQL",
    category: "backend",
    role: "Base de datos relacional de contenidos, usuarios y conversaciones.",
    icon: "mariadb",
  },
  {
    id: "authjs",
    name: "Auth.js",
    category: "backend",
    role: "Sesiones con correo o Google; roles admin y editor con aprobación previa.",
    icon: null,
  },
  {
    id: "zod",
    name: "Zod",
    category: "backend",
    role: "Validación de toda entrada externa: formularios, API y webhooks.",
    icon: "zod",
  },
  {
    id: "sharp",
    name: "sharp",
    category: "backend",
    role: "Optimiza las imágenes subidas y las convierte a WebP.",
    icon: "sharp",
  },
  {
    id: "n8n",
    name: "n8n",
    category: "ia",
    role: "Orquesta el asistente: recibe la conversación y devuelve la respuesta.",
    icon: "n8n",
  },
  {
    id: "langchain",
    name: "Agente LangChain",
    category: "ia",
    role: "Nodo AI Agent de n8n que arma el contexto y conversa con el modelo.",
    icon: "langchain",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    category: "ia",
    role: "Modelo de lenguaje que redacta las respuestas del asistente.",
    icon: "gemini",
  },
  {
    id: "vitest",
    name: "Vitest",
    category: "calidad",
    role: "Pruebas unitarias, de integración (con base de datos real) y de componentes.",
    icon: "vitest",
  },
  {
    id: "testinglibrary",
    name: "Testing Library",
    category: "calidad",
    role: "Prueba la interfaz como la usa una persona: por roles y textos.",
    icon: "testinglibrary",
  },
  {
    id: "playwright",
    name: "Playwright",
    category: "calidad",
    role: "Pruebas de punta a punta de los flujos críticos en un navegador real.",
    icon: null,
  },
  {
    id: "biome",
    name: "Biome",
    category: "calidad",
    role: "Lint y formato en un solo paso, verificado en cada cambio.",
    icon: "biome",
  },
  {
    id: "docker",
    name: "Docker",
    category: "infraestructura",
    role: "Imagen multi-etapa con salida standalone de Next.js.",
    icon: "docker",
  },
  {
    id: "easypanel",
    name: "EasyPanel",
    category: "infraestructura",
    role: "Despliegue del contenedor en producción.",
    icon: null,
  },
  {
    id: "githubactions",
    name: "GitHub Actions",
    category: "infraestructura",
    role: "Integración continua: lint, pruebas y E2E en cada pull request.",
    icon: "githubactions",
  },
  {
    id: "github",
    name: "GitHub",
    category: "infraestructura",
    role: "Repositorio público, revisiones y control de versiones.",
    icon: "github",
  },
];

export type ArchitectureNodeId =
  | "navegador"
  | "next"
  | "auth"
  | "datos"
  | "medios"
  | "n8n"
  | "gemini";

export const ARCHITECTURE_LAYERS: {
  label: string;
  nodes: { id: ArchitectureNodeId; title: string; tech: string; detail: string[] }[];
}[] = [
  {
    label: "Cliente",
    nodes: [
      {
        id: "navegador",
        title: "Visitantes y equipo",
        tech: "Navegador",
        detail: [
          "Las páginas públicas llegan ya renderizadas desde el servidor: cargan rápido y se indexan bien.",
          "El panel /admin permite al equipo editar el hero, la galería, destinos, actividades, eventos y convocatorias sin tocar código.",
          "El asistente conversacional consulta el estado de cada respuesta hasta que está lista.",
        ],
      },
    ],
  },
  {
    label: "Servidor",
    nodes: [
      {
        id: "next",
        title: "Aplicación Next.js",
        tech: "Next.js · React · TypeScript",
        detail: [
          "Server Components para leer datos y server actions para guardarlos, con un contrato { ok, error } que nunca lanza excepciones al cliente.",
          "Rutas API para el asistente (/api/chat) y para servir medios (/api/media).",
          "Toda entrada se valida con Zod antes de llegar a la base de datos.",
        ],
      },
      {
        id: "auth",
        title: "Autenticación y roles",
        tech: "Auth.js",
        detail: [
          "Tres puertas: un filtro de sesión en el proxy, la autorización real en los layouts y una verificación explícita en cada server action.",
          "Roles admin y editor; toda cuenta nueva, incluso con Google, queda pendiente hasta que un administrador la aprueba.",
        ],
      },
    ],
  },
  {
    label: "Datos y servicios",
    nodes: [
      {
        id: "datos",
        title: "Base de datos",
        tech: "Prisma · MariaDB",
        detail: [
          "Modelo relacional con migraciones versionadas en el repositorio.",
          "La configuración editable (hero, destinos imperdibles, asistente) vive en filas únicas que se actualizan sin despliegues.",
          "Cada pregunta al asistente queda registrada como un trabajo con su estado.",
        ],
      },
      {
        id: "medios",
        title: "Medios",
        tech: "Disco local · sharp",
        detail: [
          "Las imágenes subidas se transcodifican a WebP y los videos se guardan tal cual.",
          "Cada ruta de archivo se valida contra un prefijo esperado y se rechaza cualquier intento de salir de la carpeta.",
        ],
      },
      {
        id: "n8n",
        title: "Orquestador del asistente",
        tech: "n8n · agente LangChain",
        detail: [
          "Recibe la conversación por webhook; su URL vive en el servidor y nunca llega al navegador.",
          "Responde de inmediato y entrega la respuesta después por un callback autenticado con un secreto compartido.",
        ],
      },
      {
        id: "gemini",
        title: "Modelo de lenguaje",
        tech: "Google Gemini",
        detail: [
          "Redacta las respuestas del asistente a partir de la conversación y del contexto turístico de Sucre.",
        ],
      },
    ],
  },
];

export const CHAT_FLOW_STEPS = [
  { actor: "Navegador", text: "Envía la conversación a /api/chat." },
  { actor: "Servidor", text: "Valida, registra el trabajo como pendiente y avisa a n8n." },
  { actor: "n8n", text: "Responde al instante y le pasa la pregunta a Gemini." },
  { actor: "n8n", text: "Devuelve la respuesta al servidor con un secreto compartido." },
  { actor: "Navegador", text: "Consulta el trabajo hasta que está listo y muestra la respuesta." },
] as const;

export const AI_TOOLS = [
  {
    id: "cursor",
    name: "Cursor",
    icon: "cursor",
    text: "Editor con agentes de IA. El proyecto versiona su configuración: skills, subagentes de diseño, un hook que se ejecuta antes de cada edición y el servidor MCP de Next.js.",
  },
  {
    id: "claude",
    name: "Claude",
    icon: "claude",
    text: "Claude Code trabaja sobre el repositorio guiado por CLAUDE.md: implementa, ejecuta las pruebas, corrige el CI y abre pull requests. Esta misma página se construyó así.",
  },
] as const;

export const SDD_PHASES = [
  {
    id: "constitucion",
    title: "Constitución",
    artifact: "constitution.md",
    text: "Principios que no se negocian: pruebas proporcionales al riesgo, validación en todos los límites, secretos solo en variables de entorno y logs con contexto en las rutas críticas.",
  },
  {
    id: "especificar",
    title: "Especificar",
    artifact: "spec.md",
    text: "Qué se construye y por qué: historias de usuario, requisitos y criterios de aceptación, sin decidir todavía cómo.",
  },
  {
    id: "planificar",
    title: "Planificar",
    artifact: "plan.md · data-model.md",
    text: "Cómo se construye: decisiones técnicas, modelo de datos, contratos de API y verificación contra la constitución.",
  },
  {
    id: "tareas",
    title: "Tareas",
    artifact: "tasks.md",
    text: "El plan se divide en tareas pequeñas, ordenadas y comprobables, con sus pruebas.",
  },
  {
    id: "implementar",
    title: "Implementar",
    artifact: "código + pruebas",
    text: "El agente ejecuta las tareas una a una; cada cambio pasa por lint, pruebas y revisión antes de llegar a main.",
  },
] as const;

/** Funcionalidades documentadas en specs/NNN-nombre con el flujo de Spec Kit. */
export const SDD_SPECS = [
  "Asistente conversacional de turismo",
  "Altas y aprobación de cuentas staff",
  "Personalizar el banner del hero",
  "Galería de medios",
  "Destinos imperdibles (CMS)",
  "Fichas de destino Sucre Natural",
  "Actividades «Qué hacer en Sucre»",
  "Hubs temáticos de actividades",
  "Eventos y agenda cultural",
  "Convocatorias (CMS)",
] as const;

export type SkillGroup = "sdd" | "git" | "diseno" | "codigo" | "pruebas" | "integraciones";

export const SKILL_GROUPS: { value: SkillGroup; label: string }[] = [
  { value: "sdd", label: "Flujo SDD" },
  { value: "git", label: "Git" },
  { value: "diseno", label: "Diseño" },
  { value: "codigo", label: "Código" },
  { value: "pruebas", label: "Pruebas" },
  { value: "integraciones", label: "Integraciones" },
];

/** Skills versionadas en .claude/skills, .agents/skills y .cursor/skills. */
export const AGENT_SKILLS: { name: string; group: SkillGroup; text: string }[] = [
  {
    name: "speckit-constitution",
    group: "sdd",
    text: "Define y actualiza los principios del proyecto.",
  },
  {
    name: "speckit-specify",
    group: "sdd",
    text: "Redacta la especificación de una funcionalidad.",
  },
  {
    name: "speckit-clarify",
    group: "sdd",
    text: "Detecta ambigüedades y las resuelve con preguntas.",
  },
  { name: "speckit-plan", group: "sdd", text: "Genera el plan técnico y el modelo de datos." },
  { name: "speckit-tasks", group: "sdd", text: "Divide el plan en tareas ordenadas." },
  {
    name: "speckit-analyze",
    group: "sdd",
    text: "Revisa la coherencia entre spec, plan y tareas.",
  },
  { name: "speckit-checklist", group: "sdd", text: "Crea listas de verificación de calidad." },
  { name: "speckit-implement", group: "sdd", text: "Ejecuta las tareas de la implementación." },
  { name: "speckit-converge", group: "sdd", text: "Reconcilia el código con la especificación." },
  {
    name: "speckit-taskstoissues",
    group: "sdd",
    text: "Convierte las tareas en issues de GitHub.",
  },
  {
    name: "speckit-git-feature",
    group: "git",
    text: "Crea la rama numerada de cada funcionalidad.",
  },
  {
    name: "speckit-git-commit",
    group: "git",
    text: "Hace commit al terminar cada paso del flujo.",
  },
  { name: "speckit-git-validate", group: "git", text: "Valida el nombre de la rama de trabajo." },
  { name: "speckit-git-remote", group: "git", text: "Detecta el remoto de GitHub." },
  { name: "speckit-git-initialize", group: "git", text: "Inicializa el repositorio." },
  { name: "impeccable", group: "diseno", text: "Diseña, critica y pule la interfaz." },
  { name: "shadcn-ui", group: "diseno", text: "Instala y adapta componentes shadcn/ui." },
  {
    name: "tailwind-theme-builder",
    group: "diseno",
    text: "Construye el tema con tokens de Tailwind.",
  },
  {
    name: "nextjs-react-typescript",
    group: "codigo",
    text: "Buenas prácticas de Next.js, React y TypeScript.",
  },
  {
    name: "vercel-react-best-practices",
    group: "codigo",
    text: "Guías de rendimiento de React y Next.js.",
  },
  { name: "vitest", group: "pruebas", text: "Configura y escribe pruebas con Vitest." },
  {
    name: "n8n",
    group: "integraciones",
    text: "Documentación de n8n para el flujo del asistente.",
  },
];

export const TEST_LAYERS = [
  "Pruebas unitarias",
  "Pruebas de integración con base de datos real",
  "Pruebas de componentes",
  "Pruebas de punta a punta (E2E)",
] as const;

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

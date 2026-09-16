# Roadmap — Sucre Vivo

Huecos respecto al [Anexo 2](docs/Anexo%202%20Investigación%20en%20curso-%20Sergio.md) (requerimientos funcionales, expectativas de actores y objetivo de evaluación).

## Contenido CMS (hoy mock → admin)

- **Actividades** (“Qué hacer”): CRUD + categorías M-N + fotos (carrusel) + iconos Lucide; en home, slide si hay >5
- **Eventos + Agenda cultural**: unificar; CRUD; listado por mes con navegación; “Agregar a calendario” (Google / iOS)
- **[✅ Hecho] Destinos turísticos (Imperdibles)**: CRUD admin, tarjetas en home, detalle Markdown y coords. Pendiente: unir con “Qué hacer”, MapSection (aún mock) y las fichas Sucre Natural
- **Fichas de destino (Sucre Natural)**: páginas interactivas con la estética de `docs/fichas_destinos` (no PDFs estáticos). CMS estructurado: 30 segundos, qué lo hace especial, biodiversidad, vive el destino, turismo responsable, cómo llegar, mapa, galería. Cada ficha alimenta el CMS, el mapa y el RAG
- **Micrositios temáticos**: hubs Playas, Ciénagas, Ríos, Paisajes, Biodiversidad, Senderos y Experiencias en naturaleza; listan y filtran las fichas; paleta e iconos por tema
- **Mapa interactivo**: una sola fuente CMS (destinos + fichas + actores + eventos) con geolocalización; sin mocks
- **Convocatorias**: CRUD con enlaces externos
- **Footer**: quitar datos mock de la Gobernación / teléfonos

## Patrimonio y articulación

- **Directorio de actores**: perfiles públicos (artesanos, sabedores, hoteles, restaurantes, agencias, organizadores); municipio, contacto, rubro; conexión territorial
- **Memoria cultural**: repositorio público de historias, tradiciones y saberes con consentimiento; no sustituye al RAG (esto se consulta en el sitio; el RAG alimenta al agente)
- **Autoría y procedencia**: ficha en todo contenido cultural (autor, comunidad, fuente, consentimiento, fecha)
- **Validación comunitaria**: actores del territorio aprueban o rechazan contenidos patrimoniales (además del staff)

## Comunidad

- **Guías del territorio**: registro público + alta desde `/admin`; aprobación PENDING/APPROVED; solo aprobados visibles; el chatbot puede sugerirlos
- **Mi viaje / favoritos**: usuarios guardan destinos, actividades y eventos; lista personal (export calendario opcional)

## Agente y datos

- **Respuestas ricas**: mapas, cards de contacto, tickets, etc. (no solo texto)
- **Base de conocimiento (RAG)**: subir textos/descripciones → PGVector → n8n
- **Analytics del chatbot**: volumen, errores, latencia y temas frecuentes en admin
- **Transparencia de IA**: indicar cuándo responde el asistente; supervisión humana de contenidos generados o procesados por IA

## Oferta turística

- **Rutas e itinerarios**: CRUD día a día enlazando destinos/actividades; vista pública + mapa; sugeribles por el agente
- **Catálogo de biodiversidad**: fichas de fauna y flora (foto, nombre común/científico, hábitat, por qué importa) enlazadas a destinos; visibles en el micrositio Biodiversidad y en el RAG
- **Alcance territorial**: Sincelejo, Tolú, Coveñas, Sampués y Morroa primero; el modelo debe admitir más municipios sin rediseño

## Acceso e inclusión

- **Contenido multilingüe**: sitio y chatbot al menos en español e inglés
- **Formación digital**: contenidos de orientación para actores del ecosistema (uso de la plataforma y herramientas básicas)
- **Accesibilidad**: interfaz usable con distintos niveles de alfabetización digital (navegación clara, textos comprensibles)

## Evaluación (objetivo 3)

- **Analítica de plataforma**: uso, participación, visibilidad y acceso a la oferta (más allá del chatbot); solo lectura para staff; sin PII innecesaria

## Prompts Speckit

Copiar tras `/speckit-specify`, **en este orden** (cada uno asume los anteriores).

### Ya ejecutado

1. **[✅ Hecho]** CMS de destinos Imperdibles (admin, home, detalle Markdown, coords). La ficha rica, el mapa unificado y “Qué hacer” siguen en los prompts 2, 3 y 11.

### Fase 1 — Oferta pública (CMS de la home)

2. **[✅ Hecho]** Fichas de destino y micrositios “Sucre Natural” (referencia visual: `docs/fichas_destinos`). Extiende el CMS de Imperdibles; no replicar carteles estáticos: páginas web interactivas con la misma estética (papel crema, títulos pincel, fotos tipo polaroid, iconos, mapas ilustrados, acentos botánicos). Hubs temáticos con paleta propia: Playas (turquesa), Ciénagas (verde), Ríos (tierra), Paisajes (verde), Biodiversidad (ámbar), Senderos (violeta), Experiencias en naturaleza (naranja). Cada hub lista destinos del tema. Cada ficha es CMS estructurado, no Markdown libre: ubicación, municipio, región, ecosistemas, tagline, “en 30 segundos”, “qué lo hace especial”, chips de biodiversidad, actividades (“vive el destino”), turismo responsable, cómo llegar / clima / tiempo / para quién, galería, mapa. Catálogo de especies (fauna/flora) enlazado a destinos. Admin CRUD; fuentes en la ficha. Al publicar: revalidar home e Imperdibles. Dejar campos listos para el mapa (prompt 11) y el RAG (prompt 14); no implementar RAG aquí.

3. **[✅ Hecho]** Reemplazar el mock de ActivitiesSection por un CMS de actividades “Qué hacer en Sucre”. Admin CRUD de actividades y de categorías (relación M-N: una categoría varios destinos/actividades y viceversa). Cada actividad: título, descripción, 1+ fotos en carrusel, icono Lucide desde un catálogo. En la home: icono + título + descripción; si hay más de 5, carrusel con flechas y autoplay; fondo con imágenes en autoplay. Enlazar a destinos/fichas del prompt 2 cuando aplique.

4. Fusionar EventsSection y CulturalAgenda en un solo módulo de próximos eventos / agenda cultural. Admin CRUD (fecha, lugar, categoría, imagen, descripción, coords opcionales). Home: listado por mes con navegación prev/next. Botón “Agregar a calendario” (Google Calendar y equivalente iOS/.ics). Quitar datos hardcodeados.

5. Convertir ConvocatoriasSection en CMS: CRUD admin (título, descripción, audiencia, tipo, fecha límite, enlace externo obligatorio). Home consume la BD; sin mock.

6. Actualizar Footer: eliminar datos mock de turismo de la Gobernación de Sucre y números de teléfono; dejar solo contenido real/configurable o mínimo institucional.

### Fase 2 — Actores, patrimonio y mapa

7. Directorio cultural y turístico de actores: CRUD admin y ficha pública por tipo (artesano, sabedor, hotel, restaurante, agencia, organizador). Campos: nombre, municipio (Sincelejo / Tolú / Coveñas / Sampués / Morroa y ampliación posterior), rubro, contacto, breve descripción, geolocalización opcional. Listado filtrable. Slug estable para que el chatbot los cite más adelante.

8. Módulo Guías del territorio: formulario público de registro (datos de contacto, zona, experiencia) y alta desde el dashboard. Admin en `/admin` aprueba o rechaza (mismo patrón PENDING/APPROVED que usuarios). Solo guías aprobados visibles o contactables. Slug estable para sugerencia posterior en el chat.

9. Memoria cultural digital: CMS de historias, tradiciones y saberes (título, relato, municipio, medios, consentimiento). Distinto del RAG: esto es contenido público del sitio. Cada pieza lleva ficha de autoría y procedencia (autor o comunidad, fuente, consentimiento, fecha). Sin consentimiento no se publica. Dejar listo para indexar en el prompt 14.

10. Validación comunitaria de contenidos patrimoniales: además del staff, actores aprobados (prompt 7) pueden proponer o revisar memoria cultural / fichas de autoría. Estados PENDING / APPROVED / REJECTED. Solo lo aprobado es público. Criterio: evitar apropiación indebida y folclorización.

11. Unificar el mapa público: MapSection deja de usar destinos hardcodeados y consume la misma fuente CMS que fichas/destinos (prompt 2), eventos (prompt 4) y actores (prompt 7). Filtros por tipo; enlace a ficha; sin mocks.

### Fase 3 — Viaje planificado

12. Rutas e itinerarios turísticos: CRUD admin de rutas (nombre, duración, días/pasos) enlazando destinos/fichas (prompt 2) y actividades (prompt 3). Vista pública con el mapa del prompt 11. Slug estable para el agente.

13. Mi viaje / favoritos: usuarios con sesión pueden guardar destinos, actividades y eventos (prompts 2–4). Página “Mi viaje” con la lista; opcional exportar a calendario. Requiere auth; sin favoritos anónimos.

### Fase 4 — Agente

14. Base de conocimiento RAG: indexar fichas, especies, memoria cultural, actores y rutas ya publicados. Admin puede subir textos adicionales. Persistir en PGVector (o servicio vectorial) para el workflow n8n. Definir límites de upload, quién edita y reindexar al publicar. Sin esto el chatbot no debe inventar fichas.

15. Ampliar el chatbot (ChatPanel + API + n8n): respuestas no solo texto. Tipos de bloque (mapa, card de destino/actor/guía, ticket/enlace) serializados en el job/callback y renderizados en el cliente de forma segura. Citar slugs del CMS/RAG (prompts 2, 7, 8, 12, 14).

16. Transparencia y supervisión de IA: en el chat, indicar que responde un asistente; no presentar la IA como sabedor comunitario. Lineamiento de revisión humana de contenidos generados o importados al RAG / memoria cultural.

17. Analytics del chatbot en `/admin`: métricas de ChatJob (volumen, DONE/ERROR, latencia aproximada) y temas o consultas frecuentes si se pueden derivar. Solo lectura para staff; sin exponer PII innecesaria.

### Fase 5 — Acceso, formación y evaluación

18. Contenido multilingüe: sitio y chatbot al menos en español e inglés (selector de idioma). El asistente respeta el idioma de la consulta. No traducir automáticamente saberes sensibles sin revisión.

19. Módulo de formación digital para actores del ecosistema: contenidos de orientación (cómo usar la plataforma, buenas prácticas digitales básicas). Admin CRUD; acceso público o con cuenta. No es un LMS completo.

20. Accesibilidad y usabilidad: textos claros, navegación predecible y contraste suficiente para usuarios con distinta alfabetización digital. Criterio mínimo WCAG 2.2 AA en flujos públicos (home, fichas, chat, registro).

21. Analítica de plataforma en `/admin` (objetivo de evaluación): indicadores de uso, participación, visibilidad y acceso a la oferta territorial (páginas, búsquedas, registros, contenidos publicados). Distinto de analytics del chatbot (prompt 17). Solo staff; sin PII innecesaria.

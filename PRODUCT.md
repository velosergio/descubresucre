# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuario principal: turista nacional (Colombia) que planea o decide un viaje al departamento de Sucre, sobre todo desde el celular, y necesita orientarse sin conocer el territorio. No requiere cuenta para consultar.

Audiencia secundaria: personal editorial (roles `admin` y `editor`) que gestiona contenido en el panel de administración. El registro público es solo para futuros colaboradores y exige aprobación; no es para visitantes.

## Product Purpose

Sucre Vivo / DescubreSucre promueve el turismo del departamento de Sucre (Colombia): destinos naturales (Sucre Natural), actividades por tema (Qué hacer), agenda cultural, convocatorias, mapa de destinos y un asistente conversacional. Éxito: que el visitante encuentre qué hacer y dónde, y resuelva dudas prácticas sin fricción.

## Positioning

Guía conversacional local: un asistente de IA acotado al territorio de Sucre (enlazado a n8n), apoyado en fichas, agenda y mapa propios del sitio. Un sitio vecino no podría copiar el conocimiento local curado detrás del chat.

## Operating Context

- Proyecto independiente, no sitio oficial de la Gobernación (el footer enlaza a ella).
- El chat se abre desde la página de inicio; las respuestas llegan de forma asíncrona (polling hasta 120 s).
- Los medios se suben al disco local y se sirven por `/api/media`.
- El contenido (hero, destinos imperdibles, galería, eventos, convocatorias, actividades) se edita desde el panel.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, TypeScript, Prisma sobre MySQL/MariaDB, Tailwind con tokens HSL. Fuentes `font-display` (Playfair) y `font-body` (DM Sans).
- Toda la interfaz y los mensajes están en español. No hay contenido en inglés; no se ha decidido soportarlo.
- Imágenes con límite de 8 MB y vídeo de 80 MB.
- La URL del webhook del chat nunca llega al navegador.
- Sin decidir: si habrá visitantes internacionales, idiomas adicionales y contenido de reservas.

## Brand Commitments

Nombre: Sucre Vivo / DescubreSucre. Hero con fotografía aérea de la costa (Tolú/Coveñas). Los tokens de color y tipografía actuales son el sistema incumbente; no se han declarado vinculantes.

## Evidence on Hand

- Especificaciones en `specs/001` a `specs/010` (chatbot, personalización del hero, galería, Sucre Natural, Qué hacer, agenda cultural, convocatorias).
- Fotografía propia en `public/` y subidas en `public/uploads/`.
- No hay testimonios, métricas de uso ni cifras de visitantes en el repositorio; no inventarlos.

## Product Principles

1. Orientar antes que vender: el visitante debe saber qué hacer en Sucre sin crear cuenta ni hacer fricción.
2. Territorio primero: todo contenido y respuesta del asistente se mantiene dentro del departamento de Sucre.
3. Confianza sobre cantidad: no mostrar secciones rotas, vacías o con fechas vencidas.
4. Pensado para celular: la consulta ocurre desde el teléfono, a menudo con conexión limitada.
5. El contenido es configurable: lo que ve el turista lo gobierna el panel, no el código.

## Accessibility & Inclusion

Sin estándar formal declarado. Mínimo razonable para este producto: contraste AA, navegación por teclado y texto alternativo en imágenes. Interfaz en español.

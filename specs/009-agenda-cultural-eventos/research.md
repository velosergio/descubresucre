# Research: Eventos y Agenda Cultural (módulo unificado)

## 1. Un solo modelo `CulturalEvent` vs mantener dos modelos separados

**Decision**: Un único modelo Prisma `CulturalEvent` sustituye conceptualmente a `EventsSection` (eventos puntuales/festivales) y `CulturalAgenda` (agenda cultural mensual). Un evento es simplemente una fila de este modelo; no hay distinción de "tipo" en el dato.

**Rationale**: El ROADMAP y el spec piden fusión explícita ("un solo módulo"), con un único set de campos (fecha, lugar, categoría, imagen, descripción, coords opcionales). Mantener dos modelos duplicaría CRUD, admin y consulta por mes sin beneficio — mismo patrón que 008 (`QueHacerActivity` único en vez de tema+actividad separados).

**Alternatives considered**: Dos modelos con una vista unificada en el home (rechazado: dobla CRUD/admin y complica "listado por mes" al tener que mezclar dos fuentes). Un modelo con campo discriminador `kind: EVENTO | AGENDA` (rechazado: el spec no distingue tipos de producto, solo "categoría" como etiqueta libre; añadir un discriminador sin requisito de producto es complejidad innecesaria).

## 2. Modelo de fecha: rango opcional + hora opcional

**Decision**: `startsAt` (`DateTime`, obligatorio), `endsAt` (`DateTime?`, opcional, para eventos de varios días) y `allDay` (`Boolean`, default `true`). Cuando `allDay` es `true`, la hora se ignora en la vista pública y en la exportación a calendario (evento "todo el día"); cuando es `false`, `startsAt`/`endsAt` incluyen hora real.

**Rationale**: `EventsSection` actual usa rangos de fecha en texto libre ("20 - 25 Enero 2026"); `CulturalAgenda` usa día+mes sin año ni hora. Ninguno tiene una fecha real utilizable para agrupar por mes o exportar a calendario. Un rango con horario opcional cubre ambos casos de origen sin perder la posibilidad de festivales de varios días (Assumptions del spec).

**Alternatives considered**: Solo fecha única sin rango (pierde el caso "Fiestas del 20 de Enero" de varios días, ya cubierto hoy). Campos `startDate`/`endDate` de solo fecha sin hora (rechazado: la exportación a calendario mejora con hora cuando existe; se mantiene opcional para no forzar el dato).

## 3. Categoría como texto libre (sin catálogo administrable)

**Decision**: `category` es un `String` corto por evento, sin tabla ni relación M-N. El color/tratamiento visual de la etiqueta se deriva de forma determinística del texto de la categoría (p. ej. hash simple → paleta fija de acentos ya usada en el sitio), no de un diccionario fijo por nombre exacto como el actual `categoryColors`.

**Rationale**: El spec (Assumptions) descarta explícitamente un catálogo administrable o filtro por categoría en esta versión. El `categoryColors` actual de `CulturalAgenda.tsx` está acoplado 1:1 a 4 valores fijos ("Música", "Arte", "Teatro", "Literatura"); con categoría libre ese diccionario se rompería con cualquier valor nuevo que escriba el staff.

**Alternatives considered**: Reutilizar `QueHacerCategory` (M-N) como en Qué Hacer (rechazado: sobre-ingeniería para un campo que el propio spec trata como etiqueta simple, no como taxonomía). Lista cerrada tipo enum Prisma (rechazado: obliga a migración de schema cada vez que el staff necesite una categoría nueva).

## 4. Navegación por mes: SSR inicial + endpoint público para prev/next

**Decision**: `src/app/page.tsx` sigue el patrón existente (`Promise.all` de payloads) y añade `getCulturalEventsForMonth({ year, month })` para el mes actual en el primer render (SSR, sin JS). Los clics en "anterior"/"siguiente" dentro del módulo (client component) llaman a un route handler público `GET /api/cultural-events?mes=YYYY-MM` que reutiliza la misma función de lectura, evitando una recarga completa de la página.

**Rationale**: Cumple FR-004 (mes actual visible al cargar, funciona sin JS/SEO-friendly) y el criterio de "sin recargar toda la página" (FR-003/SC-001) sin introducir un patrón de datos nuevo: es el mismo estilo que `/api/media` (lectura pública vía route handler) ya usado en el proyecto, y reutiliza la lógica pura de `get-cultural-events-home.ts` en ambos lados.

**Alternatives considered**: Todo vía `searchParams` + navegación de `<Link>` (Server Component puro, sin route handler) — descartado porque `HomePage.tsx` (el árbol que contiene el módulo) es un client component (`"use client"` en la línea 1 hoy) y cambiar eso para leer `searchParams` en cada sub-sección de la home es una reestructuración más grande que no pide el spec. Server Action de solo lectura invocada desde el cliente — funcionalmente equivalente al route handler, pero el proyecto usa "server actions" para mutaciones (`assertAdminAction` + Zod) y route handlers para lectura pública; se prefiere mantener esa separación de conceptos ya establecida.

## 5. Imagen: campo único reutilizando el flujo de subida existente

**Decision**: `imageUrl` (`String?`) igual que `ImperdibleDestination.cardImageUrl`. El formulario admin reutiliza `uploadGalleryAssetAction` (`src/lib/actions/gallery.ts`) y `GalleryPickerDialog` (`src/components/admin/gallery-picker-dialog.tsx`) — el mismo patrón ya usado en `imperdibles-destination-dialog.tsx` para elegir o subir una imagen de tarjeta.

**Rationale**: El spec pide imagen opcional (campo único, no galería). No hay necesidad de un nuevo mecanismo de subida: el existente ya aplica los límites de `upload-limits.ts` y la transcodificación a WebP.

**Alternatives considered**: Galería de varias fotos por evento como `ImperdibleGalleryItem` (rechazado: el spec y el ROADMAP piden un solo campo "imagen", no un carrusel por evento).

## 6. Coordenadas opcionales

**Decision**: `mapLat`/`mapLng` como `Decimal(10, 7)?`, mismo tipo y precisión que `ImperdibleDestination.mapLat`/`mapLng`. Sin `mapZoom` (no hay mapa embebido por evento en esta versión). Se exige ambos o ninguno en la validación (un solo valor presente no tiene sentido geográfico).

**Rationale**: El spec pide coords opcionales pensadas para uso futuro (mapa unificado, ROADMAP ítem 11) y, si existen, pueden enriquecer el lugar en la exportación a calendario. Reutilizar el tipo ya validado en producción evita reinventar rangos/precisión.

**Alternatives considered**: Guardar coords como un único campo de texto "lat,lng" (rechazado: pierde validación de rango y tipo, inconsistente con el resto del CMS).

## 7. Exportación `.ics`: función pura + route handler público

**Decision**: `buildIcsContent(event)` en `src/lib/ics.ts` genera el contenido `VCALENDAR`/`VEVENT` (RFC 5545) con escape de texto (comas, punto y coma, saltos de línea). Un route handler público `GET /api/cultural-events/[id]/ics` lee el evento, llama a esa función y responde con `Content-Type: text/calendar; charset=utf-8` y `Content-Disposition` con nombre de archivo.

**Rationale**: Servir el archivo desde el servidor (en vez de generarlo 100% en el navegador con un Blob) es el patrón más confiable para que iOS/Safari lo reconozca como evento de calendario al abrirlo, y mantiene una única fuente de verdad (los datos del evento en BD, no lo que haya quedado renderizado en el cliente). La función de construcción del contenido queda pura y testeable por separado, siguiendo la convención del proyecto (lógica pura en `src/lib/*.ts` con `*.test.ts` al lado).

**Alternatives considered**: Generar y descargar el `.ics` enteramente en el cliente vía `Blob`/`URL.createObjectURL` (rechazado: comportamiento históricamente inconsistente en Safari/iOS para abrir directamente en Calendario; además duplicaría en el cliente datos que ya están en el servidor).

## 8. Enlace a Google Calendar: URL pública sin autenticación

**Decision**: `buildGoogleCalendarUrl(event)` en `src/lib/calendar-links.ts` construye la URL de plantilla pública de Google Calendar (`.../calendar/render?action=TEMPLATE&...`) con título, fechas/horas, lugar y descripción codificados. Se renderiza como un enlace normal (`<a target="_blank" rel="noopener">`), no como una ventana emergente disparada por JS.

**Rationale**: No requiere credenciales ni llamadas a una API externa (evita gestionar secretos para algo que Google ofrece como enlace público); satisface el edge case del spec sobre bloqueo de pop-ups al ser un enlace directo, no un `window.open`.

**Alternatives considered**: Integración con Google Calendar API (OAuth) — rechazada por sobre-alcance: el spec no pide guardar el evento "en nombre de" nadie ni requiere login del visitante.

## 9. Sin página de detalle pública por evento en esta versión

**Decision**: No se crea una ruta `/eventos/[id]` ni `/agenda/[slug]`. Toda la interacción pública ocurre en la tarjeta dentro del módulo de la home (incluida la acción "Agregar a calendario"), y el `.ics` se sirve vía route handler, no vía una página de detalle.

**Rationale**: El spec no pide una ficha individual (a diferencia de Imperdibles o Qué Hacer); solo pide el módulo de home con navegación por mes y la acción de calendario. Mantener el alcance ajustado a lo pedido evita trabajo no solicitado.

**Alternatives considered**: Página de detalle con Markdown enriquecido como `ImperdibleDestination` (fuera de alcance; puede evaluarse como extensión futura si el ROADMAP lo pide explícitamente).

## 10. Retiro de datos hardcodeados

**Decision**: `src/components/EventsSection.tsx` y `src/components/CulturalAgenda.tsx` se eliminan por completo y se reemplazan por `src/components/CulturalEventsSection.tsx`, montado una sola vez en `HomePage.tsx` en el lugar donde hoy están ambas. Los eventos de ejemplo actuales (festivales y agenda ficticios) **no** se migran a la base de datos.

**Rationale**: FR-001/FR-002/FR-014 del spec; los datos actuales son contenido de muestra sin valor real que reemplazar uno a uno (confirmado en la exploración: fechas y ubicaciones ficticias).

**Alternatives considered**: Dejar los componentes viejos como fallback si la BD está vacía (rechazado: contradice explícitamente "quitar datos hardcodeados"; el estado vacío ya está cubierto por FR-005 con un mensaje, no con datos falsos).

## 11. Autorización, revalidación y observabilidad

**Decision**: Mismo patrón que `imperdibles.ts`/`que-hacer.ts`: cada acción de administración empieza con `assertAdminAction()`, valida con Zod (`cultural-event-schema.ts`), devuelve `{ ok: true } | { ok: false, error }` y hace `revalidatePath("/")` + `revalidatePath("/admin/personalizar/eventos")` tras mutar. Errores al guardar/eliminar un evento o al generar el `.ics` se registran con `console.error` incluyendo el id del evento y la operación, siguiendo el nivel de detalle ya usado en otras actions del proyecto.

**Rationale**: Constitución III/IV; consistencia con el resto del CMS del sitio, sin introducir un mecanismo de logging nuevo.

## 12. Estrategia de pruebas

**Decision**: Unit para toda la lógica pura nueva (`month-range.ts`, `calendar-links.ts`, `ics.ts`, `cultural-event-schema.ts`). Integration para las server actions (RBAC + validación + persistencia) y para los route handlers públicos (`/api/cultural-events`, `/api/cultural-events/[id]/ics`). Component para el módulo de home (mes actual, navegación, estado vacío, botón de calendario) y para el formulario admin. E2E: extender `e2e/critical-flows.spec.ts` con un flujo admin crea evento → aparece en home del mes correcto → enlace de calendario presente.

**Rationale**: Constitución II (pruebas proporcionales al riesgo): toca persistencia, autorización y una integración externa (formato de calendario) — riesgo suficiente para exigir automatización en todas las capas, igual que 007/008.

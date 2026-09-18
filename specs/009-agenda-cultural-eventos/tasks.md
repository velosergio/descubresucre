# Tasks: Eventos y Agenda Cultural (módulo unificado)

**Input**: Design documents from `/specs/009-agenda-cultural-eventos/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos. La Constitución (Principio II, "Pruebas proporcionales al riesgo") exige pruebas automatizadas porque la feature toca persistencia, autorización y un formato de intercambio externo (`.ics`); el Constitution Check de `plan.md` ya comprometió los niveles unit/integration/component/e2e. Escribir los tests antes de la implementación cuando el riesgo lo amerite (TDD para lógica pura y para las actions/route handlers).

**Organization**: Por user story (US1–US3, prioridad P1→P3 de `spec.md`) para poder entregar incrementos independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelo (archivo distinto, sin depender de una tarea incompleta)
- **[Story]**: US1 (ver módulo + navegación mensual), US2 (admin CRUD), US3 (agregar a calendario)
- Toda tarea incluye ruta de archivo exacta

## Path Conventions

Next.js App Router en la raíz del repo: `src/`, `prisma/`, `e2e/` (ver `plan.md` → Project Structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: El proyecto Next.js/Prisma ya existe; solo se prepara el andamiaje de archivos nuevo del feature.

- [X] T001 Crear los directorios vacíos que usará el feature: `src/components/cultural-events/`, `src/app/api/cultural-events/`, `src/app/api/cultural-events/[id]/ics/`, `src/app/admin/personalizar/eventos/` (sin contenido todavía; los llenan las fases siguientes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Modelo de datos único del que dependen las 3 user stories. **Ninguna user story empieza antes.**

**⚠️ CRITICAL**: Completar esta fase antes de US1–US3

- [X] T002 Añadir `model CulturalEvent` en `prisma/schema.prisma` con los campos exactos de `data-model.md`: `id` (String, `@id @default(cuid())`), `title` (String, máx. 200), `description` (String, `@db.Text`), `category` (String, máx. 80), `location` (String, máx. 300), `startsAt` (DateTime, obligatorio), `endsAt` (DateTime?, opcional), `allDay` (Boolean, `@default(true)`), `imageUrl` (String?, máx. 2048), `mapLat` (Decimal?, `@db.Decimal(10, 7)`), `mapLng` (Decimal?, `@db.Decimal(10, 7)`), `published` (Boolean, `@default(true)`), `createdAt` (`@default(now())`), `updatedAt` (`@updatedAt`); índice `@@index([published, startsAt])`
- [X] T003 Crear la migración Prisma para la tabla `cultural_events` (`npx prisma migrate dev` o equivalente del proyecto) y ejecutar `npm run db:generate`

**Checkpoint**: Tabla `CulturalEvent` disponible; ninguna UI la usa todavía.

---

## Phase 3: User Story 1 - Ver el módulo unificado con navegación por mes (Priority: P1) 🎯 MVP

**Goal**: La home muestra un único módulo "Próximos eventos / agenda cultural" con los eventos publicados del mes actual, navegación anterior/siguiente sin recarga completa, y estado vacío cuando un mes no tiene eventos. `EventsSection.tsx` y `CulturalAgenda.tsx` (hardcodeados) desaparecen.

**Independent Test**: Insertar al menos un evento publicado directamente (vía Prisma Studio o un script), abrir `/`, confirmar que aparece en el módulo bajo el mes correcto, y que "Siguiente"/"Anterior" cambian el mes mostrado.

### Tests for User Story 1

- [X] T004 [P] [US1] Unit tests en `src/lib/month-range.test.ts`: `getMonthRange(year, month)` devuelve el rango `[inicio de mes, inicio de mes siguiente)` correcto (incluyendo el cruce diciembre→enero), `parseMonthParam("YYYY-MM")` acepta formato válido y rechaza inválido, `formatMonthLabel(year, month)` devuelve una etiqueta en español (p. ej. "octubre de 2026")
- [X] T005 [P] [US1] Integration test en `src/test/integration/cultural-events-api.integration.test.ts`: `GET /api/cultural-events?mes=YYYY-MM` devuelve solo eventos con `published=true` cuyo `startsAt` cae en el rango del mes pedido, ordenados por `startsAt` ascendente; `mes` ausente o mal formado → `400`; mes sin eventos → `{ events: [] }`
- [X] T006 [P] [US1] Component test en `src/test/components/cultural-events-section.component.test.tsx`: con un payload de eventos del mes actual se renderizan las tarjetas; clic en "Siguiente"/"Anterior" dispara la navegación de mes; payload vacío muestra el mensaje de estado vacío y mantiene los controles activos

### Implementation for User Story 1

- [X] T007 [P] [US1] `src/lib/month-range.ts` (función pura): `getMonthRange(year, month)`, `parseMonthParam(value)`, `formatMonthLabel(year, month)` en español
- [X] T008 [US1] `src/lib/get-cultural-events-home.ts`: `getCulturalEventsForMonth({ year, month })` — consulta `CulturalEvent` con `published=true` y `startsAt` dentro de `getMonthRange(year, month)`, orden `startsAt asc`, mapea a `CulturalEventsHomePayload` (imagen resuelta con `toServedMediaUrl()`, `mapLat`/`mapLng` a `number | null`)
- [X] T009 [US1] `src/app/api/cultural-events/route.ts` — `GET`, lee `?mes=`, valida con `parseMonthParam` (400 si inválido), llama a `getCulturalEventsForMonth`, responde JSON según `contracts/public-routes.md`
- [X] T010 [P] [US1] `src/components/cultural-events/event-card.tsx` — tarjeta de evento: título, fecha u rango formateado (respeta `allDay`), lugar, etiqueta de categoría con acento derivado del texto (no diccionario fijo, ver `research.md` §3), imagen opcional con tratamiento visual por defecto cuando falta
- [X] T011 [US1] `src/components/cultural-events/month-navigator.tsx` (client component) — botones "Mes anterior"/"Mes siguiente" con `aria-label` explícito, operables por teclado; al hacer clic llama a `GET /api/cultural-events?mes=...` y actualiza la lista mostrada sin recargar la página; muestra el mensaje de estado vacío cuando `events` llega vacío
- [X] T012 [US1] `src/components/CulturalEventsSection.tsx` — módulo público: recibe el payload inicial (mes actual) como prop desde `page.tsx`, compone `month-navigator` + `event-card[]` bajo un único heading "Próximos eventos / agenda cultural"
- [X] T013 [US1] `src/app/page.tsx` — añadir `getCulturalEventsForMonth({ year, month })` del mes actual al `Promise.all` existente junto a `getResolvedHeroConfig`/`getImperdiblesForHome`/`getQueHacerForHome`, y pasar el payload como prop nueva a `HomePage`
- [X] T014 [US1] `src/components/HomePage.tsx` — quitar los imports y el renderizado de `EventsSection` y `CulturalAgenda`; montar `CulturalEventsSection` una sola vez, en el mismo lugar del árbol, recibiendo el payload de T013
- [X] T015 [US1] Eliminar `src/components/EventsSection.tsx` y `src/components/CulturalAgenda.tsx` (FR-014: cero datos de eventos fijos en el código)
- [X] T016 [US1] Extender `e2e/critical-flows.spec.ts` con un escenario: la home muestra el módulo de eventos del mes actual (o su estado vacío) y "Siguiente" cambia el mes visible

**Checkpoint**: MVP público funcional — módulo unificado, navegación por mes, sin datos hardcodeados (aunque la BD esté vacía hasta que exista US2).

---

## Phase 4: User Story 2 - Administrar eventos desde un panel unificado (Priority: P2)

**Goal**: El staff (admin/editor) crea, edita y elimina eventos desde `/admin/personalizar/eventos` con los campos del spec (título, fecha con rango/hora opcionales, lugar, categoría, descripción, imagen opcional, coordenadas opcionales), reemplazando la necesidad de tocar código.

**Independent Test**: Con sesión de staff, crear un evento, verificarlo en la home (US1) bajo el mes correcto; editarlo cambiándole el mes; eliminarlo y confirmar que desaparece.

### Tests for User Story 2

- [X] T017 [P] [US2] Unit tests en `src/lib/cultural-event-schema.test.ts`: rechaza si falta `title`/`description`/`category`/`location`/`startsAt`; rechaza `endsAt < startsAt`; rechaza cuando solo una de `mapLat`/`mapLng` está presente; rechaza `title` > 200, `location` > 300, `category` > 80 caracteres; acepta payload mínimo válido con defaults (`allDay=true`, `published=true`)
- [X] T018 [US2] Integration test en `src/test/integration/cultural-events-admin.integration.test.ts`: `createCulturalEventAction`/`updateCulturalEventAction`/`deleteCulturalEventAction` devuelven `{ ok: false, error: "No autorizado." }` sin modificar datos cuando no hay sesión de staff; con sesión de staff, crear persiste todos los campos (incluyendo rango de fechas y coords), editar mueve el evento de mes, eliminar lo retira; cada mutación exitosa dispara `revalidatePath("/")` y `revalidatePath("/admin/personalizar/eventos")`
- [X] T019 [P] [US2] Component test en `src/test/components/cultural-events-admin.component.test.tsx`: el formulario exige los campos obligatorios y muestra el error de la action si el guardado falla; la lista muestra los eventos existentes con acciones de editar/eliminar

### Implementation for User Story 2

- [X] T020 [P] [US2] `src/lib/cultural-event-schema.ts` (Zod): `title` string 1–200, `description` string mínimo 1, `category` string 1–80, `location` string 1–300, `startsAt` fecha obligatoria, `endsAt` fecha opcional con refine `endsAt >= startsAt`, `allDay` boolean `default(true)`, `imageUrl` string opcional, `mapLat`/`mapLng` number opcionales con refine "ambos o ninguno" (rango `[-90,90]`/`[-180,180]`), `published` boolean `default(true)`; mensajes de error en español
- [X] T021 [US2] `src/lib/actions/cultural-events.ts` — `createCulturalEventAction`, `updateCulturalEventAction(id, …)`, `deleteCulturalEventAction(id)`: cada una empieza con `assertAdminAction()`, valida con el schema de T020, opera sobre Prisma, hace `revalidatePath("/")` + `revalidatePath("/admin/personalizar/eventos")`, retorna `{ ok: true }` o `{ ok: false, error }` según `contracts/admin-actions.md`; loguea con `console.error` (operación + id) si Prisma falla
- [X] T022 [US2] `src/lib/get-cultural-events-home.ts` — añadir `getAllCulturalEventsForAdmin()` (todos los eventos, publicados o no, cualquier mes, orden `startsAt asc`) para la pantalla de administración
- [X] T023 [US2] `src/components/admin/cultural-events-admin.tsx` — listado + formulario crear/editar: campos título, fecha inicio, fecha fin opcional, interruptor "todo el día"/hora, lugar, categoría (texto libre), descripción, imagen (reutiliza `GalleryPickerDialog` de `src/components/admin/gallery-picker-dialog.tsx` y `uploadGalleryAssetAction` de `src/lib/actions/gallery.ts`, mismo patrón que `imperdibles-destination-dialog.tsx`), coordenadas opcionales (lat/lng), publicado (toggle); borrado con `confirm-delete-dialog.tsx`
- [X] T024 [US2] `src/app/admin/personalizar/eventos/page.tsx` — server component: llama a `getAllCulturalEventsForAdmin()` y monta `cultural-events-admin.tsx`; hereda el guard de staff del layout `/admin/personalizar` existente

**Checkpoint**: Staff gestiona eventos reales de punta a punta; home (US1) refleja los cambios.

---

## Phase 5: User Story 3 - Agregar un evento al calendario personal (Priority: P3)

**Goal**: Cada evento visible ofrece "Agregar a calendario": un enlace público a Google Calendar prellenado y una descarga `.ics` válida (iOS/Outlook/otros), respetando rangos de varios días.

**Independent Test**: Con al menos un evento visible (de US1), pulsar "Agregar a calendario" y confirmar que el enlace de Google Calendar abre con los datos correctos y que la descarga `.ics` es un archivo `VCALENDAR`/`VEVENT` válido.

### Tests for User Story 3

- [X] T025 [P] [US3] Unit tests en `src/lib/calendar-links.test.ts`: `buildGoogleCalendarUrl(event)` genera una URL `https://calendar.google.com/calendar/render?action=TEMPLATE&...` con `text`, `dates`, `location`, `details` correctamente codificados; formato de `dates` distinto para evento con hora (`allDay=false`) vs. evento de todo el día (`allDay=true`); respeta `endsAt` cuando el evento dura varios días
- [X] T026 [P] [US3] Unit tests en `src/lib/ics.test.ts`: `buildIcsContent(event)` produce un bloque `BEGIN:VCALENDAR…BEGIN:VEVENT…END:VEVENT…END:VCALENDAR` válido; escapa comas, punto y coma y saltos de línea en `SUMMARY`/`DESCRIPTION`/`LOCATION` (RFC 5545); usa `DTSTART;VALUE=DATE`/`DTEND;VALUE=DATE` cuando `allDay=true` y `DTSTART`/`DTEND` con hora en UTC cuando `allDay=false`; `UID` estable basado en el id del evento
- [X] T027 [US3] Extender `src/test/integration/cultural-events-api.integration.test.ts` (de T005): `GET /api/cultural-events/{id}/ics` responde `200` con `Content-Type: text/calendar; charset=utf-8` y cuerpo válido para un evento publicado; responde `404` para un id inexistente o un evento con `published=false`

### Implementation for User Story 3

- [X] T028 [P] [US3] `src/lib/calendar-links.ts` (función pura): `buildGoogleCalendarUrl(event)`
- [X] T029 [P] [US3] `src/lib/ics.ts` (función pura): `buildIcsContent(event)` con escape RFC 5545 y soporte `allDay`/rango de fechas
- [X] T030 [US3] `src/lib/get-cultural-events-home.ts` — añadir `getPublishedCulturalEventById(id)` (devuelve el evento solo si `published=true`, o `null`)
- [X] T031 [US3] `src/app/api/cultural-events/[id]/ics/route.ts` — `GET`: llama a `getPublishedCulturalEventById`, `404` si no existe/no publicado, si existe llama a `buildIcsContent` y responde con `Content-Type: text/calendar; charset=utf-8` y `Content-Disposition: attachment; filename="{slug-del-titulo}.ics"` según `contracts/public-routes.md`
- [X] T032 [P] [US3] `src/components/cultural-events/add-to-calendar-button.tsx` — enlace a Google Calendar (`buildGoogleCalendarUrl`, `<a target="_blank" rel="noopener noreferrer">`, texto visible) + enlace de descarga a `/api/cultural-events/{id}/ics`
- [X] T033 [US3] Integrar `add-to-calendar-button` dentro de `src/components/cultural-events/event-card.tsx` (T010 de US1)
- [X] T034 [US3] Extender `e2e/critical-flows.spec.ts`: en un evento visible, "Agregar a calendario" expone el enlace de Google Calendar y el enlace de descarga `.ics`

**Checkpoint**: Las 3 user stories funcionan juntas; el spec queda cubierto de punta a punta.

---

## Phase 6: Polish & Cross-Cutting

**Purpose**: Cierre documental y verificación final.

- [X] T035 [P] Actualizar `ROADMAP.md`: marcar el ítem 4 ("Eventos + Agenda cultural") como `✅ Hecho — 009` tanto en la lista "Contenido CMS" como en la sección "Fase 1 — Oferta pública", igual que los ítems 1–3 ya marcados
- [X] T036 Ejecutar `npx biome check --write` sobre todos los archivos tocados
- [X] T037 Correr la suite focal y confirmar verde: `npx vitest run src/lib/month-range.test.ts src/lib/calendar-links.test.ts src/lib/ics.test.ts src/lib/cultural-event-schema.test.ts`, `node --env-file=.env.test ./node_modules/vitest/vitest.mjs run --maxWorkers=1 src/test/integration/cultural-events-admin.integration.test.ts src/test/integration/cultural-events-api.integration.test.ts`, `npx vitest run src/test/components/cultural-events-section.component.test.tsx src/test/components/cultural-events-admin.component.test.tsx`, `node --env-file=.env.test ./node_modules/@playwright/test/cli.js test e2e/critical-flows.spec.ts -g "eventos|agenda cultural|calendario"`
- [X] T038 Recorrer manualmente el criterio de listo de `specs/009-agenda-cultural-eventos/quickstart.md`

---

## Dependencies & Story Order

```text
Phase 1 Setup → Phase 2 Foundational (modelo CulturalEvent)
                    ↓
            US1 (home + navegación por mes) 🎯 MVP
                    ↓
            US2 (admin CRUD)
                    ↓
            US3 (agregar a calendario)
                    ↓
                 Polish
```

- **US1** depende solo de Foundational; es el MVP público (aunque la BD esté vacía, ya no hay datos hardcodeados).
- **US2** depende de Foundational; técnicamente independiente de US1 en el backend, pero su prueba de valor completa ("el staff ve su evento en la home") requiere US1 ya implementado.
- **US3** depende de que exista al menos un evento visible (US1) y del modelo (Foundational); reutiliza `event-card.tsx` de US1 (T010/T033 tocan el mismo archivo, por eso T033 no es paralelo).

## Parallel Opportunities

- T004 ∥ T005 ∥ T006 (tests US1, archivos distintos)
- T007 ∥ T010 (lógica pura de mes vs. tarjeta de evento, sin dependencia mutua)
- T017 ∥ T019 (tests US2)
- T020 en paralelo con los tests de US1 ya cerrados (no depende de US1)
- T025 ∥ T026 (tests US3) y T028 ∥ T029 ∥ T032 (implementación pura/UI de US3)
- T035 ∥ T036 (polish, archivos distintos)

## Implementation Strategy

### MVP (mínimo)

1. Phase 1–2 (Setup + Foundational)
2. US1 completo (home real, sin hardcode, navegación por mes)
3. Parar y validar el bloque "Público" de `quickstart.md` (con datos insertados manualmente)

### Incremental

4. US2 — staff puede cargar eventos reales sin insertar datos a mano
5. US3 — acción de calendario sobre eventos ya visibles
6. Polish — ROADMAP, lint, suite completa, checklist de `quickstart.md`

## Summary

| Métrica | Valor |
|---------|-------|
| Total tareas | 38 |
| Setup + Foundational | 1 + 2 |
| US1 | 13 (T004–T016) |
| US2 | 8 (T017–T024) |
| US3 | 10 (T025–T034) |
| Polish | 4 (T035–T038) |
| MVP sugerido | Foundational + US1 |
| Formato checklist | Sí (checkbox, ID, [P]/[USx], rutas de archivo) |

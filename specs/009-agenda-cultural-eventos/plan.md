# Implementation Plan: Eventos y Agenda Cultural (módulo unificado)

**Branch**: `009-agenda-cultural-eventos` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-agenda-cultural-eventos/spec.md`

## Summary

Fusionar `EventsSection` y `CulturalAgenda` (hoy dos componentes con datos 100% hardcodeados e incompatibles entre sí) en un único modelo `CulturalEvent` y un único módulo de home "Próximos eventos / agenda cultural". CRUD admin (título, fecha con rango y hora opcionales, lugar, categoría libre, descripción, imagen opcional, coordenadas opcionales) siguiendo el patrón ya usado en Imperdibles/Qué Hacer (`assertAdminAction` + Zod + `revalidatePath`). Home: listado agrupado por mes con navegación prev/next (SSR del mes actual + endpoint público para cambiar de mes sin recarga completa). Acción "Agregar a calendario" por evento: enlace público a Google Calendar (sin auth) y descarga de `.ics` servida por un route handler (formato RFC 5545). Fuera de alcance: página de detalle pública por evento, filtro por categoría, eventos recurrentes, integración con el mapa unificado (ROADMAP ítem 11).

## Technical Context

**Language/Version**: TypeScript (`strictNullChecks`), Next.js 16 App Router, React 19
**Primary Dependencies**: Prisma 7, Zod, `framer-motion/m` (animaciones de sección, patrón existente), componentes admin ya existentes (`GalleryPickerDialog`, `uploadGalleryAssetAction`) para la imagen opcional
**Storage**: MySQL/MariaDB vía Prisma; imagen del evento en `public/uploads/...` vía `/api/media` (reutilizado, sin cambios)
**Testing**: Vitest (unit / integration / component), Playwright e2e
**Target Platform**: Web (localhost:3000 / standalone EasyPanel)
**Project Type**: Web application (Next.js fullstack, monolito existente)
**Performance Goals**: Navegación entre meses percibida como inmediata (< 1 s, sin recarga completa de página); carga inicial del módulo dentro del presupuesto normal de la home
**Constraints**: Solo staff (admin/editor) muta vía `assertAdminAction` + Zod; lectura pública solo `published=true`; sin autenticación para "Agregar a calendario"; sin página de detalle nueva; sin filtro por categoría en v1
**Scale/Scope**: 1 modelo nuevo (`CulturalEvent`); 1 módulo de home; 1 pantalla admin nueva; 2 route handlers públicos (`/api/cultural-events`, `/api/cultural-events/{id}/ics`); 3 server actions admin (crear/editar/eliminar); eliminación de 2 componentes hardcodeados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality & Maintainability**: Un único modelo y módulo (no dos representaciones paralelas de "evento"). Lógica pura testeable separada del acceso a datos: `month-range.ts` (cálculo de rango de mes), `calendar-links.ts` (URL Google Calendar) e `ics.ts` (contenido `.ics` + escape RFC 5545) viven en `src/lib/*.ts` con su `*.test.ts` al lado, sin mezclar con Prisma ni con componentes. CRUD admin sigue el mismo esqueleto que `imperdibles.ts`/`que-hacer.ts` (sin patrón nuevo que aprender).
- **Risk-Proportional Testing**: Toca persistencia, autorización y un formato de intercambio externo (`.ics`) → requiere pruebas automatizadas (Constitución II). Unit: `month-range`, `calendar-links`, `ics`, schema Zod. Integration: server actions (RBAC + validación + revalidate) y route handlers públicos (`/api/cultural-events`, `/api/cultural-events/{id}/ics`, incluyendo el 404 de eventos no publicados). Component: módulo de home (mes actual, navegación, estado vacío, botón de calendario) y formulario admin. E2E: flujo crear evento → aparece en el mes correcto → enlace de calendario presente, añadido a `critical-flows.spec.ts`.
- **Security Boundaries**: Toda mutación exige `assertAdminAction()` antes de tocar Prisma; Zod valida y sanea título/descripción/categoría/lugar/fechas/coords antes de persistir. Lectura pública (route handlers y RSC) filtra siempre por `published=true`; el `.ics` de un evento no publicado responde 404 en vez de filtrar datos. Sin secretos nuevos: el enlace a Google Calendar es una URL pública sin credenciales.
- **Operational Observability**: Errores al crear/editar/eliminar un evento o al generar el `.ics` se registran con `console.error` incluyendo operación e id del evento, mismo nivel que el resto de actions del proyecto. Sin necesidad de métricas nuevas (bajo volumen esperado, sin SLA propio).
- **Performance & Accessibility**: Navegación por mes vía route handler ligero (una consulta indexada por `[published, startsAt]`), sin bloquear el resto de la home. Controles prev/next son elementos interactivos reales con `aria-label` ("Mes anterior"/"Mes siguiente"), operables por teclado; el enlace de Google Calendar es un `<a>` normal (no depende de `window.open` disparado sin gesto directo del usuario, evitando el edge case de bloqueo de pop-ups); botones de calendario con texto visible, no solo iconos.

**Post-design**: Constitution OK tras Fase 1. Sin violaciones que requieran justificación — modelo único, sin relaciones nuevas complejas, reutiliza patrones de auth/upload/revalidate ya existentes. Sin entradas en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/009-agenda-cultural-eventos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── public-routes.md
│   └── admin-actions.md
└── tasks.md              # /speckit-tasks — no creado aquí
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma                       # + model CulturalEvent
└── migrations/…                        # add table cultural_events

src/lib/
├── actions/cultural-events.ts          # create/update/delete (assertAdminAction + Zod + revalidatePath)
├── cultural-event-schema.ts            # Zod schema
├── cultural-event-schema.test.ts
├── get-cultural-events-home.ts         # lectura pública por mes (Prisma) + tipo CulturalEventsHomePayload
├── month-range.ts                      # puro: rango [inicio, fin) de un mes, parseo "YYYY-MM", formateo de label
├── month-range.test.ts
├── calendar-links.ts                   # puro: buildGoogleCalendarUrl(event)
├── calendar-links.test.ts
├── ics.ts                              # puro: buildIcsContent(event), escape RFC 5545
└── ics.test.ts

src/app/
├── api/cultural-events/
│   ├── route.ts                        # GET ?mes=YYYY-MM → JSON (lectura pública)
│   └── [id]/ics/route.ts               # GET → text/calendar (descarga .ics)
├── admin/personalizar/
│   ├── eventos/page.tsx                # admin CRUD
│   └── layout.tsx                      # sin cambio (ya exige staff)
└── page.tsx                            # + getCulturalEventsForMonth() en el Promise.all existente

src/components/
├── CulturalEventsSection.tsx           # reemplaza EventsSection.tsx + CulturalAgenda.tsx (borrados)
├── cultural-events/
│   ├── month-navigator.tsx             # client: botones anterior/siguiente + fetch a /api/cultural-events
│   ├── event-card.tsx
│   └── add-to-calendar-button.tsx      # Google Calendar (enlace) + descarga .ics
├── HomePage.tsx                        # imports actualizados: 1 sección en vez de 2
└── admin/
    └── cultural-events-admin.tsx       # CRUD admin (kebab-case), reutiliza GalleryPickerDialog

src/test/
├── integration/
│   ├── cultural-events-admin.integration.test.ts
│   └── cultural-events-api.integration.test.ts
└── components/
    ├── cultural-events-section.component.test.tsx
    └── cultural-events-admin.component.test.tsx

e2e/critical-flows.spec.ts              # + escenario "eventos y agenda cultural"
```

**Structure Decision**: App Router fullstack existente (sin monorepo). Un módulo nuevo autocontenido (`cultural-events*`) siguiendo el mismo esqueleto que `que-hacer`/`imperdibles`: modelo único, actions admin, función de lectura pública pura, componente de home, pantalla admin. Dos componentes legados (`EventsSection.tsx`, `CulturalAgenda.tsx`) se eliminan en el mismo cambio, no se dejan como fallback.

## Complexity Tracking

> Vacío: el Constitution Check no tiene violaciones.

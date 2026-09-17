# Implementation Plan: Unificar hubs temáticos en Actividades

**Branch**: `008-unificar-actividades-temas` | **Date**: 2026-09-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/008-unificar-actividades-temas/spec.md`

## Summary

Absorber los hubs Sucre Natural (antes «micrositios») en el CMS **Actividades** (`QueHacerActivity`): cada tarjeta de «Qué hacer en Sucre» es un tema con modo de listado (destinos | biodiversidad | experiencias), identidad visual y destinos M-N. URL canónica `/que-hacer/[slug]`; redirecciones desde `/sucre-natural/[hub]`. Migración de los 7 hubs + asociaciones de destinos; retirar semillas mock de 007; admin de hubs como producto desaparece. Copy admin permanece «Actividad». Fuera de alcance: mapa unificado, RAG, filtrado de especies/experiencias por actividad, fusión de CRUDs hijos.

## Technical Context

**Language/Version**: TypeScript (`strictNullChecks`), Next.js 16 App Router, React 19  
**Primary Dependencies**: Prisma 7, Zod, Lucide (catálogo cerrado), Embla (home), componentes `sucre-natural/*` reutilizados en ficha de actividad, galería/`sharp`  
**Storage**: MySQL/MariaDB vía Prisma; fotos en `public/uploads/...` vía `/api/media`  
**Testing**: Vitest (unit / integration / component), Playwright e2e  
**Target Platform**: Web (localhost:3000 / standalone EasyPanel)  
**Project Type**: Web application (Next.js fullstack)  
**Performance Goals**: Sección «Qué hacer» útil en home < 3 s; ficha de tema carga listado principal sin waterfall innecesario (destinos o catálogo global según modo)  
**Constraints**: Solo admin muta; Zod + `assertAdminAction`; listados biodiversidad/experiencias globales por modo; categorías Qué hacer dejan de ser requisito de producto (UI dormida o retirada); no RAG/mapa unificado  
**Scale/Scope**: 7 actividades canónicas + CRUD abierto; 1 plantilla pública temática; redirects 7 hubs; extensión admin Actividades + destinos (entrada dual); deprecación admin hubs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality & Maintainability**: Extender `QueHacerActivity` en lugar de un tercer CMS. Reutilizar plantilla/visual de Sucre Natural desde `/que-hacer/[slug]`. Lógica pura (`listingMode`, mapa hub→slug, accent) en `src/lib/*` con tests. Un solo join destino↔actividad como taxonomía pública.
- **Risk-Proportional Testing**: Unit (modo listado, redirects map, accent CSS vars, schema). Integration (migración/seed idempotente, CRUD con listingMode, asociación dual, 404/redirect). Component (home 7 tarjetas; ficha por modo). E2E: home → tema → destino/especie/experiencia; URL antigua hub → canónica.
- **Security Boundaries**: `assertAdminAction` + layout personalizar; validar `listingMode`, `accentHsl`, slugs, media URLs; lectura pública solo `published`; errores en español.
- **Operational Observability**: Logs en seed/migración (`created/updated/skippedManaged/unpublishedMock`) y en actions al fallar; redirect fallido (slug ausente) logueable en severidad warning.
- **Performance & Accessibility**: `Promise.all` en home; ficha RSC; teclado, alt, contraste overlay, pictograma no único significado; `prefers-reduced-motion` en autoplay home.

**Post-design**: Constitution OK. Complejidad justificada: migración de `ImperdibleDestinationHub` → `QueHacerActivityOnDestination` + redirects; tablas `QueHacerCategory*` se dormitan (no drop obligatorio en v1) para bajar riesgo. Sin violaciones que exijan Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/008-unificar-actividades-temas/
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
├── schema.prisma                 # QueHacerActivity + listingMode/tagline/accent; migrar hubs
├── migrations/…                  # add columns; data migration hub→activity; drop hub FK usage
├── seed.ts                       # seed 7 actividades canónicas; unpublish mock 007
└── data/que-hacer-temas-seed.ts  # dataset 7 temas (antes hubs)

src/lib/
├── actions/que-hacer.ts          # + listingMode, accent, tagline, intro; sin categorías UI
├── actions/imperdibles.ts        # destinationIds ↔ activityIds (dual); deprecar hubIds
├── que-hacer-schema.ts
├── que-hacer-listing-mode.ts     # enum + guards (puro)
├── que-hacer-hub-legacy.ts       # mapa hubId → slug canónico + redirect helpers (puro)
├── get-que-hacer-home.ts
├── get-que-hacer-detail.ts       # payload por modo (destinos | spp | experiencias)
├── sucre-natural-hubs.ts         # acentos legacy → seed; o reexport mínimo para redirects
└── que-hacer-revalidate.ts

src/app/
├── que-hacer/[slug]/page.tsx    # plantilla temática unificada (reusa componentes SN)
├── sucre-natural/[hub]/page.tsx # redirect permanente → /que-hacer/{slug}
├── sucre-natural/page.tsx        # portada: enlaces a /que-hacer/* o redirect a home#que-hacer
└── admin/personalizar/
    ├── que-hacer/                # único admin de temas
    └── sucre-natural/            # retirar nav/CRUD hubs; conservar biodiversidad/experiencias

src/components/
├── ActivitiesSection.tsx         # sin cambio de contrato mayor; items = temas
├── que-hacer/activity-theme-page.tsx  # ficha pública temática
└── admin/que-hacer-admin.tsx     # campos nuevos; ocultar categorías
```

**Structure Decision**: App Router fullstack existente. Unificar en el módulo `que-hacer-*`; Sucre Natural queda como marca visual + rutas hijas (especies/experiencias) y redirects de hubs. No monorepo ni API JSON nueva.

## Complexity Tracking

> Vacío: el Constitution Check no tiene violaciones.

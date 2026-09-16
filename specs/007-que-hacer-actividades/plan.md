# Implementation Plan: CMS de actividades «Qué hacer en Sucre»

**Branch**: `007-que-hacer-actividades` (directorio de spec; git permanece en la rama actual — el usuario pidió no crear rama) | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-que-hacer-actividades/spec.md`

## Summary

Sustituir el mock de `ActivitiesSection` por un CMS de actividades y categorías, distinto de Sucre Natural. Home: pictograma + título + descripción; carrusel de tarjetas si hay más de 5; fondo con fotos en autoplay pausable. Ficha pública `/que-hacer/[slug]` con carrusel de fotos y destinos enlazados. Categorías M-N con actividades y con `ImperdibleDestination`. Seed de los cinco ítems actuales. Sin mapa unificado, RAG, itinerarios ni favoritos.

## Technical Context

**Language/Version**: TypeScript 5 (`strictNullChecks`), Next.js 16 App Router, React 19  
**Primary Dependencies**: Prisma 7, Zod, Lucide (catálogo cerrado), Embla Carousel + Autoplay (ya en Imperdibles), galería/`sharp` existente  
**Storage**: MySQL/MariaDB vía Prisma; fotos en `public/uploads/gallery/images` servidas por `/api/media`  
**Testing**: Vitest (unit junto a `src/lib`, integration, component Testing Library), Playwright e2e  
**Target Platform**: Web (localhost:3000 / contenedor standalone EasyPanel)  
**Project Type**: Web application (Next.js fullstack)  
**Performance Goals**: Encabezado y primeras tarjetas de «Qué hacer» visibles en <3 s; fondo no descarga todas las fotos de todas las galerías (solo covers)  
**Constraints**: Solo admin muta; Zod + `assertAdminAction`; slugs `[a-z0-9-]+`; ≥1 foto para publicar; umbral carrusel home = 5; `prefers-reduced-motion` detiene autoplay; no RAG/n8n; no fusionar hubs 006  
**Scale/Scope**: 5 categorías + 5 actividades de seed; CRUD abierto; 1 ruta pública nueva + sección home + extensión de ficha de destino y admin destinos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality & Maintainability**: Reutilizar galería, `toServedMediaUrl`, `slugifyImperdible`, `GalleryPickerDialog`, layout admin, patrón seed `seedManaged`. Lógica pura en `src/lib/que-hacer-*.ts` (+ tests). No duplicar destinos ni hubs.
- **Risk-Proportional Testing**: Unit (iconos, umbral carrusel, cover/huérfanos, schema). Integration (CRUD, publish, M-N, 404, seed, bloqueo galería). Component (0/5/6 ítems, pausa). E2E home → ficha seed.
- **Security Boundaries**: `assertAdminAction` + `requireAdminSession` en `/admin/personalizar`. Validar URLs de medios y slugs. Lectura pública solo visible. Errores en español sin stack.
- **Operational Observability**: `console.error` con nombre de acción; seed loguea created/updated/skippedManaged. Sin PII.
- **Performance & Accessibility**: RSC carga el payload en `page.tsx` con `Promise.all` (hero, imperdibles, que-hacer). Cliente solo para carruseles. Teclado, alt, pausa, contraste de overlay, pictograma no es el único significado.

**Post-design**: tres joins M-N están justificados por el spec (taxonomía vs enlace editorial). Catálogo Lucide en código evita import dinámico inseguro. Constitución cumplida; no hay violaciones que registrar en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/007-que-hacer-actividades/
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
├── schema.prisma                    # QueHacer* + relaciones en ImperdibleDestination
├── seed.ts                          # + seedQueHacer()
└── data/que-hacer-seed.ts           # 5 categorías / 5 actividades

src/lib/
├── actions/que-hacer.ts
├── actions/imperdibles.ts           # + queHacerCategoryIds
├── actions/gallery.ts               # bloquear delete si foto Qué hacer
├── que-hacer-icons.ts               # catálogo Lucide (puro)
├── que-hacer-home.ts                # umbral carrusel, payload (puro + I/O split)
├── que-hacer-photos.ts              # cover, huérfanos (puro)
├── que-hacer-schema.ts              # Zod
├── gallery-que-hacer-references.ts
├── get-que-hacer-home.ts            # I/O home
├── get-que-hacer-detail.ts          # I/O ficha
├── get-imperdible-detail.ts         # + actividades relacionadas
└── sucre-natural-revalidate.ts      # o que-hacer-revalidate.ts dedicado

src/app/
├── page.tsx                         # Promise.all + payload
├── que-hacer/[slug]/page.tsx
└── admin/personalizar/que-hacer/page.tsx

src/components/
├── ActivitiesSection.tsx            # deja de usar mock; recibe payload
├── HomePage.tsx                     # pasa payload
├── que-hacer/activity-detail.tsx    # ficha pública
├── admin/que-hacer-admin.tsx
└── admin/admin-shell.tsx            # nav
  + destinos dialog: categorías Qué hacer
  + ficha-destino: bloque actividades
```

**Structure Decision**: App Router fullstack existente. Módulo nuevo `que-hacer-*` en `src/lib` y admin kebab-case, alineado a Imperdibles/Sucre Natural. No monorepo ni API JSON pública.

## Complexity Tracking

> Vacío: el Constitution Check no tiene violaciones.

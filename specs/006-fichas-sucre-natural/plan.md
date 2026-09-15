# Implementation Plan: Fichas de destino y micrositios Sucre Natural

**Branch**: `006-fichas-sucre-natural` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/006-fichas-sucre-natural/spec.md`

## Summary

Extender el CMS de `ImperdibleDestination` con ficha estructurada (campos + relaciones), siete hubs Sucre Natural de catálogo cerrado, catálogo de biodiversidad, experiencias de naturaleza y carga inicial desde `docs/fichas_destinos/transcripciones.md`. Páginas públicas interactivas con estética de las láminas (papel crema, paletas por hub, polaroids); no servir PNG/PDF. Conservar `/imperdibles/[slug]` y el detalle Markdown como respaldo. No implementar mapa unificado ni RAG.

## Technical Context

**Language/Version**: TypeScript 5 (strictNullChecks), Next.js 16 App Router, React 19  
**Primary Dependencies**: Prisma 7, Zod, next/font (Playfair Display + DM Sans; Caveat opcional para rótulos manuscritos), Lucide, sharp/galería existente, Maps Embed ya usado en Imperdibles  
**Storage**: MySQL/MariaDB (XAMPP local) vía Prisma; medios en `public/uploads/gallery/...` servidos por `/api/media`  
**Testing**: Vitest (unit junto a `src/lib`, integration en `src/test/integration`, component Testing Library), Playwright e2e  
**Target Platform**: Web (localhost:3000 / contenedor standalone EasyPanel)  
**Project Type**: Web application (Next.js fullstack)  
**Performance Goals**: Contenido principal de hub/ficha visible en <3 s en conexión urbana; galería no bloquea LCP; listados públicos con consultas indexadas `published`  
**Constraints**: Solo admin muta; validación Zod en server actions; `assertAdminAction`; slugs `[a-z0-9-]+`; coordenadas opcionales; tope de home Imperdibles sigue siendo 20 **destacados**, no 20 publicados; sin RAG/n8n/PGVector; sin mapa unificado  
**Scale/Scope**: 7 hubs, ~24 destinos de ficha, ~28 entradas de biodiversidad, 6 experiencias, 7 fuentes; 4 rutas públicas nuevas + extensión de detalle y admin

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality & Maintainability**: Reutilizar acciones, galería, `toServedMediaUrl`, slugify y layout admin de Imperdibles. Transformaciones puras en `src/lib/sucre-natural*.ts` (+ tests al lado). Hubs cerrados en código + fila editable, no un segundo CMS de destinos.
- **Risk-Proportional Testing**: Unit (resolución ficha vs Markdown, paleta/hub, merge de seed, referencias de galería, ocultar bloques vacíos). Integration (CRUD admin, publish/unpublish, consultas públicas, revalidate paths, seed idempotente). Component (ficha oculta secciones vacías; hub lista). E2E (portada → hub → ficha; admin publica).
- **Security Boundaries**: `assertAdminAction` + `requireAdminSession` en `/admin/personalizar`. Zod en todos los mutadores. URLs de medios con prefijo `/uploads/...` y rechazo de `..`. Errores en español sin stack. Lectura pública solo `published`.
- **Operational Observability**: `console.error` con nombre de acción en fallos Prisma; seed loguea altas/omitidos/errores por slug. Sin PII.
- **Performance & Accessibility**: RSC para listados; `priority` solo en hero de ficha; `unoptimized` en uploads como el resto. Teclado, alt en imágenes, contraste de texto sobre papel crema, iconos con etiqueta. Paleta de marca no es el único distintivo.

**Post-design**: el desglose `published` vs `showOnHome` evita el tope actual de 20 publicados (incompatible con 24 fichas). Coordenadas y `cardImageUrl` pasan a opcionales. Constitución sigue cumplida; no hay violaciones que justificar.

## Project Structure

### Documentation (this feature)

```text
specs/006-fichas-sucre-natural/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── public-routes.md
│   └── admin-actions.md
└── tasks.md              # /speckit-tasks — no creado aquí
```

Fuente editorial (ya existe): `docs/fichas_destinos/transcripciones.md`

### Source Code (repository root)

```text
prisma/
├── schema.prisma
├── seed.ts                          # roles + seed Sucre Natural
└── data/sucre-natural-seed.ts       # datos tipados (no parsear el .md en runtime)

src/lib/
├── actions/imperdibles.ts           # extender + revalidate Sucre Natural
├── actions/sucre-natural.ts         # hubs, especies, experiencias, fuentes
├── sucre-natural-hubs.ts            # catálogo cerrado + paletas (puro)
├── sucre-natural-resolve.ts         # ficha estructurada vs Markdown (puro)
├── sucre-natural-seed-merge.ts      # política de recarga (puro)
├── gallery-sucre-natural-references.ts
├── get-imperdible-detail.ts         # incluir ficha + relaciones
├── get-imperdibles-home.ts          # filtrar showOnHome
└── media-url.ts                     # sin cambios de contrato

src/app/
├── sucre-natural/page.tsx
├── sucre-natural/[hub]/page.tsx
├── sucre-natural/especies/[slug]/page.tsx
├── sucre-natural/experiencias/[slug]/page.tsx
├── imperdibles/[slug]/page.tsx      # layout ficha o Markdown
└── admin/personalizar/
    ├── destinos-imperdibles/        # formulario extendido
    ├── sucre-natural/               # copy de hubs
    ├── biodiversidad/
    └── experiencias-naturaleza/

src/components/
├── sucre-natural/                   # portada, hub, ficha, polaroid, chips
└── admin/                           # diálogos/CRUD extendidos

src/lib/*.test.ts
src/test/integration/sucre-natural*.integration.test.ts
src/test/components/sucre-natural*.component.test.tsx
e2e/critical-flows.spec.ts           # casos extra
```

**Structure Decision**: monorepo Next.js existente. Dominio público bajo `src/app/sucre-natural` y componentes `src/components/sucre-natural`. Persistencia en Prisma; I/O en `src/lib/actions`; puros en `src/lib`.

## Complexity Tracking

> Sin violaciones de constitución.

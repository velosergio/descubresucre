# Implementation Plan: Convocatorias (CMS)

**Branch**: `010-convocatorias-cms` | **Date**: 2026-10-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-convocatorias-cms/spec.md`

## Summary

Convertir `ConvocatoriasSection` (hoy cuatro tarjetas hardcodeadas sin enlace real) en un CMS administrable. Modelo único `Convocatoria` con título, descripción, audiencia, tipo (etiqueta libre), fecha límite y enlace externo obligatorio (http/https). CRUD admin bajo `/admin/personalizar/convocatorias` con el patrón `assertAdminAction` + Zod + `revalidatePath`. Home: SSR vía `getConvocatoriasForHome()` en el `Promise.all` de `page.tsx`; solo publicadas con fecha límite vigente; estado vacío explícito; "Más información" es un `<a>` al enlace externo. Sin página de detalle, sin API pública de listado, sin seed de mocks. Fuera de alcance: inscripciones internas, adjuntos, filtros por tipo, chatbot/RAG.

## Technical Context

**Language/Version**: TypeScript (`strictNullChecks`), Next.js 16 App Router, React 19
**Primary Dependencies**: Prisma 7, Zod, `framer-motion/m` (animación de sección existente), shadcn admin UI
**Storage**: MySQL/MariaDB vía Prisma; sin medios nuevos (sin imagen por convocatoria en esta versión)
**Testing**: Vitest (unit / integration / component), Playwright e2e
**Target Platform**: Web (localhost:3000 / standalone EasyPanel)
**Project Type**: Web application (Next.js fullstack, monolito existente)
**Performance Goals**: Sección de home dentro del presupuesto normal del `Promise.all` de `page.tsx` (consulta indexada, volumen bajo)
**Constraints**: Solo staff (admin/editor) muta vía `assertAdminAction` + Zod; lectura pública solo `published=true` y `deadline` vigente; URL externa http/https obligatoria; sin detalle interno; sin catálogo de tipos
**Scale/Scope**: 1 modelo nuevo; 1 sección de home refactorizada; 1 pantalla admin; 3 server actions; 0 route handlers públicos nuevos; eliminación del array mock en `ConvocatoriasSection.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality & Maintainability**: Un solo modelo y un solo módulo de home. Lógica pura testeable: validación Zod (`convocatoria-schema.ts`) y helper de “vigente hoy” / formateo de fecha (`convocatoria-deadline.ts` o equivalente) en `src/lib/*.ts` con `*.test.ts` al lado. CRUD admin copia el esqueleto de `cultural-events.ts` / `imperdibles.ts` (sin patrón nuevo).
- **Risk-Proportional Testing**: Toca persistencia, autorización y validación de URL → pruebas automatizadas (Constitución II). Unit: schema Zod + reglas de vigencia de fecha. Integration: server actions (RBAC + validación + revalidate) y lectura pública. Component: sección home (lista, vacío, enlace externo) y formulario admin. E2E: crear convocatoria → aparece en home → enlace presente; añadir a `critical-flows.spec.ts`.
- **Security Boundaries**: Mutaciones con `assertAdminAction()` primero; Zod sanea textos, fecha y URL (`http`/`https` únicamente; rechazar `javascript:`, rutas relativas, etc.). Lectura pública filtra `published` + deadline vigente. Sin secretos nuevos.
- **Operational Observability**: Errores en create/update/delete con `console.error` (operación + id), mismo nivel que el resto del CMS.
- **Performance & Accessibility**: Una query indexada `[published, deadline]` en el SSR de home. Enlace externo como `<a target="_blank" rel="noopener noreferrer">` con texto claro e indicación de destino externo; operable por teclado; badges de tipo no son el único portador de significado.

**Post-design**: Constitution OK tras Fase 1. Sin violaciones — modelo plano, sin relaciones, reutiliza auth/revalidate existentes. Complexity Tracking vacío.

## Project Structure

### Documentation (this feature)

```text
specs/010-convocatorias-cms/
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
├── schema.prisma                       # + model Convocatoria
└── migrations/…                        # add table convocatorias

src/lib/
├── actions/convocatorias.ts            # create/update/delete (assertAdminAction + Zod + revalidatePath)
├── convocatoria-schema.ts              # Zod schema
├── convocatoria-schema.test.ts
├── get-convocatorias-home.ts           # lectura pública (published + deadline vigente)
├── convocatoria-deadline.ts            # puro: startOfToday, isDeadlineOpen, formatDeadlineLabel
└── convocatoria-deadline.test.ts

src/app/
├── admin/personalizar/
│   ├── convocatorias/page.tsx          # admin CRUD
│   └── layout.tsx                      # sin cambio (ya exige staff)
└── page.tsx                            # + getConvocatoriasForHome() en Promise.all

src/components/
├── ConvocatoriasSection.tsx            # recibe payload; sin array mock; estado vacío
├── HomePage.tsx                        # + prop convocatoriasPayload
└── admin/
    └── convocatorias-admin.tsx         # CRUD admin (kebab-case)

src/components/admin/admin-shell.tsx    # + nav item Convocatorias
src/app/admin/personalizar/page.tsx     # + card hub Convocatorias

src/test/
├── integration/
│   └── convocatorias-admin.integration.test.ts
└── components/
    ├── convocatorias-section.component.test.tsx
    └── convocatorias-admin.component.test.tsx

e2e/critical-flows.spec.ts              # + escenario "convocatorias"
```

**Structure Decision**: App Router fullstack existente. Módulo autocontenido `convocatorias*` siguiendo el esqueleto de eventos/qué-hacer: modelo, actions, lectura pública SSR, sección home, pantalla admin. Sin route handler público (la home no necesita refetch cliente). El mock interno de `ConvocatoriasSection.tsx` se elimina en el mismo cambio.

## Complexity Tracking

> Vacío: el Constitution Check no tiene violaciones.

# Implementation Plan: Personalizar banner del hero

**Branch**: `003-personalizar-hero` | **Date**: 2026-05-02 | **Spec**: [spec.md](./spec.md)

## Summary

Añadir configuración global del hero (singleton en MySQL vía Prisma), panel admin bajo `/admin/personalizar` y `/admin/personalizar/banner` con subida a `public/uploads/hero/`, y render condicional en la home según modo: imagen por defecto (`hero-sucre.jpg`), imagen subida, vídeo (archivo o URL HTTPS), o carrusel (Embla existente) con autoplay opcional.

## Technical Context

**Language/Version**: TypeScript 6.x, Node para tooling  
**Primary Dependencies**: Next.js 16 App Router, Prisma 7, React 19, Zod, Embla Carousel  
**Storage**: MySQL via Prisma; archivos en `public/uploads/hero/{images,video}/`  
**Testing**: Vitest unit para helpers en `src/lib`  
**Target Platform**: Web (Next.js SSR + cliente)  
**Project Type**: Monorepo aplicación web única (`src/`)  
**Performance Goals**: Primera imagen del hero con `priority` cuando sea imagen única; vídeo `muted` `playsInline`  
**Constraints**: Sin secretos en cliente; validación server-side de subidas  
**Scale/Scope**: Un registro de configuración; tráfico típico sitio turístico

## Constitution Check

- **Calidad**: Lógica de resolución del hero centralizada en `src/lib/hero-appearance.ts`; acciones en `src/lib/actions/hero-appearance.ts`.
- **Pruebas**: Tests unitarios para validación de payloads y resolución desde fila DB simulada (helpers puros donde aplique).
- **Seguridad**: `assertAdminAction` en subidas y guardado; tipos MIME y tamaño máximo; URLs externas solo HTTPS (localhost HTTP solo si coincide patrón existente del proyecto para webhooks).
- **Observabilidad**: `console.error` en catch de acciones con mensaje genérico al cliente.
- **Rendimiento / A11y**: `page.tsx` servidor provee props iniciales; overlay conservado; vídeo sin audio.

## Project Structure

### Documentation (this feature)

```text
specs/003-personalizar-hero/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code

```text
src/
├── app/
│   ├── admin/personalizar/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── banner/page.tsx
│   └── page.tsx                 # pasa hero config a HomePage
├── components/
│   ├── admin/hero-banner-settings-form.tsx
│   └── HeroSection.tsx
├── lib/
│   ├── hero-appearance.ts       # tipos, resolve, validación
│   └── actions/hero-appearance.ts
prisma/
├── schema.prisma
└── migrations/
public/uploads/hero/             # ignorado salvo .gitkeep
```

**Structure Decision**: Patrón ya usado en `ChatbotSettings` + server actions como `chatbot-settings.ts`.

## Complexity Tracking

Ninguna violación que requiera tabla adicional.

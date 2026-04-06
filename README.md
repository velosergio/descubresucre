# Descubre Sucre

Aplicacion web de turismo para el departamento de Sucre, Colombia. Presenta destinos, actividades, agenda cultural, eventos, convocatorias y un chat guia para orientar al visitante.

## Stack tecnologico

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS + componentes `shadcn/ui` (Radix UI)
- Framer Motion (animaciones)
- TanStack React Query (proveedor global listo para consumo de APIs)
- Vitest + Testing Library (tests)

## Arquitectura del proyecto

- Enrutado (App Router):
  - `/` → inicio (`src/app/page.tsx` + `HomePage`)
  - rutas no definidas → `src/app/not-found.tsx`
- La home se compone de secciones:
  - `HeroSection`
  - `PromoCards`
  - `ActivitiesSection`
  - `EventsSection`
  - `CulturalAgenda`
  - `MapSection`
  - `ConvocatoriasSection`
  - `Footer`
  - `ChatModal`

Estructura base:

```txt
src/
  assets/          # Imagenes y recursos visuales
  components/      # Secciones y componentes de dominio
  components/ui/   # Componentes UI reutilizables (shadcn)
  hooks/           # Hooks compartidos
  lib/             # Utilidades
  app/             # Rutas y layout (Next.js App Router)
  test/            # Setup y pruebas
```

## Requisitos

- Node.js 20+ recomendado
- npm

## Instalacion y ejecucion local

```bash
npm install
npm run dev
```

La app queda en `http://localhost:3000` por defecto (`next dev`).

## Scripts disponibles

- `npm run dev`: servidor de desarrollo (Next.js)
- `npm run build`: build de produccion
- `npm run start`: servidor de produccion (tras `build`)
- `npm run preview`: alias de `next start`
- `npm run lint`: **ESLint CLI** (`eslint .`). No uses `next lint` (deprecado en Next 16+).
- `npm run test`: corre pruebas una vez
- `npm run test:watch`: corre pruebas en modo observacion

## Pruebas y calidad

Para validar cambios antes de subirlos:

```bash
npm run lint
npm run test
```

## Integraciones y notas tecnicas

- El mapa usa `OpenStreetMap` embebido mediante `iframe`.
- El chat de guia turistica es actualmente una simulacion local (respuestas predefinidas por palabras clave), no consume un backend de IA externo.
- Hay proveedor de React Query configurado globalmente para futuras integraciones con API.

## Despliegue

Build con salida `standalone` para contenedores (ver `Dockerfile`):

```bash
npm run build
```

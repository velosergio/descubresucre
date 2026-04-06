# Descubre Sucre

Aplicacion web de turismo para el departamento de Sucre, Colombia. Presenta destinos, actividades, agenda cultural, eventos, convocatorias y un chat guia para orientar al visitante.

## Stack tecnologico

- React 19 + TypeScript
- Vite 8
- Tailwind CSS + componentes `shadcn/ui` (Radix UI)
- Framer Motion (animaciones)
- React Router DOM
- TanStack React Query (proveedor global listo para consumo de APIs)
- Vitest + Testing Library (tests)

## Arquitectura del proyecto

- Enrutado principal:
  - `/` -> pagina de inicio (`Index`)
  - `*` -> pagina `NotFound`
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
  pages/           # Paginas del router
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

La app quedara disponible en la URL local que entregue Vite (por defecto suele ser `http://localhost:5173`).

## Scripts disponibles

- `npm run dev`: inicia servidor de desarrollo
- `npm run build`: genera build de produccion
- `npm run build:dev`: build en modo development
- `npm run preview`: sirve el build localmente
- `npm run lint`: ejecuta ESLint
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

Genera el build y publica la carpeta de salida de Vite (`dist/`) en tu proveedor favorito:

```bash
npm run build
```

# Contracts: server actions admin (Eventos y Agenda Cultural)

`"use server"`, `assertAdminAction()` primero, Zod, `{ ok: true, ... } | { ok: false, error: string }` en español. Layout `/admin/personalizar` exige sesión de staff (admin/editor); `assertAdminAction()` es la puerta real en cada mutación.

Módulo: `src/lib/actions/cultural-events.ts`. Schema: `src/lib/cultural-event-schema.ts`.

## `createCulturalEventAction` / `updateCulturalEventAction`

```text
title, description, category, location,
startsAt,                # ISO string; requerido
endsAt?,                 # ISO string; opcional, >= startsAt
allDay?,                 # boolean; default true
imageUrl?,                # string | null; URL ya subida vía uploadGalleryAssetAction o elegida en GalleryPickerDialog
mapLat?, mapLng?,          # number | null; ambos o ninguno
published?                # boolean; default true
```

Reglas:
- `title`, `description`, `category`, `location`, `startsAt` obligatorios; primer error de Zod se devuelve como `error` en español (mismo patrón que `imperdibles.ts`).
- `endsAt` anterior a `startsAt` → error "La fecha de fin no puede ser anterior a la de inicio."
- Solo uno de `mapLat`/`mapLng` presente → error "Completa ambas coordenadas o ninguna."
- `updateCulturalEventAction` recibe además `id`; evento inexistente → `{ ok: false, error: "Evento no encontrado." }`.

Revalidate tras crear/editar/eliminar: `/`, `/admin/personalizar/eventos`.

## `deleteCulturalEventAction`

```text
id
```

Borrado directo (sin dependientes: el evento no tiene fotos de galería propias ni relaciones hijas). Revalidate igual que arriba.

## Lectura pública (no es action, es función pura + route handler)

`getCulturalEventsForMonth({ year, month })` en `src/lib/get-cultural-events-home.ts` — sin `"use server"`, se llama directamente desde `src/app/page.tsx` (RSC) y desde `src/app/api/cultural-events/route.ts`. No requiere `assertAdminAction` (lectura pública, solo `published = true`).

## Imagen del evento

Reutiliza sin cambios `uploadGalleryAssetAction` (`src/lib/actions/gallery.ts`) y `GalleryPickerDialog` — mismo componente/acción que ya usa el formulario de Destinos Imperdibles para `cardImageUrl`. Ningún contrato nuevo de subida.

## Errores (ejemplos)

- Falta título/fecha → «Completa los campos obligatorios: título, fecha, lugar, categoría y descripción.»
- Fecha de fin inválida → «La fecha de fin no puede ser anterior a la de inicio.»
- Coordenadas incompletas → «Completa ambas coordenadas o ninguna.»
- Sin sesión de staff → «No autorizado.» (mensaje estándar de `assertAdminAction`)

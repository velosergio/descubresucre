# Contracts: server actions admin (Qué hacer)

Todas las mutaciones: `"use server"`, `assertAdminAction()` primero, Zod, retorno `{ ok: true, ... } | { ok: false, error: string }` en español. Layout `/admin/personalizar` ya exige admin.

Módulo: `src/lib/actions/que-hacer.ts`.

## Actividades

### `createQueHacerActivityAction` / `updateQueHacerActivityAction`

```text
title, description, slug?, iconKey,
published, sortOrder?,
photoUrls: string[],          # orden = sortOrder; cover = índice 0 salvo coverUrl
coverUrl?: string,            # debe estar en photoUrls
photoAlts?: (string | null)[],
categoryIds: string[],
destinationIds: string[]
```

Si `slug` vacío en create: `slugifyImperdible(title)` (mismo helper; fallback `actividad` si el título no da slug). Unique; colisión → error en español.

`iconKey` ∉ catálogo → error.

`published === true` && fotos vivas = 0 → `{ ok: false, error: "Publica al menos una foto de la galería." }`.

URLs: prefijo `/uploads/gallery/images/` o `/uploads/gallery/` de imagen, rechazo `..`.

Al guardar: `seedManaged = false` si el registro existía. Create manual: `seedManaged = false`.

Revalidate: `/`, `/que-hacer/{slug}`, destinos enlazados, admin que-hacer.

### `deleteQueHacerActivityAction(id)`

Cascade fotos y joins. Revalidate home, ficha, destinos que la citaban.

### `reorderQueHacerActivitiesAction`

Lista de `{ id, sortOrder }` de todas las filas o de las afectadas.

## Categorías

### `createQueHacerCategoryAction` / `updateQueHacerCategoryAction`

```text
name, slug?, description?, sortOrder?
```

Slug único. Update: `seedManaged = false`.

### `deleteQueHacerCategoryAction(id)`

Elimina la categoría y joins. Actividades y destinos permanecen.

## Destinos (extiende `src/lib/actions/imperdibles.ts`)

Payload adicional:

```text
queHacerCategoryIds?: string[]
```

Replace-set de `QueHacerDestinationOnCategory`. No altera publicación del destino. Revalidate detalle del destino y admin destinos / que-hacer.

## Galería

`deleteGalleryAssetAction`: además de hero, Imperdibles y Sucre Natural, consultar `QueHacerActivityPhoto.publicUrl`. Si está en uso → no borrar, mensaje en español.

Función pura `isGalleryUrlUsedByQueHacer(urls, needle)` + query en la action (mismo estilo que `gallery-sucre-natural-references.ts`).

## Carga inicial

No es server action de UI.

```bash
npm run db:seed
```

`prisma/seed.ts` llama `seedQueHacer()` después de Sucre Natural (o en paralelo de datos independientes; orden: roles → Sucre Natural → Qué hacer, para poder enlazar destinos en el futuro). Idempotente por slug.

Log:

```text
Que hacer seed: created=N updated=N skippedManaged=N
```

Copiar imágenes mock a `public/uploads/gallery/images/` con nombres estables; upsert `GalleryAsset` por `publicUrl`.

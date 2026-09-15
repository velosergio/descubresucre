# Contracts: server actions admin

Todas las mutaciones: `"use server"`, `assertAdminAction()` primero, Zod, retorno `{ ok: true, ... } | { ok: false, error: string }` en español. Layout `/admin/personalizar` ya exige admin.

## Destinos (extiende `src/lib/actions/imperdibles.ts`)

Payload adicional sobre el actual:

```text
municipality?, region?, locationLabel?, ecosystems?, approach?, specialWhy?,
howToArrive?, climate?, recommendedTime?, audience?, mapNote?,
liveActivities?: { title, iconKey? }[],
responsibleTips?: string[],
biodiversityChipLabels?: string[],
hubIds: SucreNaturalHubId[],   # 0..7; ficha estructurada recomienda ≥1
galleryUrls?: string[],        # orden = sortOrder
sourceIds?: string[],
biodiversityIds?: string[],
experienceIds?: string[],      # opcional inverso; o se edita desde la experiencia
showOnHome: boolean,
published: boolean,
mapLat?: number, mapLng?: number, mapZoom?: number,
cardImageUrl?: string          # vacío permitido
```

`showOnHome && published`: si el conteo de otros destacados ≥ 20, `{ ok: false, error: "Solo puedes destacar hasta 20 destinos en la home." }`.

`published` ya **no** está limitado a 20.

Al guardar: `seedManaged = false` si el registro existía (edición humana). Create manual: `seedManaged = false`.

Revalidate: `/`, `/imperdibles/{slug}`, `/sucre-natural`, layout hubs, admin.

Delete: igual que hoy + revalidate Sucre Natural.

## Hubs — `saveSucreNaturalHubAction`

```text
id: hubId (debe existir),
title, tagline?, introMarkdown?, coverImageUrl?
```

No create/delete de ids nuevos.

## Biodiversidad — CRUD

`createBiodiversityEntryAction` / `update` / `delete` / list implícito en la página.

Campos según data-model. `destinationIds?: string[]`.

## Experiencias — CRUD

Análogo. `destinationIds?: string[]`. `whatYouDo` y `recommendations` arrays de strings.

## Fuentes

`upsertContentSourceAction` (admin puede añadir URL). Seed cubre las 7; el admin no está obligado a crearlas a mano.

## Galería

`deleteGalleryAssetAction`: además de hero y `cardImageUrl`, consultar gallery items, covers de hub, imagen de especie y de experiencia.

## Carga inicial

No es server action de UI. Comando:

```bash
npm run db:seed
```

`prisma/seed.ts` llama `seedSucreNatural()` después de roles. Idempotente por slug. Log:

```text
Sucre Natural seed: created=N updated=N skippedManaged=N
```

Errores de un slug no abortan todo el lote; se registran y el proceso termina ≠ 0 si hubo fallos duros (BD caída).

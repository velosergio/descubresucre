# Data model: Unificar hubs en Actividades

Extiende el modelo 007. Los hubs `SucreNaturalHub` dejan de ser el contenedor público; la actividad es el tema.

## Constantes (código)

```text
QUE_HACER_HOME_CAROUSEL_AFTER = 5
QUE_HACER_MAX_PHOTOS = 12
QUE_HACER_AUTOPLAY_MS = 5000
SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
CANONICAL_THEME_SLUGS = playas|cienagas|rios|paisajes|biodiversidad|senderos|experiencias
LEGACY_HUB_IDS = mismos 7 (1:1 con slug)
```

### `QueHacerListingMode` (enum Prisma)

| Value          | Página pública lista                         |
|----------------|-----------------------------------------------|
| DESTINATIONS   | Destinos publicados del join actividad        |
| BIODIVERSITY   | Todas las `BiodiversityEntry` publicadas      |
| EXPERIENCES    | Todas las `NatureExperience` publicadas       |

Seed: Biodiversidad → `BIODIVERSITY`; Experiencias → `EXPERIENCES`; resto → `DESTINATIONS`.

## QueHacerActivity (extendido)

| Field          | Type     | Notes |
|----------------|----------|-------|
| id             | String PK | cuid |
| slug           | String UQ | `/que-hacer/[slug]`; canónicos = hub ids |
| title          | String   | máx. 120 |
| description    | Text     | copy home / intro corta |
| tagline        | String?  | lema hub; máx. 500 |
| introMarkdown  | Text?    | intro página tema |
| iconKey        | String   | catálogo Lucide |
| accentHsl      | String?  | p. ej. `"174 62% 35%"` (sin `hsl()`); default en create |
| listingMode    | Enum     | default `DESTINATIONS` |
| published      | Boolean  | default false |
| sortOrder      | Int      | home |
| seedManaged    | Boolean  | |
| createdAt      | DateTime | |
| updatedAt      | DateTime | |

Relaciones: N fotos, N destinos (`QueHacerActivityOnDestination`). Categorías: schema puede permanecer; **no** requisito de producto.

Índice: `@@index([published, sortOrder])`.

### Publicación

Igual que 007: `published` exige ≥1 foto viva en disco. Lectura pública omite huérfanos; sin foto viva → no home / no ficha.

### Identidad visual

`accentHsl` alimenta CSS vars de la plantilla temática. Si null en público: fallback acento del sitio o del mapa legacy por slug canónico.

## QueHacerActivityPhoto

Sin cambio de forma respecto a 007 (`publicUrl`, `sortOrder`, `alt`, `isCover`).

## QueHacerActivityOnDestination (canónico)

| Field         | Type |
|---------------|------|
| activityId    | FK cascade |
| destinationId | FK cascade |
| sortOrder     | Int default 0 |
| @@id          | (activityId, destinationId) |

Misma fila editable desde Actividad y desde Destino.

## Migración desde hubs

### Origen `SucreNaturalHub` + `ImperdibleDestinationHub`

1. Por cada hub id: upsert `QueHacerActivity` con slug=id, title/tagline/intro/cover/sortOrder del hub + def de acento/icono en código, `listingMode` según tabla arriba, `published=true`, `seedManaged=true`.
2. Cover hub → foto `isCover` (GalleryAsset si aplica).
3. Cada `ImperdibleDestinationHub` → `QueHacerActivityOnDestination` (activity por slug=hubId).
4. Tras backfill estable en entornos: dejar de escribir `ImperdibleDestinationHub`; remover UI `hubIds`. Drop de tablas hub en follow-up opcional (v1 puede soft-deprecar: seed deja de depender de hub para público).

### Semillas mock 007

Actividades `seedManaged` con slug ∈ `{cultura, gastronomia, naturaleza}` → unpublish o delete en seed 008. Slugs `playas` / `experiencias` se **actualizan** in-place al contenido canónico (no duplicar).

## QueHacerCategory* (dormido)

Tablas/joins pueden permanecer. Admin no las expone. Home/ficha temática no las muestran. Eliminación física = follow-up.

## Entidades hijas (sin cambio de ownership)

- `ImperdibleDestination` — ficha; `activityIds[]` en admin en lugar de (o además de deprecar) `hubIds` / `queHacerCategoryIds`.
- `BiodiversityEntry`, `NatureExperience` — listados globales por modo; rutas públicas actuales.

## State transitions

```text
draft (published=false) → published (fotos OK, listingMode válido)
published → unpublished (home/ficha/redirect legado → 404)
delete activity → cascade fotos + joins; destinos/especies/experiencias intactos
```

## Validation (Zod admin)

- `listingMode` ∈ enum
- `accentHsl`: opcional; si presente, patrón razonable de 3 números HSL (sin funciones)
- `iconKey` ∈ catálogo
- `slug` regex + unique
- `destinationIds` existen
- publish ⇒ ≥1 foto válida

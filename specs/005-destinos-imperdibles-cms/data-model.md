# Data model: Destinos imperdibles

## ImperdiblesSectionSettings (singleton `id = "singleton"`)

| Field | Type | Notes |
|-------|------|--------|
| displayMode | enum | `GRID_THREE`, `CAROUSEL` |
| itemOrder | enum | `MANUAL`, `RANDOM` |
| headingTitle | String? | Cabecera de sección (opcional) |
| headingSubtitle | String? | Subtítulo bajo la cabecera |
| carouselIntervalMs | Int | Default 5000 |
| updatedAt | DateTime | |

## ImperdibleDestination

| Field | Type | Notes |
|-------|------|--------|
| id | cuid | |
| slug | String unique | URL `/imperdibles/[slug]` |
| title | String | |
| subtitle | String | |
| cardImageUrl | String | `/uploads/gallery/...` |
| bodyMarkdown | Text | |
| mapLat | Decimal(10,7) | |
| mapLng | Decimal(10,7) | |
| mapZoom | Int | Default 14, embed view |
| published | Boolean | |
| sortOrder | Int | Orden manual ascendente |
| createdAt / updatedAt | DateTime | |

## Índices

- `@@index([published, sortOrder])` para listados admin y home.

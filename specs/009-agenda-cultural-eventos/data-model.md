# Data model: Eventos y Agenda Cultural

Modelo nuevo; no extiende ninguno existente (ver `research.md` §1).

## Constantes (código)

```text
EVENT_TITLE_MAX = 200
EVENT_LOCATION_MAX = 300
EVENT_CATEGORY_MAX = 80
MAP_LAT_RANGE = [-90, 90]
MAP_LNG_RANGE = [-180, 180]
ICS_LINE_FOLD_LENGTH = 75          # RFC 5545 (plegado de línea)
```

## `CulturalEvent`

| Field       | Type      | Notes |
|-------------|-----------|-------|
| id          | String PK | cuid |
| title       | String    | máx. 200 |
| description | Text      | descripción libre |
| category    | String    | máx. 80; etiqueta libre, sin catálogo (research §3) |
| location    | String    | máx. 300; texto libre ("Sincelejo", "Plaza Cultural, Sincelejo", …) |
| startsAt    | DateTime  | obligatorio; fecha (+ hora si `allDay=false`) de inicio |
| endsAt      | DateTime? | opcional; fecha (+ hora) de fin, para eventos de varios días |
| allDay      | Boolean   | default `true`; si `false`, la hora de `startsAt`/`endsAt` es significativa |
| imageUrl    | String?   | máx. 2048; URL servida (`/uploads/...`), mismo patrón que `cardImageUrl` |
| mapLat      | Decimal?  | `@db.Decimal(10, 7)`; opcional, junto con `mapLng` |
| mapLng      | Decimal?  | `@db.Decimal(10, 7)`; opcional, junto con `mapLat` |
| published   | Boolean   | default `true`; solo `true` es visible/exportable públicamente |
| createdAt   | DateTime  | `@default(now())` |
| updatedAt   | DateTime  | `@updatedAt` |

Índice: `@@index([published, startsAt])` (consulta principal: eventos publicados dentro de un rango de mes, ordenados por `startsAt`).

Sin relaciones con otros modelos en esta versión (coords quedan listas para el futuro mapa unificado, ROADMAP ítem 11, pero sin FK todavía).

### Regla de mes

Un evento pertenece al mes de su `startsAt` (fecha local del servidor). Un evento cuyo `endsAt` cae en otro mes sigue apareciendo solo bajo el mes de `startsAt` (edge case del spec — sin duplicar ni dividir el evento entre meses).

### Publicación

`published = true` por defecto (a diferencia de `QueHacerActivity`, no exige foto para publicarse: la imagen es opcional en este módulo). Lectura pública y exportación a calendario (`GET .../ics`) MUST ignorar eventos con `published = false` (404 si se solicita su `.ics` directamente).

## Validation (Zod, `cultural-event-schema.ts`)

- `title`: string, 1–200, trim.
- `description`: string, mínimo 1 carácter.
- `category`: string, 1–80, trim.
- `location`: string, 1–300, trim.
- `startsAt`: fecha válida, obligatoria.
- `endsAt`: fecha válida opcional; si presente, `endsAt >= startsAt`.
- `allDay`: boolean, default `true`.
- `imageUrl`: string opcional (URL ya validada por `uploadGalleryAssetAction`/`GalleryPickerDialog`, no se revalida el archivo aquí).
- `mapLat`/`mapLng`: number opcional dentro de sus rangos; ambos presentes o ambos ausentes (si solo llega uno, error "Completa ambas coordenadas o ninguna").
- `published`: boolean, default `true`.

## State transitions

```text
create (published=true por defecto) → visible en home / exportable
published=true → published=false (staff oculta el evento): desaparece de home; .ics existente responde 404
update startsAt (cambia de mes) → el evento se reubica al nuevo mes en el próximo listado
delete → desaparece de home y de la exportación a calendario inmediatamente
```

## Forma pública derivada (no persistida)

`CulturalEventsHomePayload` (tipo TS en `get-cultural-events-home.ts`):

```text
{
  year: number
  month: number            // 1–12
  events: Array<{
    id, title, description, category, location,
    startsAt, endsAt, allDay,
    imageUrl,               // ya resuelto con toServedMediaUrl() o null
    mapLat, mapLng,         // number | null
  }>
}
```

Sin campos de paginación adicionales: la navegación por mes no tiene límite superior/inferior duro (Assumptions del spec); un mes sin eventos simplemente devuelve `events: []`.

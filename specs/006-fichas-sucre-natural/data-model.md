# Data model: Sucre Natural (extiende Imperdibles)

## Enums

```text
SucreNaturalHubId
  playas | cienagas | rios | paisajes | biodiversidad | senderos | experiencias

BiodiversityKind
  FAUNA | FLORA | ECOSYSTEM

BiodiversityGroup  (string libre acotado en Zod, no enum Prisma)
  mamiferos | reptiles-anfibios | aves | flora | bosques | …
```

Paletas (solo código, no BD):

| Hub            | Acento     | Token sugerido      |
|----------------|------------|---------------------|
| playas         | turquesa   | `--sn-accent: 174 62% 35%` (cercano a primary actual) |
| cienagas       | verde      | 142 40% 32%         |
| rios           | tierra     | 25 35% 38%          |
| paisajes       | verde      | 130 35% 30%         |
| biodiversidad  | ámbar      | 32 80% 42%          |
| senderos       | violeta    | 270 35% 38%         |
| experiencias   | naranja    | 18 80% 45%          |

Papel: `--sn-paper` crema (~40 33% 94%), tinta `--sn-ink` oscura para contraste.

## SucreNaturalHub

Fila por hub; `id` = slug del catálogo cerrado.

| Field         | Type           | Notes                                      |
|---------------|----------------|--------------------------------------------|
| id            | String PK      | uno de los 7 slugs                         |
| title         | String         | “Playas de Sucre”                          |
| tagline       | String?        | lema                                       |
| introMarkdown | Text?          | párrafo de portada del hub (opcional)      |
| coverImageUrl | String?        | `/uploads/gallery/images/...`              |
| sortOrder     | Int            | denormalizado; el código también ordena    |
| updatedAt     | DateTime       |                                            |

Seed upserta las 7. Delete admin **prohibido**.

## ImperdibleDestination (campos nuevos / cambios)

Campos actuales se conservan. Cambios:

| Field           | Change                                      |
|-----------------|---------------------------------------------|
| cardImageUrl    | pasa a `String?`                            |
| mapLat, mapLng  | pasan a `Decimal?`                          |
| bodyMarkdown    | se conserva como respaldo                   |

Nuevos:

| Field                  | Type        | Notes |
|------------------------|-------------|-------|
| municipality           | String?     | libre; no enum de 5 municipios |
| region                 | String?     | p.ej. Golfo de Morrosquillo |
| locationLabel          | String?     | línea de pin de la lámina |
| ecosystems             | String?     | texto corto “Playa · mar · manglar” |
| approach               | String?     | enfoque 30 s |
| specialWhy             | Text?       | “qué lo hace especial” |
| howToArrive            | Text?       | |
| climate                | String?     | |
| recommendedTime        | String?     | |
| audience               | String?     | “para quién” |
| mapNote                | String?     | etiqueta ilustrada / listo mapa prompt 11 |
| liveActivities         | Json?       | `{ title: string, iconKey?: string }[]` |
| responsibleTips        | Json?       | `string[]` |
| biodiversityChipLabels | Json?       | `string[]` chips no catalogados |
| showOnHome             | Boolean     | default `false`; destinos preexistentes migran a `true` |
| seedManaged            | Boolean     | default `false`; seed pone `true` |

Relaciones: hubs N, gallery items N, biodiversity N, experiences N, sources N.

Índices: `@@index([published, showOnHome, sortOrder])`, `@@index([published, municipality])`.

### Resolución de vista

`hasStructuredFicha(row)` → layout ficha si `hubs.length > 0 || specialWhy || municipality`.

Home: `published && showOnHome`, `take` 20, luego GRID_THREE recorta a 3.

Tope admin de 20: cuenta `published && showOnHome`, no todos los published.

## ImperdibleDestinationHub

M-N destino ↔ hub.

| Field         | Type    |
|---------------|---------|
| destinationId | FK      |
| hubId         | FK hub  |
| @@id          | ambos   |

Un destino en varios hubs (Sanguaré, cavernas).

## ImperdibleGalleryItem

| Field         | Type    | Notes |
|---------------|---------|-------|
| id            | cuid    | |
| destinationId | FK      | cascade |
| publicUrl     | String  | galería válida |
| sortOrder     | Int     | |
| alt           | String? | accesibilidad |

## BiodiversityEntry

| Field          | Type              | Notes |
|----------------|-------------------|-------|
| id             | cuid              | |
| slug           | unique            | `/sucre-natural/especies/[slug]` |
| kind           | BiodiversityKind  | |
| groupKey       | String            | agrupación del hub |
| commonName     | String            | |
| scientificName | String?           | solo si está en la lámina |
| summary        | Text              | por qué importa / hábitat |
| whereFound     | Text?             | |
| imageUrl       | String?           | |
| published      | Boolean           | |
| sortOrder      | Int               | |
| seedManaged    | Boolean           | |

M-N `BiodiversityOnDestination`.

## NatureExperience

| Field            | Type     | Notes |
|------------------|----------|-------|
| id               | cuid     | |
| slug             | unique   | `/sucre-natural/experiencias/[slug]` |
| title            | String   | |
| tagline          | String?  | |
| whereText        | Text?    | zonas aunque no haya destinos FK |
| whatYouDo        | Json?    | `string[]` |
| specialWhy       | Text?    | |
| recommendations  | Json?    | `string[]` |
| imageUrl         | String?  | |
| published        | Boolean  | |
| sortOrder        | Int      | |
| seedManaged      | Boolean  | |

M-N `ExperienceOnDestination`.

## ContentSource

| Field       | Type    | Notes |
|-------------|---------|-------|
| id          | cuid    | |
| slug        | unique  | `carsucre`, `colombia-travel`, … |
| name        | String  | |
| url         | String? | |
| note        | String? | |

M-N `DestinationSource` (y opcional `BiodiversitySource` si hace falta citar Humboldt en especies; v1 basta destinos + página de referencias en la portada).

## Validación

- Slug destino/especie/experiencia: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, max 160.
- Mínimos destino publicado con ficha: title, slug, ≥1 hub **o** municipality. Clima/audiencia opcionales.
- Medios: prefijo `/uploads/gallery/images/` y sin `..`.
- Coords: si una está presente, las dos; rango lat −90..90, lng −180..180, zoom 1–21.
- `liveActivities` max 12 ítems, título max 80.
- `iconKey` ∈ catálogo cerrado Lucide (whitelist en Zod).
- Hub id ∈ los 7 slugs.
- No borrar `SucreNaturalHub`.
- No borrar `GalleryAsset` si la URL está en card, gallery items, hub cover, especie o experiencia.

## Estados

```text
Destino / especie / experiencia:
  borrador (published=false) → público (published=true)
  público + showOnHome (solo destino) → aparece en home Imperdibles
```

Borrado de destino: cascade gallery items y joins; especies/experiencias quedan, sin enlace.

## Listo para features posteriores

| Feature     | Campos a reutilizar                                      |
|-------------|----------------------------------------------------------|
| Mapa 11     | slug, title, mapLat, mapLng, mapZoom, mapNote, municipality, published, hubs |
| RAG 14      | slug, title, specialWhy, ecosystems, municipality, region, summary de especies, fuentes, published |
| Qué hacer 3 | NatureExperience puede enlazarse después; no mezclar ahora |

## Inventario seed (slugs)

Ver [transcripciones.md](../../docs/fichas_destinos/transcripciones.md). Destinos: 24 fichas (Mojana unificada). No seed de `archipielago-de-san-bernardo`.

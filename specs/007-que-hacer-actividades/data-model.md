# Data model: Qué hacer en Sucre

Catálogo **aparte** de Sucre Natural. No se añaden campos de ficha de naturaleza aquí; solo relaciones hacia `ImperdibleDestination`.

## Constantes (código, no BD)

```text
QUE_HACER_HOME_CAROUSEL_AFTER = 5   # carrusel de tarjetas si published.length > 5
QUE_HACER_MAX_PHOTOS = 12
QUE_HACER_AUTOPLAY_MS = 5000
SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/   # mismo que destinos, máx. 160
```

Catálogo de pictogramas (`src/lib/que-hacer-icons.ts`): claves estables. Mínimo las del mock:

| iconKey           | Lucide            | Uso seed      |
|-------------------|-------------------|---------------|
| waves             | Waves             | Playas        |
| palette           | Palette           | Cultura       |
| utensils-crossed  | UtensilsCrossed   | Gastronomía   |
| tree-pine         | TreePine          | Naturaleza    |
| heart             | Heart             | Experiencias  |
| compass           | Compass           | reserva       |

Ampliar el mapa con ~15–25 iconos turísticos extra (binoculars, droplets, footprints, leaf, mountain, music, camera, sun, sailboat, map-pin, landmark, …). El admin **solo** lista esas claves.

## QueHacerCategory

| Field       | Type        | Notes                                      |
|-------------|-------------|--------------------------------------------|
| id          | String PK   | cuid                                       |
| slug        | String UQ   | URL-safe; seed: `playas`, `cultura`, …     |
| name        | String      | «Playas»                                   |
| description | String?     | breve, opcional                            |
| sortOrder   | Int         | orden en admin                             |
| seedManaged | Boolean     | default false; seed pone true al crear     |
| createdAt   | DateTime    |                                            |
| updatedAt   | DateTime    |                                            |

Relaciones: N actividades, N destinos. Delete: cascade en joins; **no** borra actividades ni destinos.

Índice: `@@index([sortOrder])`.

## QueHacerActivity

| Field       | Type        | Notes                                      |
|-------------|-------------|--------------------------------------------|
| id          | String PK   | cuid                                       |
| slug        | String UQ   | `/que-hacer/[slug]`                        |
| title       | String      | máx. 120                                   |
| description | Text        | máx. 1000; en home se muestra completo     |
| iconKey     | String      | debe existir en el catálogo al guardar     |
| published   | Boolean     | default false                              |
| sortOrder   | Int         | orden en home                              |
| seedManaged | Boolean     | igual que destinos 006                     |
| createdAt   | DateTime    |                                            |
| updatedAt   | DateTime    |                                            |

Relaciones: N categorías, N destinos, N fotos.

Índice: `@@index([published, sortOrder])`.

### Publicación

`published === true` exige ≥1 foto con `publicUrl` válida (prefijo `/uploads/gallery/images/`, sin `..`) **y** archivo presente en disco en el momento de publicar. Lectura pública filtra huérfanos; si tras filtrar no queda foto, la actividad **no** entra en home ni en la ficha (tratar como no visible; admin ve aviso).

## QueHacerActivityPhoto

| Field      | Type      | Notes                                      |
|------------|-----------|--------------------------------------------|
| id         | String PK | cuid                                       |
| activityId | FK        | cascade al borrar actividad                |
| publicUrl  | String    | galería válida                             |
| sortOrder  | Int       | carrusel de ficha                          |
| alt        | String?   | accesibilidad; fallback = título actividad |
| isCover    | Boolean   | default false                              |

A lo sumo una `isCover` por actividad (al guardar: si varias, gana la de menor `sortOrder` marcada; si ninguna, cover = menor `sortOrder`).

Índice: `@@index([activityId, sortOrder])`.

## Joins

### QueHacerActivityOnCategory

| Field      | Type |
|------------|------|
| activityId | FK   |
| categoryId | FK   |
| @@id       | ambos |

`onDelete: Cascade` ambos lados.

### QueHacerDestinationOnCategory

| Field         | Type |
|---------------|------|
| destinationId | FK `ImperdibleDestination` cascade |
| categoryId    | FK cascade |
| @@id          | ambos |

Asignar categoría **no** cambia `published` / `showOnHome` del destino.

### QueHacerActivityOnDestination

| Field         | Type |
|---------------|------|
| activityId    | FK cascade |
| destinationId | FK cascade |
| sortOrder     | Int, orden en la ficha de actividad |
| @@id          | ambos |

Público: solo destinos `published`. Inverso: en ficha de destino, solo actividades `published` con ≥1 foto viva.

## Extensión de ImperdibleDestination

Sin columnas nuevas. Relaciones inversas:

- `queHacerCategories QueHacerDestinationOnCategory[]`
- `queHacerActivities QueHacerActivityOnDestination[]`

El diálogo admin de destinos envía `queHacerCategoryIds: string[]`.

## Resolución pura (tests unitarios)

- `resolveQueHacerIcon(iconKey)` → icono + label, o reserva `compass`.
- `shouldUseHomeCardCarousel(count)` → `count > QUE_HACER_HOME_CAROUSEL_AFTER`.
- `pickCoverPhoto(photos)` → cover o primera por `sortOrder`.
- `filterLivePhotos(photos, existingUrls)` → omite huérfanos.
- `isActivityPubliclyVisible(activity, livePhotos)` → published && livePhotos.length ≥ 1.

## Seed (contenido inicial)

Cinco categorías + cinco actividades (mismo slug/título que el mock):

| slug          | name / title  | iconKey          | description (mock)                                      |
|---------------|---------------|------------------|---------------------------------------------------------|
| playas        | Playas        | waves            | Tolú, Coveñas, San Bernardo, Rincón del Mar             |
| cultura       | Cultura       | palette          | Artesanías Zenú, museos, arquitectura colonial          |
| gastronomia   | Gastronomía   | utensils-crossed | Arroz de coco, mote de queso, fritos costeños           |
| naturaleza    | Naturaleza    | tree-pine        | Manglares, ciénagas, reservas ecológicas                |
| experiencias  | Experiencias  | heart            | Corralejas, música de gaitas, vida local                |

Cada actividad: `published=true`, `sortOrder` 1–5, una foto (asset copiado), categoría homónima. `destinationIds` vacíos.

Política de recarga: reutilizar `decideSeedMerge` / `mergeJoinIds`. Edición humana → `seedManaged=false`; re-seed no pisa contenido.

## Validación (Zod, español)

- Título 1–120; descripción 1–1000; slug `SLUG_REGEX`.
- `iconKey` ∈ catálogo.
- `photoUrls` 1–12 al publicar; 0 permitido si `published=false`.
- `categoryIds` / `destinationIds`: ids existentes; destinos inexistentes → error.
- Categoría: name 1–120; slug único.

## Estados

```text
borrador (published=false) → publicada (published=true, ≥1 foto viva)
publicada → despublicada
cualquier estado → eliminada (cascade fotos y joins)
```

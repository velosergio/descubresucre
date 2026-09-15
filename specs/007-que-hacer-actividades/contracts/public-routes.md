# Contracts: rutas públicas Qué hacer

Lectura anónima. Solo actividades visibles (`published` y ≥1 foto viva). HTML (RSC), no JSON API en v1.

## `GET /`

La portada obtiene actividades con `getQueHacerForHome()` en paralelo a hero e Imperdibles.

`ActivitiesSection` recibe el payload. Copy fijo: título «Qué hacer en Sucre», subtítulo actual.

| Condición                         | UI                                              |
|-----------------------------------|-------------------------------------------------|
| 0 visibles                        | no montar la sección                            |
| 1–5                               | grilla; pictograma + título + descripción + foto de portada; cada tarjeta → `/que-hacer/{slug}` |
| >5                                | mismo contenido en carrusel Embla (flechas + autoplay 5 s, pausable) |
| siempre si hay ≥1                 | fondo de sección recorre fotos de portada (5 s, pausable, `prefers-reduced-motion` lo detiene) |

No hay fallback al array hardcodeado de `src/assets`.

## `GET /que-hacer/{slug}`

Ficha de actividad. 404 si slug desconocido, despublicada o sin fotos vivas.

Contenido:

- Título, pictograma (reserva si clave inválida), descripción
- Carrusel de fotos vivas (orden `sortOrder`; alt o título)
- Etiquetas de categorías (nombre; no son filtros)
- Destinos publicados enlazados → `/imperdibles/{slug}` (omitir bloque si vacío)
- Control anterior/siguiente del carrusel operable por teclado

## `GET /imperdibles/{slug}` (extensión)

Si el destino publicado tiene actividades visibles vinculadas, bloque «Qué hacer» con enlaces a `/que-hacer/{slug}`. Independiente de `liveActivities` (vive el destino).

## Caché

Tras mutación: `revalidatePath("/")`, `/que-hacer/{slug}`, `/imperdibles/{slug}` afectados, `/admin/personalizar/que-hacer`, y destinos-imperdibles si cambiaron categorías.

## Fuera de contrato

- No `GET /api/que-hacer`.
- No listado `/que-hacer` (solo fichas + sección home).
- No filtro público por categoría.
- MapSection, RAG, favoritos, itinerarios: sin cambios.

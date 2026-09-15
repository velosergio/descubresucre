# Contracts: rutas públicas Sucre Natural

Lectura anónima. Solo registros `published`. 404 si slug/hub desconocido o despublicado. HTML (RSC), no JSON API en v1.

## `GET /sucre-natural`

Portada del programa. Lista los 7 hubs (título, tagline, paleta, cover si hay). Crédito: Juana Valentina Patiño Moncada / Sucre Natural. Enlace a fuentes institucionales.

## `GET /sucre-natural/{hub}`

`hub` ∈ `playas|cienagas|rios|paisajes|biodiversidad|senderos|experiencias`. Otro valor → 404.

| Hub            | Lista principal                         | Lista secundaria        |
|----------------|-----------------------------------------|-------------------------|
| playas, cienagas, rios, paisajes, senderos | destinos publicados del hub | — |
| biodiversidad  | especies/ecosistemas publicados agrupados | destinos del hub si hay |
| experiencias   | experiencias publicadas                 | — |

Tarjeta destino: imagen o marcador, título, tagline/subtitle, municipality. Enlace a `/imperdibles/{slug}`.

Tarjeta especie → `/sucre-natural/especies/{slug}`.  
Tarjeta experiencia → `/sucre-natural/experiencias/{slug}`.

## `GET /imperdibles/{slug}`

Ya existe. Si `hasStructuredFicha`: layout ficha (secciones omitidas si vacías), galería, mapa Embed si hay coords + `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, si no “cómo llegar” / enlace Maps omitido. Breadcrumb a hub(s). Chips de biodiversidad: labels + especies relacionadas. Fuentes al pie.

Si no hay ficha estructurada: comportamiento actual (Markdown + mapa; mapa solo si hay coords).

Destino no publicado o inexistente → 404.

## `GET /sucre-natural/especies/{slug}`

Ficha de especie/ecosistema. Destinos publicados relacionados (omitir sección si vacío).

## `GET /sucre-natural/experiencias/{slug}`

Ficha de experiencia. Destinos publicados relacionados; `whereText` siempre visible si existe.

## Caché

Tras mutación admin: `revalidatePath` de `/`, `/sucre-natural`, `/sucre-natural/{hub}`, detalle afectado, `/admin/personalizar/...`. Preferible `revalidatePath("/sucre-natural", "layout")` además de paths concretos.

## Fuera de contrato

No hay `GET /api/sucre-natural`. El chatbot no consume estas rutas en esta feature. MapSection de la home no cambia.

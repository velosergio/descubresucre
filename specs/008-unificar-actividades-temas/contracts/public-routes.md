# Contracts: rutas públicas (unificación temas)

Lectura anónima. Solo `published` (+ fotos vivas). HTML RSC; no API JSON nueva en v1.

## `GET /` (sección Qué hacer)

Payload de actividades publicadas ordenadas. Tarjeta → `/que-hacer/{slug}`.  
0 publicadas → sección omitida.  
>5 → carrusel (contrato 007).  
Sin copy «micrositio».

## `GET /que-hacer/{slug}` (canónica)

| listingMode    | Lista principal                                      | Enlaces ítem                          |
|----------------|------------------------------------------------------|---------------------------------------|
| DESTINATIONS   | Destinos publicados del join                         | `/imperdibles/{slug}`                 |
| BIODIVERSITY   | Todas las especies/ecosistemas publicados (agrupados)| `/sucre-natural/especies/{slug}`      |
| EXPERIENCES    | Todas las experiencias publicadas                    | `/sucre-natural/experiencias/{slug}`  |

Plantilla temática: accent de la actividad, tagline/intro si existen, fotos/carrusel según 007.  
Slug inexistente o no publicado → 404.  
Sin bloque vacío engañoso si DESTINATIONS sin destinos (mensaje neutro o sección omitida).

## `GET /sucre-natural/{hub}` (legado)

`hub` ∈ 7 ids. Respuesta: **redirect permanente** a `/que-hacer/{hub}` (mismo string).  
Hub inválido → 404.  
Si la actividad destino no está publicada → 404 (no redirect a página vacía).

## `GET /sucre-natural`

Portada programa: enlaces a `/que-hacer/{slug}` de actividades publicadas canónicas (o todas publicadas con estética temática). Sin etiqueta micrositio. Créditos SN pueden permanecer.

## Sin cambio de path en v1

- `GET /sucre-natural/especies/{slug}`
- `GET /sucre-natural/experiencias/{slug}`
- `GET /imperdibles/{slug}` — bloque «Qué hacer» lista actividades publicadas del join (como 007).

## Caché / revalidate

Tras mutación actividad o asociación destino: `/`, `/que-hacer/{slug}`, `/sucre-natural`, `/sucre-natural/{hub}` si aplica, `/imperdibles/{slug}` afectados, rutas admin.

## Fuera de contrato

MapSection, RAG, API chatbot, mover especies/experiencias bajo `/que-hacer/...`.

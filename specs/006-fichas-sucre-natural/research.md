# Research: Fichas Sucre Natural

## 1. Extender Imperdibles vs catálogo paralelo

**Decision**: Ampliar `ImperdibleDestination`. Un destino = una ficha canónica. URL pública de detalle: `/imperdibles/[slug]`. Micrositio: `/sucre-natural` y `/sucre-natural/[hub]`.

**Rationale**: FR-004 exige extensión, no un segundo inventario. El detalle y la home ya existen; duplicar slugs rompería Imperdibles y el prompt 11.

**Alternatives considered**: Tabla `Destination` nueva con FK opcional a Imperdible (más limpio a largo plazo, peor migración y doble CRUD). Rechazado para v1.

## 2. Home Imperdibles vs 24 fichas publicadas

**Decision**: Separar `published` (visible en Sucre Natural y detalle) de `showOnHome` (sección Imperdibles de la home). El tope de 20 aplica solo a `showOnHome`. Migración: destinos actuales `showOnHome = true`. Seed de fichas: `published = true`, `showOnHome = false` salvo que el staff los destaque.

**Rationale**: Hoy `assertPublishedLimit` bloquea más de 20 publicados (`IMPERDIBLES_HOME_MAX_ITEMS`). El seed de 24 fichas fallaría. El spec no exige que todas las fichas salgan en la home.

**Alternatives considered**: Subir el tope a 100 (la home se vuelve interminable). Dos modelos (Imperdible vs Ficha) — viola FR-004.

## 3. Hubs: código cerrado + fila editable

**Decision**: Enum/catálogo en `src/lib/sucre-natural-hubs.ts` (7 slugs fijos, paleta, orden, icono). Tabla `SucreNaturalHub` con `id = slug` para lema, intro, imagen de portada. Admin no crea ni borra hubs. Seed hace upsert de las 7 filas.

**Rationale**: FR-002: conjunto cerrado; staff MAY editar copy/imagen.

**Alternatives considered**: Solo constantes (no se edita copy sin deploy). CRUD libre de hubs (rompe paletas y rutas).

## 4. Ficha estructurada: columnas + JSON de listas

**Decision**: Columnas escalares consultables (`municipality`, `region`, `locationLabel`, `ecosystems`, `approach`, `specialWhy`, `howToArrive`, `climate`, `recommendedTime`, `audience`, `mapNote`). JSON para listas cortas: `liveActivities` (`{ title, iconKey? }[]`), `responsibleTips` (`string[]`), `biodiversityChipLabels` (`string[]` para chips genéricos tipo «Peces»). Relaciones M-N para hubs, especies, experiencias, fuentes. Galería: `String[]` JSON de URLs `/uploads/gallery/images/...` **o** tabla `ImperdibleGalleryItem` si el chequeo de borrado en galería se complica; preferir tabla `ImperdibleGalleryItem` (url + sortOrder) para poder bloquear delete como `cardImageUrl`.

**Rationale**: El “30 segundos” de las láminas **es** ubicación/región/ecosistemas/experiencias/enfoque: no duplicar en otro JSON. Chips genéricos no son especies del catálogo.

**Alternatives considered**: Un JSON `ficha` gigante (difícil de validar y de indexar para RAG futuro). Markdown + frontmatter (el spec prohíbe Markdown como fuente de verdad).

## 5. ¿Cuándo usar layout ficha vs Markdown?

**Decision**: Función pura `hasStructuredFicha(row)`: verdadero si hay al menos un hub asignado **o** `specialWhy` no vacío **o** `municipality` no vacío. Si verdadero, `/imperdibles/[slug]` renderiza layout Sucre Natural (bloques vacíos omitidos). Si falso, layout actual (Markdown + mapa).

**Rationale**: FR-006, escenario P1.4. Destinos viejos no se rompen.

## 6. Coordenadas y foto de tarjeta opcionales

**Decision**: `mapLat`/`mapLng` nullable. Sin coords: no iframe; sí “cómo llegar” y, si hay, `mapNote`. `cardImageUrl` nullable; UI usa marcador CSS polaroid (papel crema) si falta. Seed no inventa lat/lng ni extrae fotos de las PNG.

**Rationale**: Spec: coords ausentes no bloquean; carga inicial prioriza textos. Inventar coordenadas sería contenido falso para el prompt 11.

**Alternatives considered**: Geocodificar municipios al seed (impreciso y fuera de alcance). Recortar PNG de mesas como fotos (derechos/calidad; no es la página interactiva).

## 7. Biodiversidad y experiencias como entidades propias

**Decision**: `BiodiversityEntry` (tipo FAUNA | FLORA | ECOSYSTEM, grupo, nombres, texto, imagen, slug, published) M-N con destinos. `NatureExperience` (slug, título, lema, dónde, qué, por qué, recomendaciones JSON, imagen, published) M-N con destinos. No son destinos salvo que ya exista ficha de lugar (Sanguaré, cavernas).

**Rationale**: FR-011/012. El hub Biodiversidad debe funcionar sin destinos. Experiencias del prompt 2 ≠ CMS “Qué hacer” (prompt 3).

**Alternatives considered**: Meter experiencias como destinos con `kind=EXPERIENCE` (ensucia Imperdibles y el mapa). Dejar el hub naranja vacío hasta el prompt 3 (incumple el material visual).

## 8. Fuentes reutilizables

**Decision**: `ContentSource` (slug, name, url?, note) M-N con destinos (y opcionalmente especies). Seed de las 7 institucionales. Río San Jorge enlaza Corpomojana, Gobernación, MinAmbiente.

**Rationale**: FR-010.

## 9. Política de recarga del seed

**Decision**: Campo `seedManaged Boolean @default(false)`. El seed marca `true` en filas que crea. Si el admin guarda esa fila, `seedManaged` pasa a `false`. Re-seed: **crea** si el slug no existe; **no pisa** campos de contenido si `seedManaged === false`; si `true`, actualiza textos desde `prisma/data/sucre-natural-seed.ts`. Relaciones M-N: añade enlaces faltantes del seed, no quita los que el admin haya añadido.

**Rationale**: FR-013 y escenario 5.2. El Markdown de transcripciones es editorial; el seed machine-readable es TypeScript (no parsear MD en runtime).

**Alternatives considered**: Parsear `transcripciones.md` (frágil). Siempre overwrite (borra trabajo editorial). Nunca update (el seed no corrige typos del dataset).

## 10. Estética sin clonar carteles

**Decision**: Tokens CSS por hub (`data-hub="playas"`): papel crema, acento turquesa/verde/tierra/ámbar/violeta/naranja. Títulos `font-display` (Playfair) sobre manchas tipo pincel en CSS. Polaroids: rotación leve + sombra + marco blanco. Iconos Lucide con `aria-hidden` + texto visible. Mapas ilustrados de las PNG **no** se incrustan; se usa el mapa Embed existente o el bloque “cómo llegar”. Fuente manuscrita (Caveat) solo para sellos cortos (“Naturaleza que se vive”) si el contraste lo permite; si no, Playfair italic.

**Rationale**: FR-001/020 y NFR-005. Servir las PNG violaría SC-007.

**Alternatives considered**: Páginas que muestran el PNG a pantalla completa. Recrear ilustraciones en SVG complejas (fuera de alcance).

## 11. Navegación pública

**Decision**: Enlace “Sucre Natural” en el footer y, en la sección Imperdibles, CTA “Ver fichas de naturaleza” hacia `/sucre-natural`. Las tarjetas de home siguen yendo a `/imperdibles/[slug]`. Breadcrumb en ficha: Sucre Natural → hub → destino cuando hay hub.

**Rationale**: La home no tiene nav global; el footer es el enlace persistente.

## 12. Mapa (prompt 11) y RAG (prompt 14)

**Decision**: Persistir slug, textos estructurados, municipio, región, lat/lng, `published`. No MapSection unificado, no PGVector, no n8n index. Documentar en data-model los campos “listos para”.

**Rationale**: FR-014.

## 13. Límite de publicación Imperdibles

**Decision**: Mover `assertPublishedLimit` a contar `showOnHome && published`, no todos los published. Home query: `where: { published: true, showOnHome: true }`.

**Rationale**: Ver §2.

## 14. Referencias de galería

**Decision**: Extender el bloqueo de borrado para `cardImageUrl`, ítems de galería de ficha, `SucreNaturalHub.coverImageUrl`, `BiodiversityEntry.imageUrl`, `NatureExperience.imageUrl`. Extraer a función pura testeable.

**Rationale**: Spec 005 ya bloqueaba card; las nuevas URLs deben igualarse.

## 15. Archipiélago de San Bernardo

**Decision**: No crear destino sin lámina. La experiencia “Buceo y careteo” guarda el texto de zona; `destinos relacionados` puede quedar vacío. El staff puede crear el destino después.

**Rationale**: Spec: no inventar fichas; experiencia no exige destinos.

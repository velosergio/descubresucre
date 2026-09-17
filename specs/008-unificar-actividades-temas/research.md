# Research: Unificar hubs temáticos en Actividades

## 1. Extender `QueHacerActivity` vs nuevo modelo «Tema»

**Decision**: Extender `QueHacerActivity` con campos de hub (`listingMode`, `tagline`, `introMarkdown`, `accentHsl`) y tratarlo como el contenedor temático. En admin el copy sigue siendo «Actividad».

**Rationale**: Spec opción A + clarificación A (copy admin). Evita un tercer CMS y reutiliza home, fotos, pictogramas y `QueHacerActivityOnDestination`.

**Alternatives considered**: Tabla `Theme` nueva (duplica CRUD/home). Renombrar modelo Prisma a `Theme` (coste alto, copy admin rechazó «Tema»).

## 2. Destinos: una sola M-N (actividad ↔ destino)

**Decision**: `QueHacerActivityOnDestination` es la asociación canónica. Migrar filas de `ImperdibleDestinationHub` → join actividad (slug = hubId). Entrada dual en formularios Actividad y Destino (clarificación C). Deprecar `hubIds` en actions de destinos.

**Rationale**: FR-006/017; elimina taxonomía doble hub + categoría + actividad.

**Alternatives considered**: Mantener `ImperdibleDestinationHub` sincronizado con el join (doble escritura frágil). Solo entrada desde Actividad (rechazado en clarify).

## 3. Modos de listado y catálogos globales

**Decision**: Enum `QueHacerListingMode`: `DESTINATIONS` | `BIODIVERSITY` | `EXPERIENCES`. En página pública: DESTINATIONS → destinos publicados del join; BIODIVERSITY → todas las `BiodiversityEntry` publicadas; EXPERIENCES → todas las `NatureExperience` publicadas. Sin filtro por actividad en v1.

**Rationale**: Clarificación A; paridad con hubs actuales.

**Alternatives considered**: Filtrar especies/experiencias por actividad (alcance extra). Forzar una sola actividad por modo especial (rígido; contradice FR-013/018).

## 4. URLs canónicas y legado

**Decision**: Canónica = `/que-hacer/[slug]` con slugs de los 7: `playas`, `cienagas`, `rios`, `paisajes`, `biodiversidad`, `senderos`, `experiencias`. `GET /sucre-natural/[hub]` → `permanentRedirect` (308/Next `redirect`) a `/que-hacer/{hub}` si hub válido; si la actividad no está publicada → `notFound()` coherente. Portada `/sucre-natural` lista enlaces a `/que-hacer/...` o redirige a `/#que-hacer` (preferir listar enlaces canónicos para no romper bookmarks de la portada SN). Rutas `/sucre-natural/especies/*` y `/experiencias/*` **no** se mueven en v1.

**Rationale**: FR-008; continuidad sin mantener dos renderers de hub.

**Alternatives considered**: Rewrite interno sin cambiar URL (mantiene marca «micrositio» en path). 302 temporal (peor SEO/bookmarks).

## 5. Plantilla visual unificada

**Decision**: Una plantilla pública (`activity-theme-page`) reutiliza componentes Sucre Natural (polaroid, tipografía, CSS vars `--sn-*` / accent por actividad). Toda actividad publicada usa esa plantilla; `accentHsl` editable (default al crear; seed copia acentos de `SUCRE_NATURAL_HUBS`).

**Rationale**: Clarificación B (plantilla para todas).

**Alternatives considered**: Plantilla neutra para temas no naturales (rechazado). Duplicar JSX de hub page sin abstraer (deuda).

## 6. Seed / migración de contenido

**Decision**: Dataset `prisma/data/que-hacer-temas-seed.ts` con los 7 temas (`seedManaged: true`, published, iconos/acentos/taglines de hubs, listingMode correcto). Al seed:

1. Upsert 7 actividades por slug.
2. Copiar asociaciones hub→destino a `QueHacerActivityOnDestination`.
3. Unpublish o delete actividades `seedManaged` con slugs del mock 007 que no sean canónicos (`cultura`, `gastronomia`, `naturaleza`; y reconciliar `playas`/`experiencias` hacia el contenido hub).
4. No tocar actividades `seedManaged === false`.

Migración Prisma: columnas nuevas; script data en migración o en seed idempotente (preferir seed + migrate schema; data backfill en seed/`db:seed` documentado, más un paso one-shot en migrate SQL si hay prod con hubs sin re-seed).

**Rationale**: Clarificación B de migración; FR-007/019.

**Alternatives considered**: Conservar las 5 mock + añadir 7 (home confusa). Wipe total de actividades (pierde extras staff).

## 7. Categorías Qué hacer

**Decision**: Dejar de ser requisito de producto. En v1: **dormir UI** (ocultar CRUD categorías y campos `categoryIds` en formularios). Tablas y joins pueden permanecer en schema para no forzar drop destructivo; no se usan en home ni en ficha temática. Drop schema opcional en follow-up.

**Rationale**: FR-015; reduce riesgo de migración.

**Alternatives considered**: Drop inmediato de tablas (más migraciones y tests rotos). Seguir exigiendo categorías (contradice unificación).

## 8. Admin hubs Sucre Natural

**Decision**: Retirar del sidebar/personalizar el CRUD de hubs (portada/tagline hub). Biodiversidad y experiencias **siguen** en admin hijos. Textos editables de hub pasan al formulario de Actividad (tagline, intro, cover vía fotos, accent).

**Rationale**: FR-002/009; SC-004.

**Alternatives considered**: Mantener admin hubs sincronizado (doble fuente). 

## 9. Autorización, revalidación, observabilidad

**Decision**: Sin cambio de roles (`assertAdminAction`). Revalidate `/`, `/que-hacer/[slug]`, `/sucre-natural` y `/sucre-natural/[hub]` (por si hay cache intermedia), `/imperdibles/[slug]` afectados, admin. Logs seed + errors de actions.

**Rationale**: Constitución III–IV; patrón 006/007.

## 10. Tests

**Decision**: Actualizar suites que asumen hubs como fuente de listado público; añadir casos redirect; seed 7; dual association; modos. E2E crítico: Playas home → ficha → destino; Biodiversidad → especie; URL legacy hub.

**Rationale**: Constitución II; SC-002/003/006.

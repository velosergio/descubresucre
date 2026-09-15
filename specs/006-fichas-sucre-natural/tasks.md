# Tasks: Fichas de destino y micrositios Sucre Natural

**Input**: Design documents from `/specs/006-fichas-sucre-natural/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos. Constitución (persistencia + authz) y plan.md exigen unit + integration + component + e2e. Escribir tests que fallen antes de implementar en cada historia de riesgo.

**Organization**: Por user story (US1–US5) para entregar incrementos independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelo (otro archivo, sin depender de tareas incompletas)
- **[Story]**: US1…US5 según spec.md
- Toda tarea incluye ruta de archivo

## Path Conventions

Next.js App Router en la raíz del repo: `src/`, `prisma/`, `e2e/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Carpetas y tokens visuales compartidos. El proyecto Next/Prisma ya existe.

- [X] T001 Crear directorios `src/components/sucre-natural/`, `src/app/sucre-natural/`, `prisma/data/` y `src/app/admin/personalizar/sucre-natural/` (más `biodiversidad/` y `experiencias-naturaleza/` vacíos con `.gitkeep` si hace falta)
- [X] T002 [P] Añadir tokens CSS `--sn-paper` (crema ~40 33% 94%), `--sn-ink` (tinta oscura, contraste de lectura) y `--sn-accent` por hub en `src/app/globals.css` (o `src/app/sucre-natural/sucre-natural.css` importado desde el layout público)
- [X] T003 [P] Documentar en `CLAUDE.md` (sección Base de datos) que `npm run db:seed` pasará a incluir Sucre Natural además de roles — nota breve, sin implementar el seed aún

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema, catálogo de hubs, resolución ficha vs Markdown, home `showOnHome`, coords/imagen opcionales. **Ninguna user story empieza antes.**

**⚠️ CRITICAL**: Completar esta fase antes de US1–US5

- [X] T004 Ampliar `prisma/schema.prisma`: enum `BiodiversityKind` (`FAUNA` | `FLORA` | `ECOSYSTEM`); modelo `SucreNaturalHub` con `id` = uno de `playas|cienagas|rios|paisajes|biodiversidad|senderos|experiencias`, `title String`, `tagline String?`, `introMarkdown String? @db.Text`, `coverImageUrl String? @db.VarChar(2048)`, `sortOrder Int`, `updatedAt`; cambios en `ImperdibleDestination`: `cardImageUrl` nullable, `mapLat`/`mapLng` `Decimal?`, campos `municipality String?`, `region String?`, `locationLabel String?`, `ecosystems String?`, `approach String?`, `specialWhy String? @db.Text`, `howToArrive String? @db.Text`, `climate String?`, `recommendedTime String?`, `audience String?`, `mapNote String?`, `liveActivities Json?`, `responsibleTips Json?`, `biodiversityChipLabels Json?`, `showOnHome Boolean @default(false)`, `seedManaged Boolean @default(false)`; índices `@@index([published, showOnHome, sortOrder])` y `@@index([published, municipality])`; modelos `ImperdibleDestinationHub` (`destinationId`+`hubId` @@id), `ImperdibleGalleryItem` (`publicUrl`, `sortOrder`, `alt String?`), `BiodiversityEntry` (`slug` unique max 160, `kind`, `groupKey`, `commonName`, `scientificName String?`, `summary @db.Text`, `whereFound String? @db.Text`, `imageUrl String?`, `published`, `sortOrder`, `seedManaged`), `BiodiversityOnDestination`, `NatureExperience` (`slug` unique, `title`, `tagline String?`, `whereText String? @db.Text`, `whatYouDo Json?`, `specialWhy String? @db.Text`, `recommendations Json?`, `imageUrl String?`, `published`, `sortOrder`, `seedManaged`), `ExperienceOnDestination`, `ContentSource` (`slug` unique, `name`, `url String?`, `note String?`), `DestinationSource`
- [X] T005 Crear migración Prisma y ejecutar `npm run db:generate`; SQL de datos: `UPDATE ImperdibleDestination SET showOnHome = 1` para filas preexistentes (preservar home actual) en `prisma/migrations/*/migration.sql`
- [X] T006 [P] Catálogo cerrado de 7 hubs (slug, título, paleta HSL, orden, icono Lucide) en `src/lib/sucre-natural-hubs.ts`; `isSucreNaturalHubId()` rechaza cualquier id fuera de esos 7
- [X] T007 [P] Tests unitarios del catálogo y paletas en `src/lib/sucre-natural-hubs.test.ts`
- [X] T008 Función pura `hasStructuredFicha(row)` en `src/lib/sucre-natural-resolve.ts`: verdadero si `hubs.length > 0` **o** `specialWhy` no vacío **o** `municipality` no vacío; helper para omitir bloques vacíos
- [X] T009 [P] Tests de `hasStructuredFicha` y omisión de bloques en `src/lib/sucre-natural-resolve.test.ts` (deben fallar hasta T008)
- [X] T010 Cambiar `getImperdiblesForHome` en `src/lib/get-imperdibles-home.ts` a `where: { published: true, showOnHome: true }` (sigue `take` 20 y recorte GRID_THREE a 3)
- [X] T011 Mover `assertPublishedLimit` en `src/lib/actions/imperdibles.ts` a contar `published && showOnHome` (mensaje: «Solo puedes destacar hasta 20 destinos en la home.»); `published` ya no tiene tope de 20
- [X] T012 Hacer el detalle actual tolerante a coords nulas en `src/app/imperdibles/[slug]/page.tsx` (sin iframe ni query Maps si falta lat/lng; `cardImageUrl` nulo → no `<Image>` rota)
- [X] T013 Helper `revalidateSucreNaturalPaths(opts)` en `src/lib/sucre-natural-revalidate.ts` que llame `revalidatePath` de `/`, `/sucre-natural`, `layout` de `/sucre-natural`, `/imperdibles/{slug}` y admin afectados
- [X] T014 [P] Recolector puro de URLs de medios Sucre Natural en `src/lib/gallery-sucre-natural-references.ts` + test `src/lib/gallery-sucre-natural-references.test.ts` (card, gallery items, hub cover, especie, experiencia)

**Checkpoint**: Schema y home destacados listos; detalle Markdown no rompe con destinos sin mapa

---

## Phase 3: User Story 1 - Recorrer Sucre Natural por temas (Priority: P1) 🎯 MVP

**Goal**: Portada, 7 hubs y ficha estructurada pública (estética papel crema / polaroid). Destinos sin ficha siguen en Markdown.

**Independent Test**: Con un hub y un destino publicado asignado (fixture de test o fila manual), ir portada → hub → `/imperdibles/{slug}` y ver bloques reales; secciones vacías no se renderizan.

### Tests for User Story 1

- [X] T015 [P] [US1] Tests unitarios de DTO público / tarjetas de hub en `src/lib/sucre-natural-public.test.ts` (listar solo `published`; 404 conceptual si hub id inválido)
- [X] T016 [P] [US1] Test de componente: ficha oculta clima/audiencia vacíos y muestra “cómo llegar” en `src/test/components/sucre-natural-ficha.component.test.tsx`
- [X] T017 [US1] Test de integración de lecturas públicas (hub válido, hub 404, destino unpublished 404) en `src/test/integration/sucre-natural-public.integration.test.ts`

### Implementation for User Story 1

- [X] T018 [US1] Queries RSC `getSucreNaturalLanding`, `getHubPage(hubId)`, `getImperdibleBySlug` extendido (relaciones hubs, gallery, sources, biodiversity) en `src/lib/get-sucre-natural-public.ts` y `src/lib/get-imperdible-detail.ts`; filtrar `published`; hub id validado con `isSucreNaturalHubId`
- [X] T019 [P] [US1] Portada `GET /sucre-natural` en `src/app/sucre-natural/page.tsx` (7 hubs, crédito Juana Valentina Patiño Moncada / Sucre Natural, no incrustar PNG de mesas)
- [X] T020 [P] [US1] Layout público `src/app/sucre-natural/layout.tsx` con `data-hub` opcional y enlace teclado-visible de vuelta
- [X] T021 [US1] Hub `GET /sucre-natural/[hub]/page.tsx`: 404 si id ∉ 7 slugs; listar destinos publicados del hub (tarjeta: imagen o marcador, título, tagline/subtitle, municipality) enlazando `/imperdibles/{slug}`; paleta del hub vía `data-hub`
- [X] T022 [US1] Componentes `src/components/sucre-natural/ficha-destino.tsx`, `polaroid-image.tsx`, `hub-card.tsx`: títulos `font-display`, polaroid (marco + sombra), iconos Lucide con texto visible, `toServedMediaUrl`, `alt` obligatorio en fotos
- [X] T023 [US1] En `src/app/imperdibles/[slug]/page.tsx`, si `hasStructuredFicha`: renderizar ficha (ubicación, 30 segundos, qué lo hace especial, chips, vive el destino, turismo responsable, cómo llegar / clima / tiempo / para quién, galería, mapa Embed solo con coords + `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, fuentes); si no, Markdown actual; 404 si unpublished
- [X] T024 [US1] Breadcrumb Sucre Natural → hub → destino en la ficha estructurada (`src/components/sucre-natural/ficha-breadcrumb.tsx`)
- [X] T025 [US1] Enlace “Sucre Natural” en `src/components/Footer.tsx` y CTA desde `src/components/ImperdiblesSection.tsx` hacia `/sucre-natural`
- [X] T026 [US1] Hubs Biodiversidad/Experiencias: en US1 mostrar destinos del hub si hay y un vacío honesto (“catálogo en construcción”) — no 500; listados de especies/experiencias llegan en US3/US4
- [X] T027 [US1] Confirmar contrastes de texto sobre `--sn-paper` y que el color de acento no sea el único distintivo de sección en `src/components/sucre-natural/` (etiqueta textual por bloque)

**Checkpoint**: Micrositio navegable; MVP público sin admin ni seed

---

## Phase 4: User Story 2 - Administrar fichas, hubs y publicación (Priority: P1)

**Goal**: Admin extiende destinos Imperdibles (ficha + hubs + galería + `showOnHome`) y edita copy de los 7 hubs. Publicar revalida home, Imperdibles y Sucre Natural.

**Independent Test**: Crear destino mínimo (title, slug `^[a-z0-9]+(?:-[a-z0-9]+)*$` max 160, municipality o ≥1 hub, published), verlo en hub y detalle; despublicar → 404 público; `showOnHome` controla la home.

### Tests for User Story 2

- [X] T028 [P] [US2] Tests Zod/payload (slug inválido, coords solo una, URL de medio sin prefijo `/uploads/gallery/images/` o con `..`, `liveActivities` > 12 o título > 80, `iconKey` fuera de whitelist, `hubIds` con id desconocido) en `src/lib/sucre-natural-destination-schema.test.ts`
- [X] T029 [US2] Integration: create/update/unpublish, tope 20 `showOnHome`, `seedManaged` pasa a `false` al editar, `revalidatePath` incluye `/sucre-natural` en `src/test/integration/sucre-natural-admin.integration.test.ts`

### Implementation for User Story 2

- [X] T030 [US2] Schema Zod compartido en `src/lib/sucre-natural-destination-schema.ts`: slug regex y max 160; medios prefijo `/uploads/gallery/images/` y rechazo `..`; lat/lng ambas o ninguna (lat −90..90, lng −180..180, zoom 1–21); `liveActivities` max 12 ítems título max 80; `iconKey` ∈ whitelist Lucide; `hubIds` ⊆ 7 slugs; `showOnHome` boolean
- [X] T031 [US2] Extender `createImperdibleDestinationAction` / `updateImperdibleDestinationAction` / `deleteImperdibleDestinationAction` en `src/lib/actions/imperdibles.ts`: campos de ficha, `hubIds`, `galleryUrls`→`ImperdibleGalleryItem` ordenado, `sourceIds`, `showOnHome`; create/update manual `seedManaged = false`; `assertAdminAction`; errores español; `console.error` con nombre de acción; usar `revalidateSucreNaturalPaths`
- [X] T032 [US2] Extender diálogo `src/components/admin/imperdibles-destination-dialog.tsx` y cliente `src/components/admin/imperdibles-admin-client.tsx`: secciones ficha, multi-select hubs, galería (GalleryPicker), `showOnHome`, coords opcionales, imagen de tarjeta opcional
- [X] T033 [P] [US2] `saveSucreNaturalHubAction` en `src/lib/actions/sucre-natural.ts` (solo update de `title`/`tagline`/`introMarkdown`/`coverImageUrl` para id existente; sin create/delete de hubs; `assertAdminAction`; cover con misma regla de medios)
- [X] T034 [P] [US2] Página `/admin/personalizar/sucre-natural` en `src/app/admin/personalizar/sucre-natural/page.tsx` + UI `src/components/admin/sucre-natural-hubs-admin.tsx`
- [X] T035 [US2] Añadir ítem de nav “Sucre Natural” en `src/components/admin/admin-shell.tsx` bajo Personalizar
- [X] T036 [US2] Extender `deleteGalleryAssetAction` en `src/lib/actions/gallery.ts` con `gallery-sucre-natural-references` (bloquear si URL en card, gallery items, hub cover, especie o experiencia)
- [X] T037 [US2] Observabilidad: `console.error` con nombre de acción y mensajes de validación en español (sin stack) en `src/lib/actions/imperdibles.ts` y `src/lib/actions/sucre-natural.ts`

**Checkpoint**: Staff publica fichas; visitante US1 las ve; home solo destacados

---

## Phase 5: User Story 5 - Carga inicial desde transcripciones (Priority: P1)

**Goal**: `npm run db:seed` vuelca hubs, destinos, especies, experiencias y 7 fuentes desde datos tipados (no parsear el .md). Idempotente por slug. No pisa `seedManaged === false`.

**Independent Test**: Seed en BD limpia crea ≥20 destinos y 7 hubs; reejecutar no duplica `paisaje-de-la-mojana`; fila editada a mano no se sobreescribe.

### Tests for User Story 5

- [X] T038 [P] [US5] Tests de merge (`create` si falta slug; skip contenido si `seedManaged === false`; update si `true`; añade joins faltantes, no borra joins extra) en `src/lib/sucre-natural-seed-merge.test.ts`
- [X] T039 [US5] Integration del seed (o función `seedSucreNatural`) en `src/test/integration/sucre-natural-seed.integration.test.ts`: slugs únicos, Mojana una vez, `showOnHome = false` en seed, `published = true`

### Implementation for User Story 5

- [X] T040 [US5] Implementar `mergeSeedRecord` en `src/lib/sucre-natural-seed-merge.ts` según research.md §9
- [X] T041 [US5] Dataset tipado `prisma/data/sucre-natural-seed.ts` transcrito de `docs/fichas_destinos/transcripciones.md`: 7 hubs, 24 destinos (láminas 21+26 → un `paisaje-de-la-mojana`), biodiversidad (19 fauna + 5 flora + 4 bosques), 6 experiencias, 7 fuentes (`carsucre`, `colombia-travel`, `corpomojana`, `instituto-humboldt`, `parques-nacionales`, `minambiente`, `gobernacion-sucre` con URLs del spec); **sin** `archipielago-de-san-bernardo`; **sin** inventar lat/lng ni extraer PNG; `seedManaged: true`; destinos `showOnHome: false`
- [X] T042 [US5] `seedSucreNatural()` en `prisma/seed.ts` (después de roles): upsert hubs; destinos/especies/experiencias/fuentes por slug; log `Sucre Natural seed: created=N updated=N skippedManaged=N`; `console.error` por slug si falla un ítem; no parsear Markdown en runtime
- [X] T043 [US5] Relacionar en el seed: destinos↔hubs (Sanguaré paisajes+senderos, cavernas paisajes), Río San Jorge↔fuentes Corpomojana/Gobernación/MinAmbiente, experiencias↔destinos según transcripciones (`avistamiento-de-aves` → Sanguaré y La Caimanera)
- [X] T044 [US5] Actualizar comentario de `prisma/seed.ts` y `CLAUDE.md`: seed = roles + Sucre Natural; reejecutar es seguro

**Checkpoint**: Entorno local con contenido real; US3/US4 pueden colgar páginas del seed

---

## Phase 6: User Story 3 - Catálogo de especies enlazado a destinos (Priority: P2)

**Goal**: Hub Biodiversidad lista fauna/flora/ecosistemas agrupados; ficha de especie; chips/enlaces en destino; CRUD admin.

**Independent Test**: Dos especies + un destino vinculados; navegar destino → especie y especie → destino; especie sin destinos no promete enlaces.

### Tests for User Story 3

- [X] T045 [P] [US3] Component test listado agrupado (mamíferos, aves, etc.) en `src/test/components/sucre-natural-biodiversidad.component.test.tsx`
- [X] T046 [US3] Integration CRUD especie + solo `published` en público en `src/test/integration/sucre-natural-biodiversidad.integration.test.ts`

### Implementation for User Story 3

- [X] T047 [US3] Queries `getBiodiversityHub` / `getBiodiversityBySlug` en `src/lib/get-sucre-natural-public.ts` (kind `FAUNA|FLORA|ECOSYSTEM`, `groupKey`, destinos publicados)
- [X] T048 [US3] Completar hub `biodiversidad` en `src/app/sucre-natural/[hub]/page.tsx` (especies agrupadas + destinos del hub si hay) y ficha `src/app/sucre-natural/especies/[slug]/page.tsx` + `src/components/sucre-natural/ficha-especie.tsx` (nombre científico solo si existe; sin destinos: omitir sección)
- [X] T049 [US3] En `src/components/sucre-natural/ficha-destino.tsx`, chips = `biodiversityChipLabels` + especies relacionadas con enlace a `/sucre-natural/especies/{slug}`
- [X] T050 [US3] CRUD `createBiodiversityEntryAction` / update / delete en `src/lib/actions/sucre-natural.ts`: slug max 160 regex, `kind` enum, `destinationIds`, imagen opcional misma regla de medios, `assertAdminAction`, `seedManaged = false` al editar, revalidate
- [X] T051 [US3] Admin `src/app/admin/personalizar/biodiversidad/page.tsx` + `src/components/admin/biodiversidad-admin.tsx`; enlace en `src/components/admin/admin-shell.tsx`

**Checkpoint**: Hub ámbar usable con seed US5

---

## Phase 7: User Story 4 - Experiencias de turismo en naturaleza (Priority: P2)

**Goal**: Hub naranja lista 6 tipos de experiencia; ficha con dónde / qué / por qué / recomendaciones y destinos; CRUD admin. Distinto del CMS “Qué hacer”.

**Independent Test**: Publicar experiencia vinculada a dos destinos; abrirla desde el hub y navegar a las fichas.

### Tests for User Story 4

- [X] T052 [P] [US4] Component test hub experiencias + enlaces a destinos en `src/test/components/sucre-natural-experiencias.component.test.tsx`
- [X] T053 [US4] Integration CRUD + 404 unpublished en `src/test/integration/sucre-natural-experiencias.integration.test.ts`

### Implementation for User Story 4

- [X] T054 [US4] Queries `getExperiencesHub` / `getExperienceBySlug` en `src/lib/get-sucre-natural-public.ts` (`whereText` visible aunque `destinationIds` vacío)
- [X] T055 [US4] Completar hub `experiencias` en `src/app/sucre-natural/[hub]/page.tsx` y ficha `src/app/sucre-natural/experiencias/[slug]/page.tsx` + `src/components/sucre-natural/ficha-experiencia.tsx`
- [X] T056 [US4] CRUD experiencias en `src/lib/actions/sucre-natural.ts` (`whatYouDo`/`recommendations` `string[]`, `destinationIds`, mismos gates de auth/validación/revalidate/`seedManaged`)
- [X] T057 [US4] Admin `src/app/admin/personalizar/experiencias-naturaleza/page.tsx` + `src/components/admin/experiencias-naturaleza-admin.tsx` + nav en `src/components/admin/admin-shell.tsx`
- [X] T058 [US4] Buceo/careteo: no crear destino `archipielago-de-san-bernardo` en `prisma/data/sucre-natural-seed.ts`; mostrar `whereText` sin FK en `src/components/sucre-natural/ficha-experiencia.tsx`

**Checkpoint**: Siete hubs con contenido; historias P1 y P2 independientes

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accesibilidad, e2e, galería, quickstart, no filtrar PNG como contenido.

- [X] T059 [P] E2E Playwright: portada → Playas → El Francés; teclado; no hay `<img>` cuyo `src` sea `docs/fichas_destinos` en `e2e/critical-flows.spec.ts` (grep `-g "sucre natural"`)
- [X] T060 [P] E2E admin: login, `showOnHome`, despublicar, 404 público en `e2e/critical-flows.spec.ts`
- [X] T061 Página de fuentes en portada o pie de ficha usando `ContentSource` seed (`src/app/sucre-natural/page.tsx` / ficha)
- [X] T062 Revisar `priority` solo en hero de ficha y `unoptimized` en uploads (`src/components/sucre-natural/polaroid-image.tsx`, `src/app/imperdibles/[slug]/page.tsx`)
- [X] T063 Ejecutar flujo de `specs/006-fichas-sucre-natural/quickstart.md` (seed, rutas, tests listados) y anotar desviaciones en `specs/006-fichas-sucre-natural/quickstart.md` si las hay
- [X] T064 `npx biome check --write` en archivos tocados; `npm run test:db:prepare` tras la migración
- [X] T065 Verificar que `src/components/MapSection.tsx`, `src/app/api/chat/` y workflows n8n no se modificaron (fuera de alcance: mapa unificado y RAG)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup — **bloquea** todas las historias
- **US1 (Phase 3)**: tras Foundational — MVP público
- **US2 (Phase 4)**: tras Foundational (ideal tras US1 para verificar publicación de punta a punta)
- **US5 (Phase 5)**: tras Foundational; contenido de especies/experiencias se verá al completar US3/US4
- **US3 / US4**: tras Foundational; pueden ir en paralelo entre sí; mejor tras US5 para no páginas vacías
- **Polish**: tras las historias que se entreguen

### User Story Dependencies

- **US1 (P1)**: no depende de otras historias (fixture de test basta)
- **US2 (P1)**: no depende de US1; integra revalidate hacia rutas US1
- **US5 (P1)**: no depende de admin; el dataset no espera páginas de especie/experiencia
- **US3 (P2)**: lee destinos US1 y seed US5; admin propio
- **US4 (P2)**: igual que US3, sin depender de US3

### Within Each User Story

- Tests que fallen → modelo/schema ya en Foundational → queries → UI → actions → nav
- Authz (`assertAdminAction`) y logs en cada mutación
- No mezclar “Qué hacer”, mapa unificado ni RAG

### Parallel Opportunities

- T002 / T003 en Setup
- T006+T007, T008+T009, T014 en Foundational (tras T004/T005)
- T015 / T016; T019 / T020 en US1
- T028; T033 / T034 en US2
- T038 en US5
- T045; T052; US3 y US4 en paralelo tras Foundational
- T059 / T060 en Polish

---

## Parallel Example: User Story 1

```bash
# Tests en paralelo:
Task: "T015 DTO público en src/lib/sucre-natural-public.test.ts"
Task: "T016 Ficha oculta vacíos en src/test/components/sucre-natural-ficha.component.test.tsx"

# Páginas en paralelo tras T018:
Task: "T019 Portada src/app/sucre-natural/page.tsx"
Task: "T020 Layout src/app/sucre-natural/layout.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup  
2. Phase 2 Foundational  
3. Phase 3 US1  
4. **STOP**: validar portada → hub → ficha con un destino de prueba  
5. Demo sin seed completo

### Incremental Delivery

1. Setup + Foundational  
2. US1 → demo micrositio  
3. US2 → staff publica  
4. US5 → 24 fichas + catálogos en BD  
5. US3 → Biodiversidad  
6. US4 → Experiencias  
7. Polish / e2e / quickstart  

### Parallel Team Strategy

1. Equipo: Setup + Foundational  
2. Dev A: US1 → US2  
3. Dev B: US5 (dataset) en paralelo tras T004  
4. Dev C: US3 y US4 en paralelo tras US5 (o con fixtures)

---

## Notes

- Slug destino/especie/experiencia: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, max 160
- Medios: prefijo `/uploads/gallery/images/`, sin `..`
- Coords: ambas o ninguna
- Tope 20 solo `showOnHome && published`
- Hubs: catálogo cerrado; admin no crea/borra ids
- Seed: TypeScript en `prisma/data/sucre-natural-seed.ts`; transcripciones.md es editorial
- No servir `docs/fichas_destinos/*.png` como página
- Commit por tarea o grupo lógico; parar en cada checkpoint

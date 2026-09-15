# Tasks: CMS de actividades «Qué hacer en Sucre»

**Input**: Design documents from `/specs/007-que-hacer-actividades/`  
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

**Purpose**: Carpetas del módulo. El proyecto Next/Prisma ya existe.

- [ ] T001 Crear directorios `src/components/que-hacer/`, `src/app/que-hacer/[slug]/` y `src/app/admin/personalizar/que-hacer/` (`.gitkeep` si el árbol queda vacío hasta las historias)
- [ ] T002 [P] Anotar en `CLAUDE.md` (sección Base de datos) que `npm run db:seed` incluirá el volcado «Qué hacer» además de roles y Sucre Natural — nota breve, sin implementar el seed aún

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema, catálogo de pictogramas, helpers puros, Zod, revalidación, referencias de galería y seed de los 5 ítems mock. **Ninguna user story empieza antes.**

**⚠️ CRITICAL**: Completar esta fase antes de US1–US5

- [ ] T003 Ampliar `prisma/schema.prisma` con `QueHacerCategory` (`slug` unique `@db.VarChar(160)`, `name` `@db.VarChar(120)`, `description` `@db.VarChar(500)?`, `sortOrder Int @default(0)`, `seedManaged Boolean @default(false)`); `QueHacerActivity` (`slug` unique `@db.VarChar(160)`, `title` `@db.VarChar(120)`, `description` `@db.Text`, `iconKey` `@db.VarChar(64)`, `published Boolean @default(false)`, `sortOrder Int @default(0)`, `seedManaged Boolean @default(false)`, `@@index([published, sortOrder])`); `QueHacerActivityPhoto` (`publicUrl` `@db.VarChar(2048)`, `sortOrder Int @default(0)`, `alt` `@db.VarChar(300)?`, `isCover Boolean @default(false)`, cascade desde actividad, `@@index([activityId, sortOrder])`); joins `QueHacerActivityOnCategory` (`@@id([activityId, categoryId])`, cascade ambos), `QueHacerDestinationOnCategory` (`destinationId` → `ImperdibleDestination` cascade, `categoryId` cascade, `@@id` ambos), `QueHacerActivityOnDestination` (`sortOrder Int @default(0)`, cascade ambos, `@@id([activityId, destinationId])`); relaciones inversas en `ImperdibleDestination`
- [ ] T004 Crear migración Prisma y ejecutar `npm run db:generate` (SQL solo de schema; sin backfill de destinos)
- [ ] T005 [P] Catálogo cerrado Lucide en `src/lib/que-hacer-icons.ts`: claves mínimas `waves`, `palette`, `utensils-crossed`, `tree-pine`, `heart` más 15–25 turísticos y reserva `compass`; `isQueHacerIconKey()`; `resolveQueHacerIcon(iconKey)` devuelve icono+label o reserva `compass` + título visible en UI (el helper no oculta el título)
- [ ] T006 [P] Tests del catálogo y reserva en `src/lib/que-hacer-icons.test.ts` (clave inválida → `compass`; las 5 del mock existen)
- [ ] T007 Constantes y puros en `src/lib/que-hacer-home.ts`: `QUE_HACER_HOME_CAROUSEL_AFTER = 5`, `QUE_HACER_AUTOPLAY_MS = 5000`, `shouldUseHomeCardCarousel(count)` verdadero solo si `count > 5`
- [ ] T008 [P] Tests de umbral 0/5/6 en `src/lib/que-hacer-home.test.ts` (deben fallar hasta T007)
- [ ] T009 Puros de fotos en `src/lib/que-hacer-photos.ts`: `QUE_HACER_MAX_PHOTOS = 12`; `pickCoverPhoto(photos)` = `isCover === true` de menor `sortOrder` o, si ninguna, menor `sortOrder`; `filterLivePhotos`; `isActivityPubliclyVisible` = `published && livePhotos.length >= 1`
- [ ] T010 [P] Tests de cover, huérfanos y visibilidad en `src/lib/que-hacer-photos.test.ts`
- [ ] T011 Schema Zod en `src/lib/que-hacer-schema.ts`: título 1–120; descripción 1–1000; slug `SLUG_REGEX` `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` max 160 (reutilizar el de destinos); `iconKey` ∈ catálogo; al `published: true` exigir 1–12 `photoUrls` con prefijo `/uploads/gallery/images/` y rechazo de `..`; `categoryIds`/`destinationIds` arrays de string; categoría `name` 1–120; mensajes en español
- [ ] T012 [P] Tests Zod (slug inválido, publicar sin foto, `iconKey` fuera, URL con `..`, título vacío, >12 fotos) en `src/lib/que-hacer-schema.test.ts`
- [ ] T013 Helper `revalidateQueHacerPaths(opts)` en `src/lib/que-hacer-revalidate.ts`: `revalidatePath` de `/`, `/que-hacer/{slug}`, `/imperdibles/{slug}` afectados, `/admin/personalizar/que-hacer`, `/admin/personalizar/destinos-imperdibles`
- [ ] T014 [P] Recolector puro `isGalleryUrlUsedByQueHacer` en `src/lib/gallery-que-hacer-references.ts` + test `src/lib/gallery-que-hacer-references.test.ts`
- [ ] T015 Dataset tipado de las 5 categorías y 5 actividades homónimas (slugs `playas`, `cultura`, `gastronomia`, `naturaleza`, `experiencias`; iconKeys `waves`/`palette`/`utensils-crossed`/`tree-pine`/`heart`; copy del mock actual; `published=true`; `sortOrder` 1–5; `destinationIds` vacíos) en `prisma/data/que-hacer-seed.ts`
- [ ] T016 `seedQueHacer()` en `prisma/seed.ts` (después de Sucre Natural): upsert por slug, `seedManaged`, reutilizar `decideSeedMerge`/`mergeJoinIds` de `src/lib/sucre-natural-seed-merge.ts`; copiar JPG de `src/assets/` (`playa-tolu.jpg`, `cultura-sucre.jpg`, `gastronomia-sucre.jpg`, `naturaleza-sucre.jpg`, `festival-sucre.jpg`) a `public/uploads/gallery/images/que-hacer-{slug}.*`; upsert `GalleryAsset` por `publicUrl`; log `Que hacer seed: created=N updated=N skippedManaged=N`; no pisar `seedManaged === false`

**Checkpoint**: Schema y seed listos; helpers puros testeados; aún no se toca la home pública

---

## Phase 3: User Story 1 - Ver «Qué hacer en Sucre» con contenido real (Priority: P1) 🎯 MVP

**Goal**: La portada deja el mock: tarjetas CMS (pictograma + título + descripción + foto de portada), grilla si ≤5, carrusel Embla si >5, fondo autoplay pausable, sección oculta si 0. Ficha mínima `/que-hacer/[slug]` para que el enlace no 404 (carrusel multi-foto es US5).

**Independent Test**: Con seed o fixture, abrir `/` y ver las 5 actividades (no Playas/Cultura hardcodeados en el componente). Clic Playas → `/que-hacer/playas`. 0 publicadas → la sección no existe.

### Tests for User Story 1

- [ ] T017 [P] [US1] Test de componente 0 / 5 / 6 ítems (sin sección / grilla sin flechas / carrusel con anterior-siguiente) en `src/test/components/activities-section.component.test.tsx`
- [ ] T018 [US1] Integration lecturas públicas: home solo `published` con foto viva; slug despublicado o sin fotos → 404 conceptual en `src/test/integration/que-hacer-public.integration.test.ts`

### Implementation for User Story 1

- [ ] T019 [US1] Query RSC `getQueHacerForHome()` en `src/lib/get-que-hacer-home.ts`: `published`, orden `sortOrder`, fotos vivas (mismo criterio de disco que galería), DTO con cover, `iconKey`, `useCardCarousel`; no cargar todas las fotos de galería para el fondo (solo covers, NFR-004)
- [ ] T020 [P] [US1] Query RSC `getQueHacerBySlug(slug)` en `src/lib/get-que-hacer-detail.ts`: 404 si no visible; título, descripción, icono resuelto, fotos vivas, categorías (nombres; puede ir vacío hasta US3), destinos publicados (vacío hasta US4)
- [ ] T021 [US1] Reescribir `src/components/ActivitiesSection.tsx`: quitar array mock e imports de `@/assets`; recibir payload; overlay pictograma+título+descripción sobre cover vía `toServedMediaUrl`; `Link` a `/que-hacer/{slug}`; si `shouldUseHomeCardCarousel` usar Embla + Autoplay (`QUE_HACER_AUTOPLAY_MS`, `stopOnInteraction`/`stopOnMouseEnter`); fondo de sección con covers, autoplay 5 s; `prefers-reduced-motion: reduce` desactiva ambos autoplays; botón/control de pausa con nombre accesible; 0 ítems → `return null`
- [ ] T022 [US1] Cargar payload en `src/app/page.tsx` con `Promise.all` (hero, imperdibles, que-hacer) y pasarlo por `src/components/HomePage.tsx` (no waterfall)
- [ ] T023 [US1] Ficha mínima `src/app/que-hacer/[slug]/page.tsx` + `src/components/que-hacer/activity-detail.tsx`: título, pictograma (reserva `compass` si clave inválida, título siempre visible), descripción, foto(s) estáticas o un solo slide; 404 si no visible; overlay/texto con contraste
- [ ] T024 [US1] Caso e2e `que hacer` en `e2e/critical-flows.spec.ts`: `/` muestra heading Qué hacer; enlace Playas → `/que-hacer/playas`; no hay textos mock si el seed no corrió — skip o asumir seed de test DB

**Checkpoint**: Home CMS; MVP público sin admin (seed)

---

## Phase 4: User Story 2 - Administrar actividades (Priority: P1)

**Goal**: CRUD admin de actividades (título, descripción, slug, pictograma de catálogo, 1–12 fotos, orden, publicación). Revalidar home y ficha.

**Independent Test**: Crear/publicar actividad mínima y verla en `/` y `/que-hacer/{slug}`; despublicar → 404; publicar sin foto → error en español.

### Tests for User Story 2

- [ ] T025 [US2] Integration create/update/unpublish/delete, rechazo publicar sin foto, `seedManaged` pasa a `false` al editar, `revalidatePath` incluye `/` y `/que-hacer/{slug}` en `src/test/integration/que-hacer-admin.integration.test.ts`

### Implementation for User Story 2

- [ ] T026 [US2] Server actions en `src/lib/actions/que-hacer.ts`: `createQueHacerActivityAction` / `updateQueHacerActivityAction` / `deleteQueHacerActivityAction` / `reorderQueHacerActivitiesAction`; `assertAdminAction` primero; Zod de T011; slug vacío → `slugifyImperdible(title)` con fallback `actividad` si el helper devolvería `destino` (envolver o parámetro); unique slug; `iconKey` ∈ catálogo; `published` exige ≥1 foto viva; `photoUrls` → `QueHacerActivityPhoto` (`sortOrder`, `isCover` según `coverUrl` o primera); create/update manual `seedManaged = false`; `{ ok:false, error }` en español; `console.error` con nombre de acción; `revalidateQueHacerPaths`
- [ ] T027 [US2] UI `src/components/admin/que-hacer-admin.tsx`: listado, alta/edición (título 1–120, descripción 1–1000, slug, Select de iconos del catálogo con label en español, GalleryPicker 1–12 fotos, publicado, orden); errores en español
- [ ] T028 [US2] Página `src/app/admin/personalizar/que-hacer/page.tsx` (RSC lista + cliente)
- [ ] T029 [US2] Nav «Qué hacer» en `src/components/admin/admin-shell.tsx` y tarjeta en `src/app/admin/personalizar/page.tsx`
- [ ] T030 [US2] Extender `deleteGalleryAssetAction` en `src/lib/actions/gallery.ts` con `isGalleryUrlUsedByQueHacer` (bloquear delete si URL en fotos de actividad; mensaje en español)

**Checkpoint**: Staff publica; visitante US1 ve cambios

---

## Phase 5: User Story 3 - Categorías compartidas (Priority: P1)

**Goal**: CRUD categorías; M-N categoría↔actividad y categoría↔destino; etiquetas en ficha pública. Borrar categoría no borra actividades/destinos.

**Independent Test**: Dos categorías en una actividad; un destino en una categoría; delete categoría deja actividad/destino.

### Tests for User Story 3

- [ ] T031 [P] [US3] Integration M-N (actividad en 2 categorías, destino en 1, delete categoría conserva filas) en `src/test/integration/que-hacer-categories.integration.test.ts`

### Implementation for User Story 3

- [ ] T032 [US3] Actions `createQueHacerCategoryAction` / `updateQueHacerCategoryAction` / `deleteQueHacerCategoryAction` en `src/lib/actions/que-hacer.ts` (o archivo `src/lib/actions/que-hacer-categories.ts` si el de actividades crece): name 1–120, slug único, description opcional max 500, `seedManaged = false` al editar; delete cascade solo joins
- [ ] T033 [US3] UI de categorías (pestaña o bloque) en `src/components/admin/que-hacer-admin.tsx`; multi-select `categoryIds` en el formulario de actividad
- [ ] T034 [US3] Payload `queHacerCategoryIds?: string[]` en `createImperdibleDestinationAction` / `updateImperdibleDestinationAction` (`src/lib/actions/imperdibles.ts`) y multi-select en `src/components/admin/imperdibles-destination-dialog.tsx`; no cambia `published`/`showOnHome`
- [ ] T035 [US3] Mostrar nombres de categorías como etiquetas en `src/components/que-hacer/activity-detail.tsx` (sin filtro de portada)

**Checkpoint**: Taxonomía usable en admin y visible en ficha

---

## Phase 6: User Story 4 - Enlazar destinos y fichas (Priority: P2)

**Goal**: Actividad ↔ destinos explícitos; público solo `published`; enlace de vuelta en ficha de destino, distinto de `liveActivities`.

**Independent Test**: Enlazar dos destinos publicados; abrir actividad y navegar a cada `/imperdibles/{slug}`; despublicar uno → desaparece; destino muestra actividades relacionadas.

### Tests for User Story 4

- [ ] T036 [P] [US4] Integration: destinos unpublished omitidos; inverso destino→actividades published en `src/test/integration/que-hacer-destinations.integration.test.ts`

### Implementation for User Story 4

- [ ] T037 [US4] `destinationIds` + `sortOrder` en create/update de actividad (`src/lib/actions/que-hacer.ts`) y picker de destinos publicados en `src/components/admin/que-hacer-admin.tsx`
- [ ] T038 [US4] Listar destinos publicados en `src/lib/get-que-hacer-detail.ts` y bloque «Dónde vivirlo» (u homólogo) en `src/components/que-hacer/activity-detail.tsx` con `Link` a `/imperdibles/{slug}`; omitir el bloque si vacío
- [ ] T039 [US4] Incluir actividades visibles en `src/lib/get-imperdible-detail.ts` y bloque «Qué hacer» en `src/components/sucre-natural/ficha-destino.tsx` (y layout Markdown de `src/app/imperdibles/[slug]/page.tsx` si no hay ficha estructurada); no mezclar con `liveActivities`

**Checkpoint**: Ida y vuelta actividad ↔ destino

---

## Phase 7: User Story 5 - Recorrer fotos de una actividad (Priority: P2)

**Goal**: Carrusel de todas las fotos vivas en la ficha; home sigue usando solo cover; alts y teclado.

**Independent Test**: Actividad con 3 fotos: home 1 cover; ficha recorre las 3 con anterior/siguiente.

### Tests for User Story 5

- [ ] T040 [P] [US5] Test de componente del carrusel de ficha (3 slides, controles con nombre accesible) en `src/test/components/que-hacer-activity-detail.component.test.tsx`

### Implementation for User Story 5

- [ ] T041 [US5] Carrusel Embla (flechas, teclado, `alt` o fallback título) en `src/components/que-hacer/activity-detail.tsx`; `prefers-reduced-motion` sin autoplay de fotos (el de ficha no es obligatorio; si se añade, pausable)
- [ ] T042 [US5] Confirmar que `ActivitiesSection` usa solo `pickCoverPhoto` (no recorre las 12 en la tarjeta) en `src/components/ActivitiesSection.tsx` y `src/lib/get-que-hacer-home.ts`
- [ ] T043 [US5] Si tras filtrar huérfanos no queda foto, no listar en home ni servir ficha (tratar no visible) en `src/lib/get-que-hacer-home.ts` y `src/lib/get-que-hacer-detail.ts`; aviso en admin al guardar si `published` y 0 vivas

**Checkpoint**: FR-007/010/020 cubiertos

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de quickstart, a11y, tests de seed, e2e.

- [ ] T044 [P] Integration del seed (5 slugs únicos, reejecutar no duplica, `seedManaged=false` no se pisa) en `src/test/integration/que-hacer-seed.integration.test.ts`
- [ ] T045 [P] Ampliar e2e `que hacer` en `e2e/critical-flows.spec.ts` si falta: heading, 5 tarjetas seed, URL `/que-hacer/playas`
- [ ] T046 Verificar contraste overlay (texto sobre foto) y que el pictograma no sea el único significado en `src/components/ActivitiesSection.tsx` y `src/components/que-hacer/activity-detail.tsx`
- [ ] T047 Recorrer `specs/007-que-hacer-actividades/quickstart.md` (seed, público, admin, tests listados) y corregir desviaciones en el propio quickstart
- [ ] T048 Ejecutar `npx biome check` sobre archivos tocados y tests unitarios/integration del módulo; `npm run test:db:prepare` si cambió el schema

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup — **bloquea** todas las historias
- **US1 (Phase 3)**: Foundational (usa seed T015–T016)
- **US2 (Phase 4)**: Foundational; se integra con US1 (revalidación)
- **US3 (Phase 5)**: Foundational + conviene US2 (formulario actividad)
- **US4 (Phase 6)**: Foundational + conviene US2 (formulario) y US1 (ficha)
- **US5 (Phase 7)**: US1 ficha mínima
- **Polish**: historias deseadas completas

### User Story Dependencies

- **US1 (P1)**: tras Phase 2 — MVP (home). No depende de admin
- **US2 (P1)**: tras Phase 2 — independiente con fixtures; con US1 se ve el ciclo publicar→home
- **US3 (P1)**: puede empezar tras Phase 2; el multi-select de actividad necesita T027
- **US4 (P2)**: picker de destinos necesita T027; bloque público necesita T023
- **US5 (P2)**: extiende T023

### Parallel Opportunities

- T002 ∥ T001
- T005–T014 puros/tests en paralelo tras T004 (archivos distintos)
- T017 ∥ T018
- T019 ∥ T020
- T031 ∥ T036 ∥ T040 en historias distintas si hay varios implementadores
- T044 ∥ T045

### Parallel Example: User Story 1

```bash
Task: "T017 activities-section.component.test.tsx"
Task: "T018 que-hacer-public.integration.test.ts"

# Tras queries:
Task: "T021 ActivitiesSection.tsx"
Task: "T023 activity-detail.tsx + page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup  
2. Phase 2 Foundational (schema + seed 5 ítems)  
3. Phase 3 US1  
4. **STOP**: validar home ≠ mock y `/que-hacer/playas`  
5. Demo sin admin

### Incremental Delivery

1. Setup + Foundational  
2. US1 → home CMS  
3. US2 → staff publica  
4. US3 → categorías  
5. US4 → destinos  
6. US5 → carrusel de fotos  
7. Polish / e2e / quickstart  

### Parallel Team Strategy

1. Equipo: Setup + Foundational  
2. Dev A: US1 → US5  
3. Dev B: US2 → US3  
4. Dev C: US4 (destinos) en paralelo tras T026/T023  

---

## Notes

- Slug: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, max 160
- Título actividad 1–120; descripción 1–1000; categoría name 1–120
- Fotos: 1–12 al publicar; prefijo `/uploads/gallery/images/`; sin `..`
- `QUE_HACER_HOME_CAROUSEL_AFTER = 5` (carrusel si **más de** 5)
- Autoplay 5000 ms; pausa + `prefers-reduced-motion`
- No fusionar con hubs Sucre Natural ni `NatureExperience`
- No mapa unificado, RAG, itinerarios, favoritos
- No listado `/que-hacer` ni filtro público por categoría
- Commit por tarea o grupo lógico; parar en cada checkpoint

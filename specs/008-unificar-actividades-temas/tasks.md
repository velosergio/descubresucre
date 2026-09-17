# Tasks: Unificar hubs temÃ¡ticos en Actividades

**Input**: Design documents from `/specs/008-unificar-actividades-temas/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos. ConstituciÃ³n (persistencia + authz) y plan.md exigen unit + integration + component + e2e. Escribir tests que fallen antes de implementar donde el riesgo lo amerite.

**Organization**: Por user story (US1â€“US5) para entregar incrementos independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelo (otro archivo, sin depender de tareas incompletas)
- **[Story]**: US1â€¦US5 segÃºn spec.md
- Toda tarea incluye ruta de archivo

## Path Conventions

Next.js App Router en la raÃ­z del repo: `src/`, `prisma/`, `e2e/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear docs/nav del feature; el proyecto Next/Prisma ya existe.

- [X] T001 [P] Actualizar `ROADMAP.md`: marcar unificaciÃ³n hubsâ†’Actividades (prompt 2/3) y dejar de llamar Â«micrositiosÂ» en el Ã­tem correspondiente
- [X] T002 [P] Nota breve en `CLAUDE.md` (chatbot/CMS o Base de datos): seed Â«QuÃ© hacerÂ» pasa a 7 temas canÃ³nicos; hubs pÃºblicos redirigen a `/que-hacer/[slug]`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema extendido, enum de modo, helpers de legado, Zod, seed/migraciÃ³n de los 7 temas, deprecar dependencia pÃºblica de hubs. **Ninguna user story empieza antes.**

**âš ï¸ CRITICAL**: Completar esta fase antes de US1â€“US5

- [X] T003 Ampliar `QueHacerActivity` en `prisma/schema.prisma`: `tagline String? @db.VarChar(500)`, `introMarkdown String? @db.Text`, `accentHsl String? @db.VarChar(64)`, enum `QueHacerListingMode` (`DESTINATIONS` | `BIODIVERSITY` | `EXPERIENCES`) con campo `listingMode` default `DESTINATIONS`; conservar fotos y `QueHacerActivityOnDestination`
- [X] T004 Crear migraciÃ³n Prisma (solo schema) y ejecutar `npm run db:generate`
- [X] T005 [P] Puros en `src/lib/que-hacer-listing-mode.ts`: tipo/enum, `isQueHacerListingMode()`, defaults por slug canÃ³nico (`biodiversidad`â†’`BIODIVERSITY`, `experiencias`â†’`EXPERIENCES`, restoâ†’`DESTINATIONS`)
- [X] T006 [P] Tests en `src/lib/que-hacer-listing-mode.test.ts` (vÃ¡lidos/invÃ¡lidos + defaults de los 7 slugs)
- [X] T007 [P] Mapa legado en `src/lib/que-hacer-hub-legacy.ts`: `CANONICAL_THEME_SLUGS`, `legacyHubIdToQueHacerSlug(hubId)`, `isCanonicalThemeSlug(slug)` (1:1 con los 7 hub ids)
- [X] T008 [P] Tests en `src/lib/que-hacer-hub-legacy.test.ts`
- [X] T009 Extender Zod en `src/lib/que-hacer-schema.ts`: `listingMode` obligatorio âˆˆ enum; `tagline` mÃ¡x. 500 opcional; `introMarkdown` opcional; `accentHsl` opcional con patrÃ³n de 3 componentes HSL; `destinationIds` array; **dejar de exigir** `categoryIds` en el schema de actividad (campo omitido o ignorado); mensajes en espaÃ±ol
- [X] T010 [P] Tests Zod nuevos/actualizados en `src/lib/que-hacer-schema.test.ts` (modo invÃ¡lido, accent mal formado, publish sin foto sigue fallando)
- [X] T011 Dataset tipado de los 7 temas en `prisma/data/que-hacer-temas-seed.ts` (slugs canÃ³nicos; titles/taglines/acentos/iconKeys alineados a `src/lib/sucre-natural-hubs.ts`; `listingMode` correcto; `published=true`; `sortOrder` 1â€“7; `seedManaged=true`)
- [X] T012 Reemplazar/adaptar `seedQueHacer()` en `prisma/seed.ts` (+ retirar dependencia del seed mock 007 en `prisma/data/que-hacer-seed.ts` o marcar obsoleto): upsert 7 actividades; backfill `QueHacerActivityOnDestination` desde `ImperdibleDestinationHub` (activity slug = hubId); unpublish/delete actividades `seedManaged` con slugs mock `cultura`|`gastronomia`|`naturaleza`; reconciliar `playas`/`experiencias` in-place; no pisar `seedManaged === false`; log `Que hacer temas seed: created=N updated=N unpublishedMock=N skippedManaged=N hubJoins=N`
- [X] T013 Extender `revalidateQueHacerPaths` en `src/lib/que-hacer-revalidate.ts` para incluir `/sucre-natural` y `/sucre-natural/{hub}` cuando el slug sea canÃ³nico

**Checkpoint**: Schema + seed 7 temas + helpers puros; home aÃºn puede mostrar datos viejos hasta US1

---

## Phase 3: User Story 1 - Ver temas en Â«QuÃ© hacer en SucreÂ» (Priority: P1) ðŸŽ¯ MVP

**Goal**: Home muestra actividades/temas publicados (seed 7); clic abre `/que-hacer/[slug]` con plantilla temÃ¡tica (acento) y listado segÃºn `listingMode` mÃ­nimo (al menos DESTINATIONS + placeholders comprensibles para bio/exp). Sin copy Â«micrositioÂ».

**Independent Test**: Tras seed, `/` muestra las 7 tarjetas CMS; Playas â†’ `/que-hacer/playas` con identidad; 0 publicadas â†’ secciÃ³n ausente.

### Tests for User Story 1

- [X] T014 [P] [US1] Actualizar/crear component test home 0 / â‰¤5 / >5 en `src/test/components/activities-section.component.test.tsx` (payload con temas; sin mock hardcodeado)
- [X] T015 [US1] Integration lectura pÃºblica: home solo published+foto viva; detalle por modo DESTINATIONS lista destinos del join; slug no publicado â†’ 404 en `src/test/integration/que-hacer-public.integration.test.ts`

### Implementation for User Story 1

- [X] T016 [US1] Extender DTOs/queries en `src/lib/get-que-hacer-home.ts` y `src/lib/get-que-hacer-detail.ts`: incluir `listingMode`, `tagline`, `accentHsl`, `introMarkdown`; en detalle DESTINATIONS â†’ destinos publicados del join; BIODIVERSITY â†’ todas `BiodiversityEntry` published; EXPERIENCES â†’ todas `NatureExperience` published (catÃ¡logo global)
- [X] T017 [US1] Plantilla temÃ¡tica `src/components/que-hacer/activity-theme-page.tsx` reutilizando componentes de `src/components/sucre-natural/*` (polaroid/listados): aplica accent CSS; render por modo; mensajes vacÃ­os sin bloque engaÃ±oso; pictograma+tÃ­tulo siempre visibles
- [X] T018 [US1] Sustituir ficha mÃ­nima: `src/app/que-hacer/[slug]/page.tsx` usa `activity-theme-page`; metadata con title del tema; 404 si no visible
- [X] T019 [US1] Ajustar `src/components/ActivitiesSection.tsx` / `HomePage` si hace falta (enlaces ok); asegurar heading Â«QuÃ© hacer en SucreÂ» y 0 Ã­tems â†’ `null`; sin texto micrositio
- [X] T020 [US1] E2E en `e2e/critical-flows.spec.ts`: home QuÃ© hacer â†’ `/que-hacer/playas`; assert no Â«micrositioÂ»

**Checkpoint**: MVP pÃºblico con 7 temas y plantilla; admin aÃºn sin campos nuevos (US2)

---

## Phase 4: User Story 2 - Administrar desde Actividades (Priority: P1)

**Goal**: Admin Actividades edita listingMode, tagline, intro, accent, destinos, fotos; copy sigue Â«ActividadÂ»; sin flujo obligatorio de hubs; categorÃ­as UI dormida.

**Independent Test**: Editar/publicar actividad en `/admin/personalizar/que-hacer` y ver cambios en home/ficha; publicar sin foto â†’ error espaÃ±ol; no hay admin hubs requerido.

### Tests for User Story 2

- [X] T021 [US2] Integration CRUD con `listingMode`/`accentHsl`, rechazo publish invÃ¡lido, `seedManagedâ†’false` al editar, en `src/test/integration/que-hacer-admin.integration.test.ts`

### Implementation for User Story 2

- [X] T022 [US2] Extender actions en `src/lib/actions/que-hacer.ts`: create/update aceptan `listingMode`, `tagline`, `introMarkdown`, `accentHsl`, `destinationIds`; omitir `categoryIds` en UI; `assertAdminAction`; revalidate T013; errores en espaÃ±ol
- [X] T023 [US2] Actualizar `src/components/admin/que-hacer-admin.tsx`: campos modo (select), acento, tagline, intro, destinos M-N, fotos; **ocultar** CRUD/UI de categorÃ­as; labels Â«ActividadÂ»
- [X] T024 [US2] Ajustar pÃ¡gina `src/app/admin/personalizar/que-hacer/page.tsx` al nuevo payload (sin categorÃ­as en props si aplica)
- [X] T025 [US2] Retirar nav/tarjeta/CRUD de hubs de producto: `src/components/admin/admin-shell.tsx`, `src/app/admin/personalizar/page.tsx`, y pÃ¡gina/admin hubs bajo `src/app/admin/personalizar/sucre-natural/` (conservar entradas Biodiversidad/Experiencias); eliminar o dejar de montar `sucre-natural-hubs-admin`; scrub copy Â«micrositioÂ»
- [X] T026 [US2] Actualizar/eliminar tests de admin hubs portada en `src/test/components/sucre-natural-hubs-admin.component.test.tsx` y `src/test/integration/sucre-natural-admin.integration.test.ts` para no exigir CRUD hubs

**Checkpoint**: Staff gestiona temas solo desde Actividades

---

## Phase 5: User Story 3 - Conservar destinos, especies y experiencias (Priority: P1)

**Goal**: AsociaciÃ³n dual destinoâ†”actividad; listados bio/exp globales; destinos multi-tema; sin romper fichas hijas.

**Independent Test**: Asignar destino desde Actividad y verlo en Destino (y viceversa); Playas lista destinos; Biodiversidad lista especies; Experiencias lista experiencias.

### Tests for User Story 3

- [X] T027 [P] [US3] Integration asociaciÃ³n dual y listados por modo en `src/test/integration/que-hacer-destinations.integration.test.ts` (y/o extender public integration)
- [X] T028 [P] [US3] Integration regresiÃ³n: hubs legacy ya no son fuente de listado pÃºblico; bio/exp hubs siguen listando catÃ¡logo global vÃ­a actividad en `src/test/integration/sucre-natural-public.integration.test.ts` (adaptar a `/que-hacer/...` o redirect)

### Implementation for User Story 3

- [X] T029 [US3] En `src/lib/actions/imperdibles.ts` + schema destino: `activityIds: string[]` sincroniza `QueHacerActivityOnDestination`; **deprecar** escritura de `hubIds` / UI categorÃ­as QuÃ© hacer; mensajes si se envÃ­a hubIds obsoleto
- [X] T030 [US3] UI destinos: `src/components/admin/imperdibles-destination-dialog.tsx` (y admin client) â€” multi-select actividades en lugar de hubs/categorÃ­as QuÃ© hacer
- [X] T031 [US3] Ficha destino pÃºblica `src/lib/get-imperdible-detail.ts` + UI: bloque Â«QuÃ© hacerÂ» desde join actividad (publicado); breadcrumbs/enlaces a `/que-hacer/{slug}` en vez de hub si aplica
- [X] T032 [US3] Verificar listados en `activity-theme-page` / queries: BIODIVERSITY y EXPERIENCES usan getters existentes (`getBiodiversityHub` / `getExperiencesHub` o equivalentes) sin filtrar por actividad; enlaces a `/sucre-natural/especies|experiencias/{slug}`

**Checkpoint**: No-regresiÃ³n destinos/especies/experiencias + entrada dual

---

## Phase 6: User Story 4 - URL Ãºnica y continuidad (Priority: P2)

**Goal**: CanÃ³nica `/que-hacer/[slug]`; `/sucre-natural/[hub]` redirect permanente; despublicado â†’ 404 coherente.

**Independent Test**: `/sucre-natural/playas` â†’ `/que-hacer/playas`; actividad despublicada â†’ 404 en canÃ³nica y legado.

### Tests for User Story 4

- [X] T033 [US4] Integration/redirect: hub vÃ¡lido publicado redirige; invÃ¡lido 404; despublicado 404 en `src/test/integration/que-hacer-hub-redirect.integration.test.ts` (o e2e si redirect solo en RSC)

### Implementation for User Story 4

- [X] T034 [US4] Reescribir `src/app/sucre-natural/[hub]/page.tsx`: si hub id vÃ¡lido y actividad publicada con ese slug â†’ `permanentRedirect(/que-hacer/{slug})`; si no â†’ `notFound()`
- [X] T035 [US4] Actualizar `src/app/sucre-natural/page.tsx` para enlazar a `/que-hacer/{slug}` (actividades publicadas), sin marca micrositio
- [X] T036 [US4] E2E o assert en `e2e/critical-flows.spec.ts`: visita `/sucre-natural/playas` termina en `/que-hacer/playas`

**Checkpoint**: Continuidad de bookmarks hubs

---

## Phase 7: User Story 5 - Temas mÃ¡s allÃ¡ de los siete (Priority: P2)

**Goal**: Crear octava actividad con modo DESTINATIONS, acento propio, misma plantilla; seed idempotente sin duplicar canÃ³nicos.

**Independent Test**: Alta admin de tema extra â†’ home + ficha temÃ¡tica; re-seed no duplica los 7 ni pisa `seedManaged=false`.

### Tests for User Story 5

- [X] T037 [US5] Integration: create actividad no canÃ³nica published aparece en home payload; re-seed no duplica slugs canÃ³nicos ni revive mocks en `src/test/integration/que-hacer-admin.integration.test.ts` o seed test dedicado

### Implementation for User Story 5

- [X] T038 [US5] Default `accentHsl` al crear en `src/lib/actions/que-hacer.ts` / UI si vacÃ­o (acento neutro del sitio o valor documentado en `que-hacer-listing-mode`/`que-hacer-hub-legacy`)
- [X] T039 [US5] Confirmar plantilla `activity-theme-page` funciona sin estar en `CANONICAL_THEME_SLUGS` (sin depender de defs de hub)
- [X] T040 [US5] Documentar en `specs/008-unificar-actividades-temas/quickstart.md` el alta del 8.Âº tema y el criterio de seed idempotente (si el quickstart quedÃ³ desfasado tras implementaciÃ³n)

**Checkpoint**: CatÃ¡logo abierto de actividades/temas

---

## Phase 8: Polish & Cross-Cutting

**Purpose**: Copy, ROADMAP/README, tests de categorÃ­as dormidas, limpieza.

- [X] T041 [P] Scrub Â«micrositioÂ» en copy admin/pÃºblico restante (`src/components/**`, `src/app/admin/**`, README si aplica); SC-004
- [X] T042 [P] Actualizar/skip tests de categorÃ­as QuÃ© hacer que ya no son producto (`src/test/integration/que-hacer-categories.integration.test.ts`) â€” documentar dormidos o eliminar UI-only asserts
- [X] T043 [P] Actualizar `README.md` rutas pÃºblicas (QuÃ© hacer canÃ³nico + redirect hubs) si aÃºn documenta hubs como entrada principal
- [X] T044 Correr `npx biome check --write` en archivos tocados y suite focal: unit listing/legacy/schema + integration que-hacer/sucre-natural + e2e greps del quickstart
- [X] T045 Verificar checklist del `specs/008-unificar-actividades-temas/quickstart.md` manualmente (o anotar resultados en PR)

---

## Dependencies & Story Order

```text
Phase 1 Setup â†’ Phase 2 Foundational
                    â†“
            US1 (MVP home + ficha temÃ¡tica)
                    â†“
            US2 (admin Actividades; retirar hubs UI)
                    â†“
            US3 (dual association + catÃ¡logos)
                    â†“
            US4 (redirects) âˆ¥ puede adelantarse tras US1 si solo toca [hub]/page
                    â†“
            US5 (temas extra)
                    â†“
            Polish
```

- **US1** bloquea valor pÃºblico; depende de Foundational (seed 7).
- **US2** bloquea operaciÃ³n CMS; depende de US1 para validar revalidate visualmente (tÃ©cnicamente puede paralelizar UI tras T009â€“T013).
- **US3** depende de US2 para `activityIds` en destinos + queries US1.
- **US4** depende de US1 (destino canÃ³nico existe); ideal tras seed.
- **US5** depende de US2 (create libre) + US1 (plantilla).

## Parallel Opportunities

- T001âˆ¥T002; T005âˆ¥T007; T006âˆ¥T008; T009â†’T010; T014âˆ¥T015 (tests); T027âˆ¥T028; T041âˆ¥T042âˆ¥T043
- Tras Foundational: tests US1 en paralelo con T016

## Implementation Strategy

### MVP (mÃ­nimo)

1. Phase 1â€“2  
2. US1 (home + ficha temÃ¡tica + seed 7)  
3. Parar y validar quickstart pÃºblico  

### Incremental

4. US2 admin  
5. US3 asociaciones/catÃ¡logos  
6. US4 redirects  
7. US5 temas extra + polish  

## Summary

| MÃ©trica | Valor |
|---------|-------|
| Total tareas | 45 |
| US1 | 7 (T014â€“T020) |
| US2 | 6 (T021â€“T026) |
| US3 | 6 (T027â€“T032) |
| US4 | 4 (T033â€“T036) |
| US5 | 4 (T037â€“T040) |
| Setup + Foundational + Polish | 2 + 11 + 5 |
| MVP sugerido | Foundational + US1 |
| Formato checklist | SÃ­ (checkbox, ID, [P]/[USx], rutas) |


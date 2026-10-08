# Tasks: Convocatorias (CMS)

**Input**: Design documents from `/specs/010-convocatorias-cms/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos. La Constitución (Principio II) exige pruebas automatizadas porque la feature toca persistencia, autorización y validación de URL externa; el Constitution Check de `plan.md` ya comprometió unit/integration/component/e2e. Escribir tests primero cuando el riesgo lo amerite (TDD para lógica pura y actions).

**Organization**: Por user story (US1–US2, prioridad P1→P2 de `spec.md`) para entregar incrementos independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelo (archivo distinto, sin depender de una tarea incompleta)
- **[Story]**: US1 (home pública), US2 (admin CRUD)
- Toda tarea incluye ruta de archivo exacta

## Path Conventions

Next.js App Router en la raíz del repo: `src/`, `prisma/`, `e2e/` (ver `plan.md` → Project Structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: El proyecto Next.js/Prisma ya existe; solo se prepara el andamiaje de directorios del feature.

- [ ] T001 Crear los directorios vacíos que usará el feature: `src/app/admin/personalizar/convocatorias/` (sin contenido todavía; lo llenan las fases siguientes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Modelo de datos del que dependen US1 y US2. **Ninguna user story empieza antes.**

**⚠️ CRITICAL**: Completar esta fase antes de US1–US2

- [ ] T002 Añadir `model Convocatoria` en `prisma/schema.prisma` con los campos exactos de `data-model.md`: `id` (String, `@id @default(cuid())`), `title` (String, `@db.VarChar(200)` — máx. 200), `description` (String, `@db.Text`), `audience` (String, `@db.VarChar(200)` — máx. 200), `type` (String, `@db.VarChar(80)` — máx. 80), `deadline` (DateTime, obligatorio; semántica día calendario / medianoche UTC), `externalUrl` (String, `@db.VarChar(2048)` — máx. 2048), `published` (Boolean, `@default(true)`), `createdAt` (`@default(now())`), `updatedAt` (`@updatedAt`); índice `@@index([published, deadline])`
- [ ] T003 Crear la migración Prisma para la tabla de convocatorias (`npx prisma migrate dev` o equivalente del proyecto) y ejecutar `npm run db:generate`

**Checkpoint**: Tabla `Convocatoria` disponible; ninguna UI la usa todavía.

---

## Phase 3: User Story 1 - Ver convocatorias reales en la home (Priority: P1) 🎯 MVP

**Goal**: La home muestra la sección Convocatorias con oportunidades publicadas y vigentes (deadline ≥ hoy UTC), enlace externo accionable, estado vacío sin mocks. El array hardcodeado de `ConvocatoriasSection.tsx` desaparece.

**Independent Test**: Insertar al menos una convocatoria publicada con deadline futuro (Prisma Studio o script), abrir `/`, ir a `#convocatorias` y confirmar título/descripción/audiencia/tipo/fecha/enlace; confirmar que ya no hay las 4 tarjetas de ejemplo del mock.

### Tests for User Story 1

- [ ] T004 [P] [US1] Unit tests en `src/lib/convocatoria-deadline.test.ts`: `startOfUtcDay` normaliza a medianoche UTC; `isDeadlineOpen(deadline, now)` es `true` cuando el día de deadline es hoy o futuro y `false` cuando es pasado; `formatDeadlineLabel` produce etiqueta legible en español (es-CO)
- [ ] T005 [P] [US1] Unit/integration tests de lectura en `src/lib/get-convocatorias-home.test.ts` o `src/test/integration/convocatorias-home.integration.test.ts`: `getConvocatoriasForHome()` solo devuelve `published=true` con deadline vigente; orden `deadline ASC`, `createdAt ASC`; excluye borradores y vencidas; lista vacía → `{ items: [] }`
- [ ] T006 [P] [US1] Component test en `src/test/components/convocatorias-section.component.test.tsx`: con payload de ítems se renderizan las tarjetas y el enlace "Más información" apunta a `externalUrl` con `target="_blank"` y `rel` que incluye `noopener`; payload vacío muestra mensaje de estado vacío (sin tarjetas inventadas)

### Implementation for User Story 1

- [ ] T007 [P] [US1] `src/lib/convocatoria-deadline.ts` (función pura): `startOfUtcDay(date)`, `isDeadlineOpen(deadline, now?)`, `formatDeadlineLabel(deadline)` en español
- [ ] T008 [US1] `src/lib/get-convocatorias-home.ts`: `getConvocatoriasForHome()` — consulta `Convocatoria` con `published=true` y `deadline >= startOfUtcDay(now)`, orden `deadline asc` + `createdAt asc`, mapea a `ConvocatoriasHomePayload` (`id`, `title`, `description`, `audience`, `type`, `deadline` ISO, `deadlineLabel`, `externalUrl`) según `data-model.md` y `contracts/public-routes.md`
- [ ] T009 [US1] Refactorizar `src/components/ConvocatoriasSection.tsx`: recibir `convocatoriasPayload` como prop; eliminar el array mock y el diccionario fijo `typeColors`; badge de tipo con acento derivado del texto (hash → paleta, como eventos/`research.md` §3); cada tarjeta con enlace real `<a href={externalUrl} target="_blank" rel="noopener noreferrer">Más información</a>`; estado vacío explícito cuando `items.length === 0`
- [ ] T010 [US1] `src/app/page.tsx` — añadir `getConvocatoriasForHome()` al `Promise.all` existente y pasar el payload como prop a `HomePage`
- [ ] T011 [US1] `src/components/HomePage.tsx` — aceptar `convocatoriasPayload` y pasarlo a `ConvocatoriasSection`
- [ ] T012 [US1] Extender `e2e/critical-flows.spec.ts` con un escenario: la home muestra la sección `#convocatorias` (lista o estado vacío); si hay ítems sembrados en el setup e2e, el enlace "Más información" tiene `href` http(s)

**Checkpoint**: MVP público funcional — sección real o vacía, sin datos hardcodeados (aunque la BD esté vacía hasta US2).

---

## Phase 4: User Story 2 - Administrar convocatorias desde el panel (Priority: P2)

**Goal**: El staff (admin/editor) crea, edita y elimina convocatorias desde `/admin/personalizar/convocatorias` con título, descripción, audiencia, tipo, fecha límite y enlace externo obligatorio.

**Independent Test**: Con sesión de staff, crear una convocatoria publicada vigente → aparece en home (US1); editar enlace/fecha; despublicar o eliminar → desaparece de home; intento sin auth → rechazo.

### Tests for User Story 2

- [ ] T013 [P] [US2] Unit tests en `src/lib/convocatoria-schema.test.ts`: rechaza si falta `title`/`description`/`audience`/`type`/`deadline`/`externalUrl`; rechaza `title` > 200, `audience` > 200, `type` > 80, `externalUrl` > 2048; rechaza URL sin protocolo o con esquema distinto de `http:`/`https:` (p. ej. `javascript:`); acepta payload mínimo válido con `published` default `true`; normalización de `deadline` a medianoche UTC del día
- [ ] T014 [US2] Integration test en `src/test/integration/convocatorias-admin.integration.test.ts`: `createConvocatoriaAction`/`updateConvocatoriaAction`/`deleteConvocatoriaAction` devuelven `{ ok: false, error: "No autorizado." }` sin modificar datos sin sesión de staff; con staff, create persiste todos los campos, update cambia `externalUrl`/`deadline`/`published`, delete retira el registro; mutación exitosa dispara `revalidatePath("/")` y `revalidatePath("/admin/personalizar/convocatorias")`; convocatoria publicada con deadline pasado no aparece en `getConvocatoriasForHome()`
- [ ] T015 [P] [US2] Component test en `src/test/components/convocatorias-admin.component.test.tsx`: el formulario exige campos obligatorios y muestra el error de la action si el guardado falla; la lista muestra convocatorias (incl. vencidas/borrador) con editar/eliminar

### Implementation for User Story 2

- [ ] T016 [P] [US2] `src/lib/convocatoria-schema.ts` (Zod): `title` string 1–200 trim, `description` string mín. 1 trim, `audience` string 1–200 trim, `type` string 1–80 trim, `deadline` fecha obligatoria normalizada a medianoche UTC, `externalUrl` string 1–2048 con URL absoluta `http`/`https` únicamente, `published` boolean `default(true)`; mensajes de error en español según `contracts/admin-actions.md`
- [ ] T017 [US2] `src/lib/actions/convocatorias.ts` — `createConvocatoriaAction`, `updateConvocatoriaAction(id, …)`, `deleteConvocatoriaAction(id)`: cada una empieza con `assertAdminAction()`, valida con el schema de T016, opera sobre Prisma, hace `revalidatePath("/")` + `revalidatePath("/admin/personalizar/convocatorias")`, retorna `{ ok: true }` o `{ ok: false, error }` según `contracts/admin-actions.md`; `console.error` (operación + id) si Prisma falla
- [ ] T018 [US2] `src/lib/get-convocatorias-home.ts` — añadir `getAllConvocatoriasForAdmin()` (todas, cualquier estado/fecha; orden útil p. ej. `deadline DESC` o `updatedAt DESC`) para la pantalla admin
- [ ] T019 [US2] `src/components/admin/convocatorias-admin.tsx` — listado + formulario crear/editar: título, descripción, audiencia, tipo (texto libre), fecha límite, enlace externo, toggle publicado; indicadores de “vencida” / “borrador”; borrado con el patrón de `confirm-delete-dialog.tsx` ya usado en el admin
- [ ] T020 [US2] `src/app/admin/personalizar/convocatorias/page.tsx` — server component: llama a `getAllConvocatoriasForAdmin()` y monta `convocatorias-admin.tsx`; hereda el guard de staff del layout `/admin/personalizar`
- [ ] T021 [P] [US2] `src/components/admin/admin-shell.tsx` — añadir ítem de navegación a `/admin/personalizar/convocatorias` (label "Convocatorias", icono coherente p. ej. Megaphone)
- [ ] T022 [P] [US2] `src/app/admin/personalizar/page.tsx` — añadir card del hub que enlace a `/admin/personalizar/convocatorias`
- [ ] T023 [US2] Extender `e2e/critical-flows.spec.ts`: flujo staff crea convocatoria publicada vigente → aparece en `#convocatorias` de la home con el `href` del enlace externo

**Checkpoint**: Staff gestiona convocatorias de punta a punta; home (US1) refleja los cambios.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de calidad, docs y criterios del quickstart.

- [ ] T024 [P] Actualizar `README.md` (tabla de rutas admin / menciones de convocatorias CMS) si aún describe la sección como mock
- [ ] T025 [P] Marcar el ítem Convocatorias como hecho en `ROADMAP.md` (sección CMS / prompt 5) de forma consistente con el resto de ítems ✅
- [ ] T026 Verificar quickstart.md: checklist de “Criterio de listo” en verde; `npx biome check` sobre archivos tocados; suites unit/integration/component/e2e de convocatorias en verde
- [ ] T027 Confirmar que no queda ningún array/mock de convocatorias en `src/` (grep por títulos de ejemplo del mock antiguo: "Convocatoria para Artistas Visuales", etc.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup — **bloquea** US1 y US2
- **US1 (Phase 3)**: después de Foundational — MVP público (datos vía seed/Prisma Studio si US2 aún no existe)
- **US2 (Phase 4)**: después de Foundational — puede solaparse con US1 en archivos distintos; el e2e completo de T023 espera US1 + US2
- **Polish (Phase 5)**: después de US1 y US2 deseadas

### User Story Dependencies

- **US1 (P1)**: no depende de US2; se valida insertando filas directo en BD
- **US2 (P2)**: no depende de la UI de US1 para el CRUD, pero el valor de negocio se verifica contra la home de US1

### Within Each User Story

- Tests que deben fallar primero → implementación
- Helpers puros → lectura/actions → UI → e2e

### Parallel Opportunities

- Tras T003: T004/T005/T006 en paralelo; T007 en paralelo a tests de deadline
- Tras T008: T009 puede avanzar mientras se preparan T010/T011
- En US2: T013/T015/T016 en paralelo; T021/T022 en paralelo tras existir la ruta admin

---

## Parallel Example: User Story 1

```bash
# Tests en paralelo:
Task: "T004 unit convocatoria-deadline.test.ts"
Task: "T005 lectura get-convocatorias-home"
Task: "T006 component convocatorias-section"

# Luego implementación pura + lectura:
Task: "T007 convocatoria-deadline.ts"
Task: "T008 get-convocatorias-home.ts"
```

---

## Parallel Example: User Story 2

```bash
Task: "T013 unit convocatoria-schema.test.ts"
Task: "T015 component convocatorias-admin"
Task: "T016 convocatoria-schema.ts"
# Luego actions + UI admin (T017–T020), nav en paralelo (T021–T022)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2 (modelo + migración)
2. Phase 3 US1 (lectura + home sin mock)
3. **STOP y validar** con una fila insertada a mano
4. Demo pública viable (estado vacío o datos reales)

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → home real → MVP
3. US2 → CMS staff → cierre del ROADMAP ítem 5
4. Polish → docs + grep anti-mock + CI verde

### Parallel Team Strategy

1. Equipo cierra Setup + Foundational
2. Dev A: US1 (home) · Dev B: US2 (schema Zod + actions + admin UI)
3. Integrar e2e T023 al final

---

## Notes

- [P] = archivos distintos, sin depender de tarea incompleta
- Constraints de campos citados desde `data-model.md` (máx. 200/200/80/2048, URL http/https, deadline día UTC)
- Sin route handler público (research §5)
- Sin seed de las 4 convocatorias ficticias del mock
- Commit tras cada tarea o grupo lógico
- Siguiente comando: `/speckit-implement`

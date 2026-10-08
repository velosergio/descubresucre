# Research: Convocatorias (CMS)

## 1. Modelo único `Convocatoria`

**Decision**: Un modelo Prisma `Convocatoria` con los campos del spec; sin relaciones a destinos, eventos ni galería en esta versión.

**Rationale**: El ROADMAP y el spec piden un CMS plano de oportunidades con enlace externo. No hay ficha interna ni asociación territorial en el alcance.

**Alternatives considered**: Reutilizar `CulturalEvent` con un discriminador (rechazado: semántica distinta — fecha de evento vs fecha límite de inscripción; ensucia agenda). Modelo + tabla de tipos (rechazado: Assumptions — tipo es etiqueta libre).

## 2. Fecha límite: día calendario y “vigente hoy”

**Decision**: Campo `deadline` como `DateTime` con semántica de **solo fecha**: se persiste como medianoche UTC del día elegido (`YYYY-MM-DDT00:00:00.000Z`). Una convocatoria está vigente si `deadline` (día calendario UTC) es **mayor o igual** al día calendario UTC de “hoy” al momento de la consulta. Helper puro `isDeadlineOpen(deadline, now)` + `startOfUtcDay(date)` en `convocatoria-deadline.ts`.

**Rationale**: El spec exige que “hoy” siga mostrando la convocatoria; comparar solo el día evita que una medianoche UTC haga desaparecer oportunidades a media mañana en Colombia. Usar UTC de forma consistente con `page.tsx` (eventos ya usan `getUTC*`) evita sorpresas entre SSR y tests.

**Alternatives considered**: `America/Bogota` con librería de TZ (rechazado para v1: dependencia nueva sin necesidad; se puede endurecer después). Fin de día 23:59:59 (equivalente si se compara por día truncado). Tipo Prisma `Date` nativo si el adapter lo soporta bien — se prefiere `DateTime` alineado al resto del schema.

## 3. Tipo como etiqueta libre (sin catálogo)

**Decision**: `type` es `String` corto (máx. 80). El color del badge en home se deriva de forma determinística del texto (hash → paleta fija de acentos del sitio), no de un diccionario fijo `Arte|Turismo|…` como el mock actual.

**Rationale**: Igual que `category` en eventos (009 §3). El mock rompe si el staff escribe un tipo nuevo.

**Alternatives considered**: Enum Prisma (migración por cada tipo nuevo). Tabla `ConvocatoriaType` (sobre-ingeniería para v1).

## 4. Enlace externo obligatorio (http/https)

**Decision**: Zod `z.string().url()` + refine/superrefine que exige protocolo `http:` o `https:`. Mensaje en español. En UI: `<a href={externalUrl} target="_blank" rel="noopener noreferrer">` con texto “Más información” y `aria`/copy que indique destino externo.

**Rationale**: FR-004/NFR-002; el mock actual no tenía URL (el CTA no hacía nada útil). Abrir en nueva pestaña es el patrón esperado para salidas del sitio.

**Alternatives considered**: Permitir rutas relativas internas (rechazado: Assumptions — no hay detalle interno). Validar solo con regex laxa (rechazado: Zod URL es más seguro y alineado al proyecto).

## 5. Lectura pública solo SSR (sin route handler)

**Decision**: `getConvocatoriasForHome()` en `src/lib/get-convocatorias-home.ts`, llamada desde `src/app/page.tsx` dentro del `Promise.all` existente; payload como prop a `HomePage` → `ConvocatoriasSection`. **No** se crea `/api/convocatorias`.

**Rationale**: A diferencia de eventos, no hay navegación cliente (mes prev/next). SSR + `revalidatePath("/")` tras mutaciones cumple SC-002. Evita superficie API innecesaria.

**Alternatives considered**: Server Action de solo lectura desde el client (innecesario). Route handler “por si acaso” (YANGI).

## 6. Publicación y visibilidad

**Decision**: `published` boolean default `true`. Home: `published === true` AND `isDeadlineOpen(deadline)`. Admin lista todas (publicadas, borradores, vencidas) con indicadores claros de estado.

**Rationale**: Spec FR-008 y edge cases. Guardar publicada con deadline pasado es válido en admin pero no aparece en home.

## 7. Retiro del mock

**Decision**: Eliminar el array `convocatorias` y `typeColors` fijos de `ConvocatoriasSection.tsx`. No migrar las cuatro filas de ejemplo a BD. Estado vacío con mensaje explícito (FR-010).

**Rationale**: Assumptions del spec; mismo criterio que 009 §10.

## 8. Admin UX y navegación

**Decision**: Ruta `/admin/personalizar/convocatorias` + card en el hub de Personalizar + ítem en `admin-shell`. Formulario create/edit (dialog o página embebida) con los seis campos + toggle publicado. Sin picker de galería.

**Rationale**: NFR-001 — mismo lugar que eventos/qué-hacer. Sin imagen en el spec.

## 9. Orden público

**Decision**: `ORDER BY deadline ASC, createdAt ASC` (más próxima primero; empate estable).

**Rationale**: Assumptions del spec.

## 10. Autorización, revalidación y observabilidad

**Decision**: `assertAdminAction()` → Zod → Prisma → `revalidatePath("/")` + `revalidatePath("/admin/personalizar/convocatorias")`. Errores con `console.error` (operación + id).

**Rationale**: Constitución III/IV; paridad con `cultural-events.ts`.

## 11. Estrategia de pruebas

**Decision**: Unit (`convocatoria-schema`, `convocatoria-deadline`). Integration (actions RBAC/validación/persistencia + lectura home filtrando vencidas/borrador). Component (sección + admin). E2E en `critical-flows.spec.ts`: staff crea → home muestra → enlace `href` correcto; estado vacío cuando no hay vigentes.

**Rationale**: Constitución II — persistencia + auth + URL.

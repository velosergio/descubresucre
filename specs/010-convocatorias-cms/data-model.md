# Data model: Convocatorias (CMS)

Modelo nuevo; no extiende ninguno existente (ver `research.md` §1).

## Constantes (código)

```text
CONVOCATORIA_TITLE_MAX = 200
CONVOCATORIA_AUDIENCE_MAX = 200
CONVOCATORIA_TYPE_MAX = 80
CONVOCATORIA_EXTERNAL_URL_MAX = 2048
```

## `Convocatoria`

| Field        | Type      | Notes |
|--------------|-----------|-------|
| id           | String PK | cuid |
| title        | String    | máx. 200 |
| description  | Text      | descripción libre |
| audience     | String    | máx. 200; a quién va dirigida |
| type         | String    | máx. 80; etiqueta libre (research §3) |
| deadline     | DateTime  | día calendario; persistido como medianoche UTC (research §2) |
| externalUrl  | String    | máx. 2048; URL absoluta http/https |
| published    | Boolean   | default `true`; solo `true` + deadline vigente es visible en home |
| createdAt    | DateTime  | `@default(now())` |
| updatedAt    | DateTime  | `@updatedAt` |

Índice: `@@index([published, deadline])` (consulta home: publicadas con `deadline >= startOfUtcDay(now)`, orden `deadline ASC, createdAt ASC`).

Sin relaciones con otros modelos en esta versión.

### Regla de vigencia

Una convocatoria es **vigente** cuando el día calendario UTC de `deadline` es ≥ al día calendario UTC de “hoy” (`isDeadlineOpen`). El día de la fecha límite sigue siendo visible.

### Publicación

`published = true` por defecto. Lectura pública MUST ignorar `published = false` aunque el deadline sea futuro.

## Validation (Zod, `convocatoria-schema.ts`)

- `title`: string, 1–200, trim.
- `description`: string, mínimo 1 carácter, trim.
- `audience`: string, 1–200, trim.
- `type`: string, 1–80, trim.
- `deadline`: fecha válida obligatoria (ISO date o datetime); se normaliza a medianoche UTC del día.
- `externalUrl`: string, 1–2048; URL absoluta con protocolo `http:` o `https:` únicamente.
- `published`: boolean, default `true`.

## State transitions

```text
create (published=true por defecto, deadline futuro/hoy) → visible en home
create (published=true, deadline pasado) → guardada; no visible en home
published=true → published=false → desaparece de home
update deadline (pasa a pasado) → deja de aparecer en home
delete → desaparece de home inmediatamente
```

## Forma pública derivada (no persistida)

`ConvocatoriasHomePayload` (tipo TS en `get-convocatorias-home.ts`):

```text
{
  items: Array<{
    id, title, description, audience, type,
    deadline,          // ISO string
    deadlineLabel,     // texto legible es-CO (p. ej. "30 de marzo de 2026")
    externalUrl,
  }>
}
```

Lista vacía → la sección muestra estado vacío (no hay paginación).

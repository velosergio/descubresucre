# Contracts: server actions admin (unificación temas)

`"use server"`, `assertAdminAction()` primero, Zod, `{ ok: true, ... } | { ok: false, error: string }` en español. Layout `/admin/personalizar` exige admin. Copy UI: **Actividad** / **Actividades**.

Módulo principal: `src/lib/actions/que-hacer.ts`. Destinos: `src/lib/actions/imperdibles.ts`.

## Actividades

### `createQueHacerActivityAction` / `updateQueHacerActivityAction`

```text
title, description, slug?, iconKey,
tagline?, introMarkdown?,
accentHsl?,                    # string HSL components o null
listingMode,                   # DESTINATIONS | BIODIVERSITY | EXPERIENCES
published, sortOrder?,
photoUrls: string[],
coverUrl?: string,
photoAlts?: (string | null)[],
destinationIds: string[]
# categoryIds: omitido / ignorado en UI v1
```

Reglas 007 (slug, icono, fotos al publicar, media URLs) + `listingMode` obligatorio en enum.  
`seedManaged = false` al editar manual.  
Revalidate: `/`, `/que-hacer/{slug}`, `/sucre-natural`, `/sucre-natural/{slug}` si slug canónico, destinos enlazados, admin.

### `deleteQueHacerActivityAction` / `reorderQueHacerActivitiesAction`

Igual espíritu 007; delete no borra destinos/especies/experiencias.

## Categorías

CRUD de categorías **no expuesto** en UI v1. Actions pueden permanecer pero no se usan en flujos de producto; preferible no llamarlas desde el admin unificado.

## Destinos (`imperdibles`)

### Create / update destino

```text
...campos destino existentes...
activityIds: string[]     # M-N canónico (entrada dual)
# hubIds: deprecado — no aceptar en UI; migrate ignore or reject with mensaje claro
# queHacerCategoryIds: deprecado en UI v1
```

Al guardar: sincronizar solo `QueHacerActivityOnDestination` con `activityIds`.  
Revalidate destinos + `/que-hacer/{slug}` de actividades afectadas + home.

## Hubs Sucre Natural

`saveSucreNaturalHubAction` (o equivalente): **retirar de UI**. Si la action permanece temporalmente, no es camino de producto; preferir eliminar llamadas y tests de admin hubs de portada.

CRUD biodiversidad / experiencias: sin cambio de contrato funcional.

## Errores (ejemplos)

- Modo inválido → «Selecciona un tipo de listado válido.»
- Publicar sin foto → «Publica al menos una foto de la galería.»
- accent mal formado → «El color de acento no es válido.»

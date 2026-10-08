# Contracts: server actions admin (Convocatorias)

`"use server"`, `assertAdminAction()` primero, Zod, `{ ok: true, ... } | { ok: false, error: string }` en español. Layout `/admin/personalizar` exige sesión de staff (admin/editor); `assertAdminAction()` es la puerta real en cada mutación.

Módulo: `src/lib/actions/convocatorias.ts`. Schema: `src/lib/convocatoria-schema.ts`.

## `createConvocatoriaAction` / `updateConvocatoriaAction`

```text
title, description, audience, type,
deadline,                 # ISO date o datetime; requerido; se normaliza a medianoche UTC
externalUrl,              # URL http/https; requerido
published?                # boolean; default true
```

Reglas:
- Todos los campos anteriores excepto `published` son obligatorios; el primer error de Zod se devuelve como `error` en español (mismo patrón que `cultural-events.ts`).
- `externalUrl` con protocolo distinto de http/https → error claro (p. ej. «El enlace debe empezar por http:// o https://.»).
- `updateConvocatoriaAction` recibe además `id`; inexistente → `{ ok: false, error: "Convocatoria no encontrada." }`.

Revalidate tras crear/editar/eliminar: `/`, `/admin/personalizar/convocatorias`.

## `deleteConvocatoriaAction`

```text
id
```

Borrado directo (sin dependientes). Revalidate igual que arriba.

## Lectura admin

`getAllConvocatoriasForAdmin()` — lista completa (incluye borradores y vencidas), orden sugerido `deadline DESC` o `updatedAt DESC` para gestión. No es action mutante; se llama desde la página admin (RSC). Protegida por el layout de personalizar.

## Lectura pública (no es action)

`getConvocatoriasForHome()` en `src/lib/get-convocatorias-home.ts` — sin `"use server"`, se llama desde `src/app/page.tsx`. Filtro: `published = true` y deadline vigente (`research.md` §2). Orden: `deadline ASC`, `createdAt ASC`.

## Errores (ejemplos)

- Campos incompletos → «Completa los campos obligatorios: título, descripción, audiencia, tipo, fecha límite y enlace.»
- URL inválida → «El enlace debe ser una URL válida que empiece por http:// o https://.»
- Sin sesión de staff → «No autorizado.» (mensaje estándar de `assertAdminAction`)
- Id inexistente → «Convocatoria no encontrada.»

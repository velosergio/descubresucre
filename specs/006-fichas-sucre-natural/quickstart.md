# Quickstart: Sucre Natural

## Prerrequisitos

- `.env` / `.env.test` con `DATABASE_URL` / `TEST_DATABASE_URL`.
- `npm run db:generate` y migración nueva aplicada (`npm run db:migrate` o `npm run test:db:prepare`).
- Admin existente (`npm run admin:create`).
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` opcional (mismo criterio que Imperdibles).

## Carga inicial

```bash
npm run db:seed
```

Esperado en consola: hubs 7, destinos ≥ 20, especies/flora/bosques según [transcripciones](../../docs/fichas_destinos/transcripciones.md), 6 experiencias, 7 fuentes. Reejecutar no duplica slugs.

Comprobar en MySQL que `paisaje-de-la-mojana` existe **una** vez.

## Público

1. `npm run dev` → [http://localhost:3000/sucre-natural](http://localhost:3000/sucre-natural)
2. Abrir hub Playas → ficha `playa-el-frances` (`/imperdibles/playa-el-frances`).
3. Verificar secciones: 30 segundos, qué lo hace especial, vive el destino, turismo responsable, cómo llegar. Sin imagen de tarjeta: marcador, no imagen rota.
4. Hub Biodiversidad → especie `titi-cabeciblanco`.
5. Hub Experiencias → `avistamiento-de-aves` y enlaces a destinos si el seed los relacionó.
6. Destino Imperdibles **sin** ficha (si existe en local): sigue el layout Markdown.

## Admin

1. `/admin/personalizar/destinos-imperdibles`: editar un destino, asignar hub, `showOnHome`, publicar.
2. Home `/#imperdibles` solo muestra `showOnHome`.
3. `/admin/personalizar/sucre-natural`: cambiar lema de un hub; se refleja en el hub público.
4. `/admin/personalizar/biodiversidad` y `experiencias-naturaleza`: CRUD mínimo.
5. Despublicar destino → 404 público y desaparece del hub.

## Tests

```bash
npx vitest run src/lib/sucre-natural-resolve.test.ts
npx vitest run src/lib/sucre-natural-seed-merge.test.ts
npx vitest run src/lib/sucre-natural-hubs.test.ts
npx vitest run src/lib/sucre-natural-public.test.ts
npx vitest run src/lib/sucre-natural-destination-schema.test.ts
node --env-file=.env.test ./node_modules/vitest/vitest.mjs run src/test/integration/sucre-natural-public.integration.test.ts src/test/integration/sucre-natural-admin.integration.test.ts src/test/integration/sucre-natural-seed.integration.test.ts src/test/integration/sucre-natural-biodiversidad.integration.test.ts src/test/integration/sucre-natural-experiencias.integration.test.ts
npx vitest run src/test/components/sucre-natural-ficha.component.test.tsx src/test/components/sucre-natural-biodiversidad.component.test.tsx src/test/components/sucre-natural-experiencias.component.test.tsx
node --env-file=.env.test ./node_modules/@playwright/test/cli.js test e2e/critical-flows.spec.ts -g "sucre natural"
```

Tras cambiar `schema.prisma`: `npm run test:db:prepare`.

## Desviaciones respecto al flujo inicial

- Los tests de integración viven en archivos por historia (`sucre-natural-public`, `-admin`, `-seed`, `-biodiversidad`, `-experiencias`), no en un único `sucre-natural.integration.test.ts`.
- El e2e de admin (`showOnHome` / despublicar / 404) se omite si no hay `E2E_ADMIN_EMAIL` y `E2E_ADMIN_PASSWORD`.
- `priority` en `next/image` se usa en el polaroid hero de ficha; las tarjetas de hub no lo llevan. Uploads van con `unoptimized`.


## No verificar en esta feature

- MapSection con todos los destinos (prompt 11).
- Indexación del chatbot (prompt 14).
- CMS “Qué hacer” (prompt 3).
- Que las PNG de `docs/fichas_destinos` se vean en el sitio (no deben ser el contenido).

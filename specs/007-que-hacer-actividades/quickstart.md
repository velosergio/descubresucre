# Quickstart: Qué hacer en Sucre

## Prerrequisitos

- `.env` / `.env.test` con `DATABASE_URL` / `TEST_DATABASE_URL`.
- `npm run db:generate` y migración nueva aplicada (`npm run db:migrate` o `npm run test:db:prepare`).
- Admin existente (`npm run admin:create`).
- Seed de Sucre Natural puede haberse corrido antes; no es obligatorio para ver las 5 actividades mock.

## Carga inicial

```bash
npm run db:seed
```

Esperado: 5 categorías y 5 actividades (`playas`, `cultura`, `gastronomia`, `naturaleza`, `experiencias`), publicadas, con foto. Reejecutar no duplica slugs.

Comprobar que `public/uploads/gallery/images/` contiene los archivos `que-hacer-*` y que no se sirve el mock de `src/components/ActivitiesSection.tsx`.

## Público

1. `npm run dev` → [http://localhost:3000/](http://localhost:3000/)
2. Sección **Qué hacer en Sucre**: 5 tarjetas (grilla, sin flechas de carrusel). Pictograma + título + descripción. Fondo con fotos, pausable.
3. Clic en Playas → `/que-hacer/playas` con foto(s) y descripción. Sin destinos en seed: no hay bloque de lugares vacío.
4. Con 6+ publicadas (alta admin): la home usa carrusel de tarjetas; flechas y pausa de autoplay.
5. 0 publicadas: la sección no aparece.
6. Destino con actividad enlazada (tras asignar en admin): bloque «Qué hacer» en `/imperdibles/{slug}`.

## Admin

1. `/admin/personalizar/que-hacer`: listar, crear, editar, publicar/despublicar, borrar actividades; CRUD categorías.
2. Crear actividad: título, descripción, icono del catálogo, ≥1 foto (galería), categorías opcionales, destinos opcionales.
3. Publicar sin foto → error en español.
4. `/admin/personalizar/destinos-imperdibles`: asignar categorías Qué hacer a un destino.
5. Despublicar actividad → desaparece de home y 404 en su URL.
6. Borrar de galería una foto usada en una actividad → bloqueado.

## Tests

```bash
npx vitest run src/lib/que-hacer-icons.test.ts
npx vitest run src/lib/que-hacer-home.test.ts
npx vitest run src/lib/que-hacer-photos.test.ts
npx vitest run src/lib/gallery-que-hacer-references.test.ts
npx vitest run src/lib/que-hacer-schema.test.ts
node --env-file=.env.test ./node_modules/vitest/vitest.mjs run src/test/integration/que-hacer-public.integration.test.ts src/test/integration/que-hacer-admin.integration.test.ts src/test/integration/que-hacer-seed.integration.test.ts
npx vitest run src/test/components/activities-section.component.test.tsx
node --env-file=.env.test ./node_modules/@playwright/test/cli.js test e2e/critical-flows.spec.ts -g "que hacer"
```

Tras cambiar `schema.prisma`: `npm run test:db:prepare`.

## No verificar en esta feature

- MapSection unificado (prompt 11).
- Indexación del chatbot (prompt 14).
- Rutas / favoritos (prompts 12–13).
- Fusionar hubs Sucre Natural o el hub Experiencias en naturaleza con este CMS.
- Textos de encabezado de la sección configurables desde admin.
- Listado público `/que-hacer` o filtro por categoría.

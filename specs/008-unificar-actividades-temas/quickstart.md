# Quickstart: Unificar hubs en Actividades

## Prerrequisitos

- `.env` / `.env.test` con `DATABASE_URL` / `TEST_DATABASE_URL`
- `npm run db:generate` + migración 008 aplicada (`npm run db:migrate` o `npm run test:db:prepare`)
- Admin (`npm run admin:create`)

## Carga / migración

```bash
npm run db:seed
```

Esperado:

- 7 actividades canónicas publicadas: `playas`, `cienagas`, `rios`, `paisajes`, `biodiversidad`, `senderos`, `experiencias`
- Semillas mock 007 (`cultura`, `gastronomia`, `naturaleza`, …) no aparecen publicadas en home
- Destinos que estaban en hubs siguen listándose bajo la actividad equivalente
- Reejecutar seed no duplica slugs ni joins

## Público

1. `npm run dev` → [http://localhost:3000/](http://localhost:3000/)
2. **Qué hacer en Sucre**: tarjetas de los temas publicados (≤5 grilla; >5 carrusel)
3. Clic **Playas** → `/que-hacer/playas` con plantilla temática + destinos del join
4. **Biodiversidad** → listado global de especies → ficha `/sucre-natural/especies/{slug}`
5. **Experiencias** → listado global → `/sucre-natural/experiencias/{slug}`
6. Abrir `/sucre-natural/playas` → redirect a `/que-hacer/playas`
7. Actividad despublicada: home sin tarjeta; `/que-hacer/{slug}` y legacy hub → 404
8. Copy visible: sin «micrositio»

## Admin

1. `/admin/personalizar/que-hacer`: CRUD **Actividades** con modo de listado, acento, tagline/intro, destinos, fotos
2. No hay flujo obligatorio de admin «hubs/micrositios»
3. `/admin/personalizar/destinos-imperdibles`: asignar **actividades** (misma relación que en el form de actividad)
4. Biodiversidad / experiencias: pantallas hijas siguen existiendo
5. Publicar sin foto o modo inválido → error en español

## Tests

```bash
npx vitest run src/lib/que-hacer-listing-mode.test.ts src/lib/que-hacer-hub-legacy.test.ts
node --env-file=.env.test ./node_modules/vitest/vitest.mjs run --maxWorkers=1 src/test/integration
npx vitest run src/test/components
node --env-file=.env.test ./node_modules/@playwright/test/cli.js test e2e/critical-flows.spec.ts -g "que-hacer|sucre-natural|Playas"
```

Ajustar nombres de archivos/tests a lo que implemente `/speckit-tasks`.

## Criterio de listo

- [ ] Home muestra temas desde Actividades (7 canónicos tras seed)
- [ ] Tres modos de listado verificados
- [ ] Redirect legado hub → `/que-hacer/{slug}`
- [ ] Asociación dual actividad ↔ destino
- [ ] Sin admin hubs obligatorio; sin copy «micrositio»
- [ ] Suites unit/integration/e2e relevantes en verde

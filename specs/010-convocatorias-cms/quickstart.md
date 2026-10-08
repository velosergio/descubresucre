# Quickstart: Convocatorias (CMS)

## Prerrequisitos

- `.env` / `.env.test` con `DATABASE_URL` / `TEST_DATABASE_URL`
- `npm run db:generate` + migración de esta feature aplicada (`npm run db:migrate` o `npm run test:db:prepare`)
- Admin (`npm run admin:create`)

## Carga inicial

No hay seed obligatorio: las cuatro convocatorias ficticias del mock **no** se migran a la base de datos (`research.md` §7). La sección debe mostrar estado vacío hasta que el staff cargue oportunidades reales.

## Admin

1. `npm run dev` → `/admin/personalizar/convocatorias`
2. Crear una convocatoria con título, descripción, audiencia, tipo, fecha límite futura y enlace `https://…`, publicada
3. Editar el enlace o la fecha límite → confirmar persistencia
4. Guardar sin título o con URL inválida (`javascript:…` o texto plano) → error en español, no se crea
5. Despublicar o eliminar → deja de aparecer en home
6. Crear una publicada con fecha límite ya pasada → aparece en admin, no en home

## Público

1. `http://localhost:3000/#convocatorias` (o scroll a la sección) → tarjetas de convocatorias publicadas vigentes
2. Cero vigentes → mensaje de estado vacío visible
3. "Más información" → abre el `externalUrl` en nueva pestaña
4. Convocatoria despublicada o vencida → no aparece

## Tests

```bash
npx vitest run src/lib/convocatoria-schema.test.ts src/lib/convocatoria-deadline.test.ts
node --env-file=.env.test ./node_modules/vitest/vitest.mjs run --maxWorkers=1 src/test/integration/convocatorias-admin.integration.test.ts
npx vitest run src/test/components/convocatorias-section.component.test.tsx src/test/components/convocatorias-admin.component.test.tsx
node --env-file=.env.test ./node_modules/@playwright/test/cli.js test e2e/critical-flows.spec.ts -g "convocatoria"
```

Ajustar nombres de archivos/tests a lo que implemente `/speckit-tasks`.

## Criterio de listo

- [ ] Array mock eliminado de `ConvocatoriasSection.tsx`; payload viene de BD
- [ ] Cero convocatorias definidas de forma fija en el código
- [ ] Estado vacío cuando no hay vigentes
- [ ] CRUD admin completo restringido a staff
- [ ] Enlace externo http/https obligatorio y accionable en home
- [ ] Publicadas vencidas / borradores no visibles en home
- [ ] Suites unit/integration/component/e2e relevantes en verde

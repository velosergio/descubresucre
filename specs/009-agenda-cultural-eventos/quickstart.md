# Quickstart: Eventos y Agenda Cultural

## Prerrequisitos

- `.env` / `.env.test` con `DATABASE_URL` / `TEST_DATABASE_URL`
- `npm run db:generate` + migración de esta feature aplicada (`npm run db:migrate` o `npm run test:db:prepare`)
- Admin (`npm run admin:create`)

## Carga inicial

No hay seed obligatorio: a diferencia de 007/008, los datos de ejemplo actuales (festivales/agenda ficticios) **no** se migran a la base de datos (research.md §10). El módulo debe mostrar su estado vacío hasta que el staff cargue eventos reales.

## Admin

1. `npm run dev` → `/admin/personalizar/eventos`
2. Crear un evento con título, fecha de inicio, lugar, categoría y descripción (imagen y coordenadas opcionales)
3. Crear un segundo evento de varios días (fecha de inicio + fecha de fin) en otro mes
4. Editar el primer evento y moverle la fecha a un mes distinto → confirmar que desaparece del mes original
5. Guardar sin título o sin fecha → error en español, el evento no se crea
6. Eliminar un evento → deja de aparecer en home

## Público

1. `http://localhost:3000/` → módulo "Próximos eventos / agenda cultural" con los eventos del mes actual
2. Mes sin eventos → mensaje de estado vacío, navegación sigue activa
3. Clic en "Siguiente"/"Anterior" → cambia el mes mostrado sin recarga completa de la página
4. Evento con imagen vs. sin imagen → ambos se muestran sin romper el layout
5. "Agregar a calendario" → Google Calendar (nueva pestaña, evento prellenado) y descarga `.ics` (importable en un calendario estándar)
6. Evento despublicado (`published=false`) → no aparece en home; `GET /api/cultural-events/{id}/ics` responde 404

## Tests

```bash
npx vitest run src/lib/month-range.test.ts src/lib/calendar-links.test.ts src/lib/ics.test.ts src/lib/cultural-event-schema.test.ts
node --env-file=.env.test ./node_modules/vitest/vitest.mjs run --maxWorkers=1 src/test/integration/cultural-events-admin.integration.test.ts src/test/integration/cultural-events-api.integration.test.ts
npx vitest run src/test/components/cultural-events-section.component.test.tsx src/test/components/cultural-events-admin.component.test.tsx
node --env-file=.env.test ./node_modules/@playwright/test/cli.js test e2e/critical-flows.spec.ts -g "eventos|agenda cultural|calendario"
```

Ajustar nombres de archivos/tests a lo que implemente `/speckit-tasks`.

## Criterio de listo

- [ ] `EventsSection.tsx` y `CulturalAgenda.tsx` eliminados; `HomePage.tsx` monta un solo `CulturalEventsSection`
- [ ] Cero eventos definidos de forma fija en el código
- [ ] Navegación por mes funcionando en ambas direcciones, con estado vacío
- [ ] CRUD admin completo (crear/editar/eliminar) restringido a staff
- [ ] "Agregar a calendario" genera un enlace de Google Calendar válido y un `.ics` descargable e importable
- [ ] Evento de varios días respeta el rango completo en la exportación
- [ ] Suites unit/integration/component/e2e relevantes en verde

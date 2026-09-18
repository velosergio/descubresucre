# Feature Specification: Eventos y Agenda Cultural (módulo unificado)

**Feature Branch**: `009-agenda-cultural-eventos`
**Created**: 2026-09-17
**Status**: Draft
**Input**: User description: "Fusionar EventsSection y CulturalAgenda en un solo módulo de próximos eventos / agenda cultural. Admin CRUD (fecha, lugar, categoría, imagen, descripción, coords opcionales). Home: listado por mes con navegación prev/next. Botón "Agregar a calendario" (Google Calendar y equivalente iOS/.ics). Quitar datos hardcodeados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver el módulo unificado con navegación por mes (Priority: P1)

Un visitante de la home quiere saber qué eventos y actividades culturales hay próximamente en el departamento. Hoy ve dos secciones separadas ("Próximos Eventos" y "Agenda Cultural") con datos de ejemplo fijos que nunca cambian. Con el módulo unificado, ve una sola sección con eventos reales, agrupados por mes, y puede moverse a meses anteriores o siguientes para explorar la agenda.

**Why this priority**: Es el valor central pedido: reemplazar dos secciones hardcodeadas y desalineadas por una sola fuente de verdad, navegable en el tiempo. Sin esto, el resto de la funcionalidad (CRUD, calendario) no tiene dónde mostrarse.

**Independent Test**: Con al menos un evento ya cargado (por ejemplo insertado directamente para la prueba), abrir la home y comprobar que aparece un único módulo con los eventos del mes actual, y que los controles "anterior"/"siguiente" cambian el mes mostrado sin recargar toda la página.

**Acceptance Scenarios**:

1. **Given** existen eventos publicados para el mes actual, **When** el visitante abre la home, **Then** ve un único módulo de "Próximos eventos / agenda cultural" con esos eventos agrupados bajo el mes actual.
2. **Given** el visitante está viendo el mes actual, **When** presiona "Siguiente", **Then** el módulo muestra los eventos publicados del mes siguiente.
3. **Given** el visitante está viendo un mes cualquiera, **When** presiona "Anterior", **Then** el módulo muestra los eventos publicados del mes previo.
4. **Given** un mes no tiene eventos publicados, **When** el visitante navega a ese mes, **Then** ve un mensaje claro de que no hay eventos ese mes, y los controles de navegación siguen disponibles para seguir explorando.

---

### User Story 2 - Administrar eventos desde un panel unificado (Priority: P2)

El personal autorizado (admin/editor) necesita poder publicar, corregir o retirar eventos reales sin depender de que alguien edite código. Hoy los "eventos" están escritos directamente en los componentes de la home. Con esta funcionalidad, el staff gestiona los eventos desde el panel de administración con los mismos campos que antes solo existían en el código: título, fecha, lugar, categoría, descripción, imagen y coordenadas.

**Why this priority**: Es la causa raíz de "quitar datos hardcodeados": sin un CRUD, cualquier cambio de contenido requeriría tocar código y desplegar. Depende de que exista el módulo (Historia 1) para que el resultado sea visible, pero el flujo de gestión en sí es independientemente verificable.

**Independent Test**: Con una sesión de staff (admin o editor), crear un evento nuevo con los campos requeridos, confirmar que se guarda, editarlo (incluyendo cambiar su fecha a otro mes) y luego eliminarlo, verificando en cada paso el reflejo correspondiente en la home.

**Acceptance Scenarios**:

1. **Given** el usuario tiene sesión de staff, **When** crea un evento con título, fecha, lugar, categoría y descripción (imagen y coordenadas son opcionales), **Then** el evento se guarda y aparece en la home bajo el mes correspondiente a su fecha.
2. **Given** existe un evento publicado, **When** el staff edita su fecha para moverlo a otro mes, **Then** el evento deja de aparecer en el mes original y pasa a mostrarse en el nuevo mes.
3. **Given** existe un evento publicado, **When** el staff lo elimina, **Then** el evento deja de mostrarse en la home.
4. **Given** el staff omite un campo obligatorio (por ejemplo título o fecha), **When** intenta guardar, **Then** el sistema rechaza el guardado y explica qué falta, sin crear un registro incompleto.
5. **Given** un usuario sin sesión de staff autorizada intenta crear, editar o eliminar un evento, **When** lo intenta, **Then** la operación se rechaza y ningún dato se modifica.

---

### User Story 3 - Agregar un evento al calendario personal (Priority: P3)

Un visitante interesado en un evento concreto quiere que le quede recordado en su propio calendario (Google Calendar en Android/web, o Calendario/.ics en iOS y otras apps). Hoy no existe ninguna forma de hacerlo; el usuario tendría que anotarlo manualmente.

**Why this priority**: Aporta valor adicional una vez el evento ya es visible (Historia 1) y viene de datos reales (Historia 2), pero el sitio sigue siendo útil sin esta acción — por eso va después en prioridad.

**Independent Test**: Con al menos un evento visible en la home, pulsar "Agregar a calendario" y verificar que se ofrece un enlace a Google Calendar y una descarga de archivo compatible con iOS/otros calendarios, ambos prellenados con los datos del evento.

**Acceptance Scenarios**:

1. **Given** un evento visible en la home, **When** el visitante pulsa "Agregar a calendario" y elige la opción de Google Calendar, **Then** se abre Google Calendar con un evento prellenado con el título, la fecha (u horario), el lugar y la descripción del evento.
2. **Given** un evento visible en la home, **When** el visitante pulsa "Agregar a calendario" y elige la opción para iOS/otros calendarios, **Then** se descarga un archivo de calendario válido con los mismos datos del evento, importable por una app de calendario estándar.
3. **Given** un evento que dura varios días (fecha de inicio y fin), **When** el visitante lo agrega al calendario, **Then** el evento exportado respeta el rango completo de fechas.

---

### Edge Cases

- Un evento cuya fecha de inicio y fin caen en meses distintos se lista bajo el mes de su fecha de inicio (no se duplica en ambos meses).
- Un evento sin imagen se muestra igualmente, con un tratamiento visual por defecto; la ausencia de imagen no bloquea su publicación.
- Dos o más eventos el mismo día se listan todos, ordenados por hora cuando la tengan y, si no, de forma consistente (por ejemplo por orden de creación).
- Un evento con fecha ya pasada se puede seguir editando o eliminando igual que cualquier otro; no hay un estado especial de "expirado" que restrinja la gestión.
- Un evento sin coordenadas se guarda y se muestra con normalidad; "Agregar a calendario" usa el texto del lugar aunque no haya coordenadas.
- Si el navegador del visitante bloquea la apertura de una nueva pestaña, la opción de Google Calendar sigue siendo alcanzable como un enlace normal (no depende de una ventana emergente disparada fuera de la interacción del usuario).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en la home un único módulo de "Próximos eventos / agenda cultural" que sustituye a las secciones separadas de "Eventos" y "Agenda Cultural" existentes.
- **FR-002**: El módulo MUST obtener su contenido de una fuente administrable por el staff; ningún evento MUST quedar definido de forma fija en el código fuente.
- **FR-003**: El módulo MUST agrupar los eventos por mes y ofrecer controles para navegar al mes anterior y al mes siguiente.
- **FR-004**: Al cargar la home, el sistema MUST mostrar por defecto los eventos del mes actual.
- **FR-005**: Cuando un mes no tiene eventos publicados, el sistema MUST mostrar un mensaje de estado vacío en lugar de una lista en blanco, sin deshabilitar la navegación.
- **FR-006**: El sistema MUST permitir al personal de staff autorizado crear, editar y eliminar eventos desde el panel de administración.
- **FR-007**: Cada evento MUST admitir como mínimo los campos título, fecha, lugar, categoría y descripción; imagen y coordenadas geográficas MUST ser campos opcionales.
- **FR-008**: El sistema MUST validar que los campos obligatorios de un evento estén completos antes de guardarlo, y MUST explicar el motivo cuando rechace el guardado.
- **FR-009**: El sistema MUST restringir la creación, edición y eliminación de eventos a usuarios con sesión de staff autorizada, rechazando cualquier intento sin esa autorización sin modificar datos.
- **FR-010**: Cada evento visible MUST ofrecer una acción "Agregar a calendario" con una opción para Google Calendar y otra para descargar un archivo compatible con calendarios tipo iOS.
- **FR-011**: La exportación a calendario (Google Calendar y archivo descargable) MUST incluir título, fecha(s) u horario, lugar y descripción del evento correspondiente.
- **FR-012**: Un evento MUST poder representar tanto una actividad de un solo día como una que abarca un rango de fechas (inicio y fin), para cubrir festivales y agendas de varios días.
- **FR-013**: Los cambios hechos por staff (crear, editar, eliminar) MUST reflejarse en la vista pública de la home sin requerir intervención manual adicional.
- **FR-014**: Al finalizar esta funcionalidad, el sistema MUST haber eliminado por completo cualquier dato de eventos o agenda cultural definido de forma fija en el código fuente.

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: El diseño MUST unificar "evento" y "agenda cultural" en una sola representación de datos, evitando mantener dos modelos paralelos con campos distintos como ocurre hoy entre `EventsSection` y `CulturalAgenda`.
- **NFR-002 (Security)**: Toda operación de creación, edición o eliminación de eventos MUST validar y sanear la entrada (fechas, texto, coordenadas, imagen) y MUST exigir autenticación y autorización de staff antes de aplicar cambios.
- **NFR-003 (Observability)**: Los errores al guardar un evento o al generar la exportación a calendario MUST registrarse con contexto suficiente (qué operación, qué evento, qué falló) para diagnóstico posterior.
- **NFR-004 (Performance)**: La navegación entre meses MUST percibirse como inmediata para el visitante (respuesta subsegundo bajo condiciones normales de red), sin recargar toda la página.
- **NFR-005 (Accessibility)**: Los controles de navegación por mes y la acción "Agregar a calendario" MUST ser operables por teclado y MUST exponer etiquetas semánticas claras para lectores de pantalla.

### Key Entities *(include if feature involves data)*

- **Evento (agenda cultural)**: actividad pública puntual o de varios días que reemplaza tanto a los "eventos" como a los ítems de "agenda cultural" actuales. Atributos: título, fecha de inicio, fecha de fin (opcional, para eventos de varios días), hora (opcional), lugar, categoría, descripción, imagen (opcional), coordenadas geográficas (opcionales), estado de publicación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante puede pasar del mes actual a cualquier mes anterior o siguiente en un solo clic por mes, sin recargar la página completa.
- **SC-002**: El 100% de los eventos mostrados en la home provienen de contenido administrado por staff; cero eventos quedan escritos de forma fija en el código tras el lanzamiento.
- **SC-003**: Un evento publicado por staff se refleja en la home en menos de 1 minuto desde que se guarda.
- **SC-004**: Al menos el 95% de los intentos de "Agregar a calendario" producen un resultado válido (Google Calendar se abre prellenado, o el archivo descargado se importa sin errores en una app de calendario estándar).
- **SC-005**: El 100% de los controles de navegación mensual y la acción "Agregar a calendario" son operables completamente por teclado.
- **SC-006**: Cero modificaciones de datos ocurren a partir de intentos de gestión de eventos sin sesión de staff autorizada.

## Assumptions

- La categoría es un campo de etiqueta simple por evento (no un catálogo administrable independiente ni una relación muchos-a-muchos); esta versión no incluye filtrar la home por categoría.
- Un evento tiene fecha de inicio obligatoria, fecha de fin opcional (para actividades de varios días) y hora opcional; cuando no se especifica hora, el evento se trata como "todo el día" tanto en la vista pública como en la exportación a calendario.
- Un evento que abarca dos meses se muestra únicamente en el listado del mes de su fecha de inicio.
- Las coordenadas opcionales se capturan pensando en un uso futuro (por ejemplo, integrarlas al mapa interactivo del sitio) y, cuando existen, pueden enriquecer la información de lugar en la exportación a calendario; no son obligatorias para publicar un evento.
- Solo los eventos marcados como publicados por staff son visibles y exportables al calendario; los eventos en borrador no aparecen en la home.
- La navegación mensual permite moverse tanto a meses futuros como a meses pasados, sirviendo también como agenda histórica.
- "Agregar a calendario" es una acción pública que no requiere que el visitante inicie sesión; se construye a partir de los datos ya visibles del evento.
- Esta versión no incluye eventos recurrentes (series); cada ocurrencia (por ejemplo cada edición anual de un festival) se administra como un evento independiente.
- Los datos de ejemplo actuales (festivales y agenda ficticios hoy fijos en el código) no se migran a la base de datos; el staff cargará eventos reales después del lanzamiento.
- La gestión de eventos reutiliza los roles de staff (admin/editor) ya existentes en el sitio, sin introducir nuevos roles o permisos.

# Feature Specification: Convocatorias (CMS)

**Feature Branch**: `010-convocatorias-cms`
**Created**: 2026-10-07
**Status**: Draft
**Input**: User description: "Convertir ConvocatoriasSection en CMS: CRUD admin (título, descripción, audiencia, tipo, fecha límite, enlace externo obligatorio). Home consume la BD; sin mock."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver convocatorias reales en la home (Priority: P1)

Un visitante de la home quiere conocer oportunidades culturales y turísticas abiertas en el departamento (becas, festivales, formación, emprendimiento, etc.). Hoy ve cuatro tarjetas de ejemplo fijas en el código, sin enlace real a más información. Con esta funcionalidad, ve únicamente convocatorias publicadas por el personal, con fecha límite, audiencia, tipo y un enlace externo claro para postularse o informarse.

**Why this priority**: Es el valor central del pedido: reemplazar el mock por contenido real y accionable. Sin la vista pública alimentada por datos administrados, el CRUD no tiene impacto para el visitante.

**Independent Test**: Con al menos una convocatoria publicada (cargada para la prueba), abrir la home, ir a la sección Convocatorias y comprobar que aparece esa convocatoria con título, descripción, audiencia, tipo, fecha límite y acción hacia el enlace externo; y que ya no aparecen las tarjetas de ejemplo hardcodeadas.

**Acceptance Scenarios**:

1. **Given** existen convocatorias publicadas con fecha límite vigente, **When** el visitante abre la home, **Then** ve la sección Convocatorias con esas oportunidades (sin datos de ejemplo fijos en el código).
2. **Given** una convocatoria publicada visible, **When** el visitante activa "Más información" (o equivalente), **Then** se dirige al enlace externo configurado por el staff (nueva pestaña o destino externo claro).
3. **Given** no hay convocatorias publicadas con fecha límite vigente, **When** el visitante abre la home, **Then** ve un mensaje de estado vacío comprensible (por ejemplo, que no hay oportunidades abiertas en este momento), no una lista inventada ni tarjetas rotas.
4. **Given** una convocatoria publicada cuya fecha límite ya pasó, **When** el visitante abre la home, **Then** esa convocatoria no aparece en la sección pública de oportunidades abiertas.

---

### User Story 2 - Administrar convocatorias desde el panel (Priority: P2)

El personal autorizado (admin o editor) necesita publicar, corregir o retirar convocatorias reales sin editar código ni redesplegar. Hoy el contenido solo existe como datos fijos en la sección de la home. Con esta funcionalidad, el staff gestiona convocatorias desde el panel de administración con título, descripción, audiencia, tipo, fecha límite y enlace externo obligatorio.

**Why this priority**: Es la causa raíz de "sin mock": sin CRUD, cualquier cambio de oportunidad requiere tocar código. Depende de la Historia 1 para ser visible al público, pero el flujo de gestión es verificable por sí solo.

**Independent Test**: Con sesión de staff, crear una convocatoria con todos los campos obligatorios, verificar que aparece en la home si está publicada y vigente; editarla (por ejemplo cambiar el enlace o la fecha límite); eliminarla o despublicarla y confirmar que deja de mostrarse públicamente.

**Acceptance Scenarios**:

1. **Given** el usuario tiene sesión de staff, **When** crea una convocatoria con título, descripción, audiencia, tipo, fecha límite y enlace externo válido, y la marca como publicada, **Then** se guarda y, si la fecha límite está vigente, aparece en la home.
2. **Given** existe una convocatoria, **When** el staff edita cualquiera de sus campos (incluido el enlace externo o la fecha límite), **Then** los cambios se persisten y se reflejan en la vista pública según las reglas de visibilidad.
3. **Given** existe una convocatoria, **When** el staff la elimina o la deja de publicar, **Then** deja de mostrarse en la home.
4. **Given** el staff omite un campo obligatorio o proporciona un enlace externo inválido, **When** intenta guardar, **Then** el sistema rechaza el guardado, explica qué falta o qué está mal, y no crea ni deja un registro incompleto o con URL inválida.
5. **Given** un usuario sin sesión de staff autorizada intenta crear, editar o eliminar una convocatoria, **When** lo intenta, **Then** la operación se rechaza y ningún dato se modifica.

---

### Edge Cases

- Una convocatoria cuya fecha límite es hoy se considera aún vigente y puede mostrarse en la home ese día.
- Una convocatoria en borrador (no publicada) nunca aparece en la home, aunque su fecha límite sea futura.
- Dos o más convocatorias con la misma fecha límite se listan todas, en un orden estable (por ejemplo, más próximas primero y, a igualdad, por orden de creación o título).
- Un enlace externo debe ser una URL absoluta válida (http/https); esquemas peligrosos o texto que no sea URL se rechazan al guardar.
- Si el staff guarda una convocatoria publicada con fecha límite ya pasada, se guarda en el panel pero no se muestra en la home como oportunidad abierta.
- La ausencia de convocatorias vigentes no oculta la sección de forma silenciosa: el visitante recibe un estado vacío explícito.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en la home una sección de Convocatorias cuyo contenido provenga de una fuente administrable por el staff.
- **FR-002**: Ninguna convocatoria MUST quedar definida de forma fija en el código fuente tras el lanzamiento de esta funcionalidad.
- **FR-003**: Cada convocatoria MUST incluir como mínimo: título, descripción, audiencia, tipo, fecha límite y enlace externo.
- **FR-004**: El enlace externo MUST ser obligatorio y MUST ser una URL válida (http o https) apuntando a información o inscripción fuera del sitio.
- **FR-005**: El sistema MUST permitir al personal de staff autorizado crear, editar y eliminar convocatorias desde el panel de administración.
- **FR-006**: El sistema MUST validar los campos obligatorios y el formato del enlace externo antes de guardar, y MUST explicar el motivo cuando rechace el guardado.
- **FR-007**: El sistema MUST restringir la creación, edición y eliminación de convocatorias a usuarios con sesión de staff autorizada, rechazando cualquier intento sin esa autorización sin modificar datos.
- **FR-008**: Solo las convocatorias publicadas cuya fecha límite esté vigente (hoy o en el futuro) MUST ser visibles en la sección pública de la home.
- **FR-009**: Cada convocatoria visible en la home MUST ofrecer una acción clara (por ejemplo "Más información") que lleve al enlace externo configurado.
- **FR-010**: Cuando no haya convocatorias publicadas vigentes, la home MUST mostrar un estado vacío comprensible en lugar de inventar contenido o dejar la sección en blanco sin explicación.
- **FR-011**: Los cambios hechos por staff (crear, editar, eliminar o cambiar publicación) MUST reflejarse en la vista pública sin intervención manual adicional.
- **FR-012**: El tipo de convocatoria MUST ser una etiqueta simple editable por el staff (por ejemplo Arte, Turismo, Formación, Música u otra que necesiten), no un catálogo administrable independiente en esta versión.
- **FR-013**: Al finalizar esta funcionalidad, el sistema MUST haber eliminado por completo cualquier dato de convocatorias definido de forma fija en el código fuente.

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: La solución MUST reutilizar el mismo patrón de gestión de contenido del resto del CMS del sitio (panel de personalización, roles de staff existentes), evitando un flujo de publicación paralelo o inconsistente.
- **NFR-002 (Security)**: Toda operación de creación, edición o eliminación MUST validar y sanear la entrada (textos, fecha límite, URL) y MUST exigir autenticación y autorización de staff antes de aplicar cambios. Las URLs MUST limitarse a esquemas seguros (http/https).
- **NFR-003 (Observability)**: Los errores al guardar o eliminar una convocatoria MUST registrarse con contexto suficiente (qué operación, qué registro, qué falló) para diagnóstico posterior.
- **NFR-004 (Performance)**: La sección de convocatorias en la home MUST cargar junto con el resto de la página bajo condiciones normales de red, sin degradar de forma perceptible la experiencia del visitante respecto al resto de secciones CMS ya existentes.
- **NFR-005 (Accessibility)**: Las tarjetas y la acción hacia el enlace externo MUST ser operables por teclado y MUST exponer etiquetas semánticas claras (incluido el hecho de que el enlace abre un destino externo cuando aplique).

### Key Entities *(include if feature involves data)*

- **Convocatoria**: oportunidad pública cultural o turística (beca, festival, formación, emprendimiento, etc.) administrada por staff. Atributos: título, descripción, audiencia, tipo (etiqueta), fecha límite, enlace externo (URL), estado de publicación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las convocatorias mostradas en la home provienen de contenido administrado por staff; cero convocatorias quedan escritas de forma fija en el código tras el lanzamiento.
- **SC-002**: Una convocatoria publicada y vigente se refleja en la home en menos de 1 minuto desde que el staff la guarda.
- **SC-003**: El 100% de las convocatorias visibles en la home tienen un enlace externo accionable; ningún visitante se queda sin destino al activar "Más información".
- **SC-004**: Cero modificaciones de datos ocurren a partir de intentos de gestión de convocatorias sin sesión de staff autorizada.
- **SC-005**: El 100% de las acciones principales de la sección (lectura de tarjetas y apertura del enlace externo) son operables completamente por teclado.
- **SC-006**: Ante cero convocatorias vigentes, el visitante entiende en menos de 5 segundos que no hay oportunidades abiertas (mensaje de estado vacío visible sin contenido inventado).

## Assumptions

- La gestión de convocatorias reutiliza los roles de staff (admin/editor) ya existentes en el sitio, sin introducir nuevos roles o permisos.
- El "tipo" es una etiqueta de texto libre corta (como en el mock actual: Arte, Turismo, Formación, Música); esta versión no incluye un catálogo CRUD de tipos ni filtros por tipo en la home.
- Solo las convocatorias marcadas como publicadas y con fecha límite vigente aparecen en la home; las vencidas y los borradores permanecen gestionables en el panel.
- La fecha límite es una fecha (día calendario); no se exige hora de cierre en esta versión.
- El enlace externo es el único destino de "Más información"; esta versión no incluye página de detalle interna por convocatoria.
- Los datos de ejemplo actuales (cuatro convocatorias ficticias en el código) no se migran a la base de datos; el staff cargará oportunidades reales después del lanzamiento.
- El orden público por defecto prioriza la fecha límite más cercana primero.
- Fuera de alcance en esta versión: inscripciones dentro del sitio, adjuntos, notificaciones, integración con el chatbot/RAG, y filtrado público por tipo o audiencia.

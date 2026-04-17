# Feature Specification: Altas y aprobación de cuentas staff

**Feature Branch**: `[002-altas-y-aprobacion-staff]`  
**Created**: 2026-04-16  
**Status**: Draft  
**Input**: User description: "Especificar el flujo de registro público, estados de cuenta (pendiente, aprobado, rechazado), moderación por administrador y acceso al panel según rol y estado de aprobación, alineado con Sucre Vivo / Descubre Sucre."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrarse y quedar en revisión (Priority: P1)

Una persona interesada en colaborar con el sitio completa el formulario de registro público con datos mínimos solicitados. El sistema crea su cuenta en estado **pendiente de aprobación** y le comunica que debe esperar una decisión antes de usar el panel de gestión.

**Why this priority**: Sin este flujo no hay captación controlada de personal; es la entrada al modelo de confianza del producto.

**Independent Test**: Registro con datos válidos y comprobación de que el usuario entiende que su acceso no es inmediato y no puede operar como staff hasta ser aprobado.

**Acceptance Scenarios**:

1. **Given** un correo no registrado y datos válidos, **When** envía el registro, **Then** el sistema confirma la recepción y la cuenta queda pendiente de aprobación.
2. **Given** un correo ya existente, **When** intenta registrarse de nuevo, **Then** el sistema rechaza la duplicación con mensaje claro.
3. **Given** datos inválidos (formato de correo, contraseña demasiado corta, etc.), **When** envía el formulario, **Then** el sistema muestra el error específico sin crear cuenta.

---

### User Story 2 - Esperar decisión, ser aprobado o rechazado (Priority: P2)

Tras iniciar sesión, el postulante cuya cuenta está pendiente ve una pantalla dedicada que explica la situación y ofrece salir de la sesión o volver al sitio público. Si un administrador aprueba la cuenta, en el siguiente acceso puede entrar al panel (si tiene rol adecuado). Si es rechazada, ve un mensaje de acceso no autorizado y una vía para contacto humano descrita en el producto.

**Why this priority**: Cierra el ciclo emocional y operativo del postulante y evita confusiones sobre por qué no ve el panel.

**Independent Test**: Con sesión activa, transiciones entre estados pendiente, aprobado y rechazado y comprobación de redirecciones coherentes sin exponer información interna.

**Acceptance Scenarios**:

1. **Given** cuenta pendiente y sesión iniciada, **When** el usuario intenta acceder al área de personal, **Then** es dirigido a la experiencia de “cuenta en revisión” y no al panel operativo.
2. **Given** cuenta recién aprobada y rol de personal asignado, **When** inicia sesión, **Then** accede al panel de gestión sin pasos adicionales arbitrarios.
3. **Given** cuenta rechazada y sesión iniciada, **When** navega, **Then** ve mensaje claro de no autorización y opciones para cerrar sesión o volver al sitio público, sin acceso al panel.

---

### User Story 3 - Administrar solicitudes y cuentas (Priority: P3)

Un administrador del sitio ve la lista de usuarios con filtros por estado de cuenta, puede aprobar o rechazar solicitudes pendientes y puede crear o editar usuarios de personal con roles y estado acordes a la política del proyecto. Las acciones sensibles quedan restringidas a administradores aprobados.

**Why this priority**: Habilita la gobernanza real del acceso; sin moderación el registro abierto sería un riesgo.

**Independent Test**: Flujo de aprobación/rechazo desde el panel y verificación de que el estado en base de conocimiento del usuario coincide con lo esperado en el siguiente inicio de sesión del afectado.

**Acceptance Scenarios**:

1. **Given** un usuario pendiente, **When** el administrador aprueba la cuenta, **Then** el estado pasa a aprobado y el usuario puede acceder al panel cuando corresponda por su rol.
2. **Given** un usuario pendiente, **When** el administrador rechaza la cuenta, **Then** el estado pasa a rechazado y el usuario no puede usar el panel de personal.
3. **Given** un usuario sin rol de administrador, **When** intenta acceder a la gestión de usuarios o aprobar solicitudes, **Then** el acceso es denegado.
4. **Given** un administrador cuya propia cuenta no está aprobada, **When** intenta ejecutar acciones administrativas privilegiadas, **Then** el sistema las deniega hasta que su cuenta esté aprobada.

---

### Edge Cases

- Registro cuando el sitio no tiene configurado el rol base necesario para nuevos colaboradores: el usuario recibe mensaje operativo y no queda en estado inconsistente.
- Usuario con sesión pero sin ningún rol de personal (no colaborador): no debe acceder al panel aunque la cuenta esté aprobada.
- Usuario creado manualmente por administrador: puede nacer ya aprobado según política de producto; debe quedar documentado en supuestos.
- Cambio de estado de aprobado a rechazado (o viceversa) por corrección administrativa: la siguiente sesión o navegación debe reflejar el nuevo estado.
- Intento de acceso al panel con credenciales válidas pero cuenta pendiente o rechazada: nunca debe mostrar datos internos del panel.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir registro público con validación de correo electrónico y contraseña según reglas de complejidad mínimas definidas por el producto.
- **FR-002**: El sistema MUST crear cuentas nuevas de colaboradores en estado pendiente de aprobación salvo cuando una política explícita de creación manual indique lo contrario.
- **FR-003**: El sistema MUST impedir registros duplicados para el mismo correo electrónico.
- **FR-004**: El sistema MUST asignar a los nuevos registros públicos por defecto un rol de colaborador acorde a la política del sitio (p. ej. editor), sin otorgar privilegios de administración automáticamente.
- **FR-005**: El sistema MUST distinguir al menos tres estados de cuenta: pendiente, aprobado y rechazado, con transiciones controladas por personal autorizado o por reglas de creación.
- **FR-006**: El sistema MUST impedir el uso del panel de gestión a cuentas pendientes o rechazadas, mostrando en su lugar la experiencia de estado adecuada.
- **FR-007**: El sistema MUST permitir iniciar sesión a cuentas aprobadas que posean un rol de personal, y MUST redirigir al panel tras autenticación cuando corresponda.
- **FR-008**: Los administradores aprobados MUST poder listar usuarios, filtrar por estado de cuenta y aprobar o rechazar solicitudes pendientes.
- **FR-009**: Los administradores aprobados MUST poder crear usuarios de personal con contraseña inicial y, si aplica, dejarlos aprobados por defecto para agilizar incorporaciones internas.
- **FR-010**: Los administradores aprobados MUST poder editar datos básicos del usuario, roles asignados y estado de cuenta de forma coherente con la política de seguridad.
- **FR-011**: El sistema MUST exigir que la cuenta del administrador que ejecuta acciones privilegiadas esté en estado aprobado.
- **FR-012**: El sistema MUST evitar filtrar en mensajes de error detalles internos (trazas, identificadores de infraestructura) a usuarios finales.

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: La política de estados y roles MUST documentarse de forma que los flujos de soporte (p. ej. “cuenta bloqueada”) sean explicables sin conocer la implementación.
- **NFR-002 (Security)**: Credenciales MUST almacenarse de forma no reversible; intentos de acceso al panel MUST validarse siempre contra estado de cuenta y rol; acciones administrativas MUST estar acotadas a administradores autenticados y aprobados.
- **NFR-003 (Observability)**: Eventos críticos (aprobación, rechazo, creación manual de usuario) SHOULD dejarse trazabilidad para auditoría (quién, cuándo, sobre qué cuenta).
- **NFR-004 (Performance)**: Las pantallas de listado de usuarios para administración SHOULD permanecer usables con volumenes razonables de cuentas para la primera fase del producto (ordenación o paginación si el volumen lo exige).
- **NFR-005 (Accessibility)**: Formularios de registro e inicio de sesión y pantallas de estado de cuenta MUST ser completables con teclado y legibles con tecnologías de asistencia en los caminos principales.

### Key Entities *(include if feature involves data)*

- **Cuenta de usuario**: Identificador principal, correo, nombre opcional, credencial de acceso, estado de aprobación.
- **Rol de personal**: Etiqueta de permiso (p. ej. administrador, editor) asociada a usuarios; define si puede operar el panel y con qué alcance.
- **Estado de cuenta**: Pendiente, aprobado o rechazado; controla si el panel de gestión está permitido independientemente de la validez de la sesión.
- **Sesión autenticada**: Vínculo temporal entre el navegador y la cuenta; debe respetarse el estado de cuenta en cada solicitud protegida.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En pruebas de recorrido completas, el 100% de los registros válidos concluyen con confirmación al usuario y estado pendiente visible en el siguiente inicio de sesión.
- **SC-002**: El 100% de los intentos de acceso al panel con cuenta pendiente o rechazada terminan en la experiencia de estado adecuada, sin vista previa de datos del panel.
- **SC-003**: Tras una acción de aprobación por administrador, el tiempo hasta que el usuario aprobado puede completar el acceso al panel en un nuevo inicio de sesión es inferior a un minuto en condiciones normales de servicio (sin depender de notificaciones externas obligatorias).
- **SC-004**: El 100% de las acciones de aprobación, rechazo o creación manual quedan registradas de forma que un administrador pueda reconstruir el último estado de una cuenta en caso de disputa.
- **SC-005**: En encuestas internas o pruebas de usabilidad con al menos cinco personas representativas, al menos el 80% califica como “claro” el mensaje de cuenta pendiente o rechazada.

## Assumptions

- El primer administrador del despliegue se crea por procedimiento operativo fuera del registro público (p. ej. script o consola), para evitar el círculo sin moderador.
- El registro público está destinado a futuros colaboradores con rol de editor u homólogo; no se confunde con visitantes del sitio turístico que no requieren cuenta.
- No se exige notificación por correo electrónico automática al aprobar o rechazar en esta versión de especificación; el usuario descubre el cambio al iniciar sesión (salvo que el producto decida añadir notificaciones en una iteración posterior).
- La recuperación de contraseña y el inicio de sesión con proveedores externos, si existen, siguen las mismas reglas de estado de cuenta y rol que el acceso por correo y contraseña.
- Los administradores pueden crear o eliminar usuarios según política de retención; la eliminación de cuentas y efectos legales (datos personales) pueden tratarse en una especificación de privacidad aparte.

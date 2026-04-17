# Feature Specification: Asistente conversacional de turismo (chatbot)

**Feature Branch**: `[001-chatbot-turismo]`  
**Created**: 2026-04-16  
**Status**: Draft  
**Input**: User description: "Análisis del proyecto Descubre Sucre / Sucre Vivo: especificar el chatbot de turismo ya integrado en la experiencia web (asistente para visitantes, orquestación asíncrona de respuestas, configuración por administrador y contrato seguro con el proveedor de automatización)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar turismo por chat (Priority: P1)

Un visitante abre el asistente desde la página de inicio, escribe una pregunta sobre destinos, actividades o información práctica del departamento de Sucre y recibe una respuesta del asistente dentro del mismo hilo de conversación, con indicación clara cuando el sistema está procesando la solicitud.

**Why this priority**: Es el resultado principal del producto: orientar al turista sin fricción y mantener el foco en el territorio cubierto por el sitio.

**Independent Test**: Puede validarse enviando mensajes de prueba representativos y comprobando que el usuario ve su mensaje, el estado de carga y una respuesta del asistente o un mensaje de fallo comprensible.

**Acceptance Scenarios**:

1. **Given** el visitante tiene el panel de chat abierto, **When** envía un mensaje de texto válido, **Then** el mensaje aparece en el hilo y el sistema muestra que está procesando hasta obtener resultado o error claro.
2. **Given** el visitante ya envió mensajes en la sesión, **When** continúa la conversación, **Then** el contexto reciente se mantiene de forma coherente para la interacción (sin exigir repetir información innecesaria).
3. **Given** el visitante intenta enviar un mensaje vacío o solo espacios, **When** confirma el envío, **Then** no se crea un envío inválido y la interfaz no queda en un estado bloqueado.

---

### User Story 2 - Configurar el conector del asistente (Priority: P2)

Un administrador autorizado accede a la sección de configuración del asistente, introduce o actualiza la URL del punto de entrada que usará el sistema para solicitar respuestas al motor de automatización y guarda los cambios. Tras guardar, el sistema debe poder aceptar consultas de visitantes cuando el resto de requisitos operativos estén cumplidos.

**Why this priority**: Sin configuración operativa del conector, el visitante no puede obtener respuestas reales; es el habilitador técnico-administrativo del servicio.

**Independent Test**: Puede validarse con un usuario administrador guardando un valor de URL y comprobando que una solicitud de chat deja de responder con “no configurado” cuando la URL es válida en entorno de pruebas.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado con permisos adecuados, **When** guarda una URL de conector válida según las reglas del formulario, **Then** el sistema persiste el valor y confirma el guardado al usuario.
2. **Given** la URL del conector no está definida o es inválida según validación del formulario, **When** el administrador intenta guardar, **Then** el sistema impide un guardado incorrecto y comunica qué falta o qué corregir.
3. **Given** un usuario sin permisos de administración, **When** intenta acceder a la configuración del asistente, **Then** el acceso es denegado de forma acorde a la política de roles del producto.

---

### User Story 3 - Recuperarse ante fallos y límites (Priority: P3)

Si el servicio de respuestas no está disponible, tarda demasiado o rechaza la solicitud, el visitante ve un mensaje en lenguaje claro (sin detalles internos) y puede reintentar sin perder la sensación de control. Si el mensaje excede límites razonables de tamaño, el sistema lo rechaza de forma explícita.

**Why this priority**: Protege la confianza del usuario y reduce frustración cuando hay incidencias de red o del proveedor externo.

**Independent Test**: Puede validarse simulando indisponibilidad del conector, tiempos de espera prolongados y cargas de mensajes demasiado largas, verificando mensajes de error y posibilidad de nuevo intento.

**Acceptance Scenarios**:

1. **Given** el conector del asistente no está configurado o el entorno servidor no tiene el secreto de callback requerido, **When** un visitante envía un mensaje, **Then** recibe una indicación orientativa para contactar con soporte o administración (sin exponer secretos ni rutas internas).
2. **Given** el procesamiento supera el tiempo máximo aceptable definido para la experiencia, **When** el visitante espera el resultado, **Then** ve un fallo comprensible y puede volver a intentar.
3. **Given** el visitante pega un texto que supera el límite permitido por mensaje, **When** intenta enviarlo, **Then** el sistema rechaza la solicitud con mensaje claro y sin corromper el hilo previo.

---

### Edge Cases

- Conector del asistente devuelve error HTTP o no responde a tiempo: el trabajo asociado queda en estado de error y el visitante ve mensaje usable.
- Respuesta vacía desde el proveedor: no se marca como éxito; el visitante recibe feedback de fallo.
- Llegada tardía o duplicada de una confirmación para el mismo trabajo: el estado final no debe dejar al usuario en un bucle infinito de espera.
- Múltiples mensajes seguidos del visitante: la interfaz evita condiciones de carrera que mezclen respuestas desordenadas de forma confusa.
- Accesibilidad: el panel de chat debe ser usable con teclado y lectores de pantalla en los flujos principales (abrir, escribir, enviar, leer respuestas).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir a cualquier visitante de la página web abrir un panel de chat desde la experiencia principal del sitio sin obligar a crear cuenta para consultar.
- **FR-002**: El sistema MUST aceptar mensajes del visitante con rol de usuario y del asistente, y construir el historial enviado al procesamiento según las reglas de tamaño y cantidad definidas.
- **FR-003**: El sistema MUST generar un identificador de sesión de chat por visita (o equivalente) para correlacionar solicitudes mientras el visitante usa el sitio en ese navegador, sin exigir cuenta de usuario.
- **FR-004**: El sistema MUST crear un trabajo de procesamiento por solicitud aceptada y exponer un identificador de trabajo al cliente para consultar el estado hasta completarse o fallar.
- **FR-005**: El sistema MUST reenviar al conector configurado un paquete mínimo que incluya el identificador de trabajo, el historial de mensajes, un identificador de sesión de chat y una URL de devolución firmada con secreto compartido para recibir la respuesta final.
- **FR-006**: El sistema MUST validar la autenticidad de las devoluciones del proveedor mediante el secreto compartido antes de aceptar respuesta o error definitivos.
- **FR-007**: El sistema MUST permitir al visitante consultar el estado del trabajo hasta obtener respuesta del asistente, error registrado o tiempo máximo de espera alcanzado.
- **FR-008**: El sistema MUST persistir el resultado del trabajo (respuesta del asistente o mensaje de error operativo) de forma que pueda recuperarse de manera consistente durante el seguimiento.
- **FR-009**: Los administradores autorizados MUST poder leer y actualizar la URL del conector del asistente almacenada de forma centralizada.
- **FR-010**: El sistema MUST rechazar entradas inválidas (JSON mal formado, roles de mensaje no permitidos, límites de longitud o recuento) con respuestas de error comprensibles para el cliente.
- **FR-011**: El sistema MUST evitar filtrar detalles internos (trazas, secretos, nombres de infraestructura) en mensajes mostrados al visitante.

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: La solución MUST documentar el contrato funcional entre la aplicación, el conector del asistente y la devolución segura (campos obligatorios, códigos de error esperados) sin acoplar la especificación a un proveedor concreto en los criterios de éxito del negocio.
- **NFR-002 (Security)**: El sistema MUST validar y acotar todas las entradas externas (cuerpo de solicitud, cabeceras de devolución, identificadores) y MUST exigir autenticación y autorización explícitas para la configuración administrativa del asistente.
- **NFR-003 (Observability)**: El sistema MUST registrar eventos accionables para creación de trabajos, fallos de conexión con el conector, rechazos de devolución y estados terminales, con correlación por identificador de trabajo.
- **NFR-004 (Performance)**: La experiencia MUST definir un tiempo máximo de espera del lado del visitante acorde a interacción conversacional; las solicitudes al conector MUST tener tiempo máximo de espera acotado para no bloquear recursos indefinidamente.
- **NFR-005 (Accessibility)**: El panel de chat MUST permitir uso básico con teclado, foco visible y etiquetas comprensibles para tecnologías de asistencia en envío y lectura de mensajes.

### Key Entities *(include if feature involves data)*

- **Configuración del asistente**: Registro único de parámetros operativos (p. ej. URL del conector), actualizable solo por personal autorizado.
- **Trabajo de conversación**: Unidad de procesamiento con estado (pendiente, completado, error), texto de respuesta del asistente o mensaje de error, marcas de tiempo para auditoría y diagnóstico.
- **Mensaje de conversación**: Rol (visitante o asistente), contenido de texto acotado, orden dentro del historial enviado al procesamiento.
- **Sesión de chat (cliente)**: Identificador opaco generado en el navegador para agrupar interacciones de una misma visita sin sustituir la autenticación de usuario cuando exista.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En condiciones operativas normales (conector configurado y proveedor disponible), al menos el 90% de las solicitudes de chat completadas muestran una respuesta del asistente en pantalla en menos de 60 segundos desde el envío.
- **SC-002**: En escenarios de fallo (conector no configurado, indisponibilidad o rechazo), el 100% de los visitantes afectados ven un mensaje comprensible sin datos sensibles del sistema y pueden intentar de nuevo cuando aplique.
- **SC-003**: El 100% de los intentos de guardado de configuración por administradores autorizados con datos válidos concluyen con confirmación explícita; los datos inválidos son rechazados con indicación de corrección.
- **SC-004**: En pruebas de accesibilidad básicas del panel de chat, el 100% de los pasos críticos (abrir, escribir, enviar, revisar respuesta) son realizables solo con teclado y anunciados de forma coherente.
- **SC-005**: Menos del 5% de sesiones de chat abandonan por “espera infinita” (sin estado terminal en el tiempo máximo definido) en pruebas de carga moderada equivalentes al tráfico esperado de la primera versión regional.

## Assumptions

- El contenido del asistente se alinea con el alcance geográfico y temático del sitio (turismo en Sucre, con foco inicial en los municipios ya cubiertos por el producto).
- El visitante dispone de conexión a internet razonable; la experiencia degrada con mensajes claros ante problemas de red.
- La organización dispone de un entorno de automatización externo compatible con el contrato de solicitud y devolución descrito; la especificación no impone un proveedor concreto.
- Los secretos compartidos para la devolución viven solo en configuración de servidor segura, no en el navegador.
- No se incluye en esta versión de especificación almacenamiento a largo plazo del historial de chat por usuario salvo lo necesario para completar el trabajo en curso, salvo decisión de producto futura.

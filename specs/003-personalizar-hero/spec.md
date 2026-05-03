# Feature Specification: Personalizar banner del hero

**Feature Branch**: `[003-personalizar-hero]`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: Panel admin «Personalizar» extensible; subruta `personalizar/banner`; fondo del hero con imagen por defecto (actual), imagen subida, vídeo (subida MP4/WebM y URL HTTPS externa), o carrusel de imágenes; solo administradores.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante ve el banner configurado (Priority: P1)

Un visitante abre la página de inicio y el área hero muestra el modo de fondo activo: imagen por defecto del sitio, imagen personalizada, vídeo en bucle silenciado, o carrusel de imágenes con navegación coherente. El contenido (titular, chat, CTAs) permanece legible sobre el fondo.

**Why this priority**: Es la entrega visible del producto; sin esto la feature no aporta valor.

**Independent Test**: Tras fijar un modo en administración, cargar la home en ventana privada y comprobar el medio correcto sin errores de consola críticos.

**Acceptance Scenarios**:

1. **Given** el modo es imagen por defecto, **When** se carga la home, **Then** se muestra la imagen estática incorporada en el proyecto (equivalente actual a `hero-sucre.jpg`).
2. **Given** el modo es imagen personalizada con URL almacenada, **When** se carga la home, **Then** se muestra esa imagen a pantalla completa con overlay existente.
3. **Given** el modo es vídeo con fuente válida (archivo servido o URL directa), **When** se carga la home, **Then** el vídeo se reproduce en bucle, silenciado y sin controles intrusivos; si falla el recurso, **Then** se muestra la imagen por defecto como respaldo.
4. **Given** el modo es carrusel con al menos dos imágenes válidas, **When** se carga la home, **Then** el visitante puede avanzar o el carrusel avanza automáticamente según diseño implementado y todas las slides son visibles.

---

### User Story 2 - Administrador configura el banner (Priority: P2)

Un administrador autenticado entra a Personalizar → Banner principal, elige modo (defecto / imagen / vídeo / carrusel), sube archivos permitidos o introduce URL de vídeo externa, gestiona slides del carrusel y guarda. Los cambios se reflejan en la home tras guardar.

**Why this priority**: Habilita el control editorial sin desplegar código.

**Independent Test**: Con usuario admin, completar el flujo de guardado y verificar persistencia recargando la página de configuración y la home.

**Acceptance Scenarios**:

1. **Given** un administrador con sesión válida, **When** guarda un modo con datos válidos para ese modo, **Then** los valores persisten y aparece confirmación.
2. **Given** un administrador intenta guardar datos incompletos (p. ej. carrusel con menos de dos imágenes o vídeo sin URL), **When** confirma guardar, **Then** el sistema rechaza con mensaje claro.
3. **Given** un usuario sin rol administrador, **When** intenta abrir la sección Personalizar o sus acciones de guardado/subida, **Then** el acceso es denegado acorde a la política del panel.

---

### User Story 3 - Subidas seguras y límites (Priority: P3)

Las subidas aceptan solo tipos MIME permitidos (imagen: jpeg/png/webp; vídeo: mp4/webm) y tamaño máximo acotado. Las URLs externas de vídeo solo HTTPS (salvo reglas explícitas de desarrollo local documentadas).

**Why this priority**: Reduce abuso y fallos en runtime.

**Independent Test**: Intentar subir tipo incorrecto o archivo demasiado grande; intentar guardar URL http no permitida.

**Acceptance Scenarios**:

1. **Given** un archivo fuera de tipo o tamaño, **When** el administrador intenta subirlo, **Then** la operación falla sin escribir archivo arbitrario en rutas sensibles.
2. **Given** una URL de vídeo externa no HTTPS en producción, **When** guarda, **Then** el sistema rechaza o documenta excepción solo para localhost en desarrollo.

---

### Edge Cases

- Fila de configuración ausente en base de datos: tratar como modo imagen por defecto.
- Modo imagen custom sin URL persistida: degradar a imagen por defecto.
- Vídeo que no carga en el cliente: fallback a imagen por defecto.
- Carrusel con URLs remotas en slides: validar HTTPS; render seguro en cliente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST persistir el modo de hero y datos asociados en un registro singleton (equivalente funcional a otras configuraciones globales del sitio).
- **FR-002**: El sistema MUST ofrecer modos: imagen por defecto, imagen personalizada (subida), vídeo (subida o URL externa), carrusel (múltiples imágenes, mínimo dos slides activas).
- **FR-003**: Los administradores MUST poder subir imagen de hero y archivos para carrusel; MUST poder subir vídeo o indicar URL externa para modo vídeo.
- **FR-004**: La página de inicio MUST leer la configuración en el servidor y pasar el resultado al cliente para minimizar parpadeo incorrecto del fondo.
- **FR-005**: Las rutas administrativas bajo `/admin/personalizar` MUST restringirse a rol administrador alineado con la sección Configuración existente.

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: Decisiones de almacenamiento de archivos y límites MUST documentarse; diseño preparado para sustituir almacenamiento local por objeto remoto si el despliegue lo exige.
- **NFR-002 (Security)**: Validar entradas (tipo, tamaño, esquema URL); operaciones de escritura solo tras comprobación explícita de administrador.
- **NFR-003 (Observability)**: Registrar fallos de guardado o subida con contexto suficiente para diagnóstico (sin datos sensibles del archivo).
- **NFR-004 (Performance)**: La home MUST mantener LCP razonable usando prioridad de carga en la primera imagen visible cuando el modo lo permita.
- **NFR-005 (Accessibility)**: Carrusel y vídeo MUST conservar contraste del overlay; vídeo sin audio por defecto; controles de carrusel accesibles por teclado donde aplique.

### Key Entities

- **HeroAppearanceSettings**: Configuración global única; modo de visualización; URLs de imagen/vídeo; origen del vídeo (subida vs externo); lista ordenada de slides del carrusel (URL pública y texto alternativo opcional).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tras guardar, el 100% de recargas de la home en prueba muestran el modo seleccionado sin intervención de código.
- **SC-002**: En pruebas manuales documentadas, intentos de subida inválidos son rechazados el 100% de las veces antes de persistir.
- **SC-003**: Flujo de personalización completo (cambio de modo y guardado) completable en menos de 3 minutos por un administrador familiarizado con el panel.

## Assumptions

- El almacenamiento inicial es el disco del servidor bajo `public/uploads` con URLs públicas relativas.
- El vídeo externo es una URL directa a recurso reproducible por `<video>` (p. ej. MP4 en CDN), no embed de terceros tipo iframe en v1.
- La extensión futura de «Personalizar» añadirá más subpáginas sin cambiar el contrato del singleton del hero.

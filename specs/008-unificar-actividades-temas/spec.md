# Feature Specification: Unificar hubs temáticos en Actividades

**Feature Branch**: `008-unificar-actividades-temas`  
**Created**: 2026-09-17  
**Status**: Draft  
**Input**: User description: "Si vamos con A — Unificar hubs Sucre Natural en Actividades: cada tarjeta de Qué hacer es un tema administrable desde el CMS de Actividades, sin perder listados de destinos, biodiversidad ni experiencias; dejar de llamar micrositios."

## Clarifications

### Session 2026-09-17

- Q: ¿Cómo debe llamarse en el panel de administración la entidad que hoy es «Actividad» y en la spec llamamos «tema»? → A: Seguir diciendo **Actividad** en admin; «tema» solo en la spec interna.
- Q: ¿Desde dónde debe poder asociar el staff un destino a una actividad/tema? → A: Desde **ambos** (formulario de Actividad y ficha de Destino; misma asociación).
- Q: Si varias actividades usan el modo «biodiversidad» (o «experiencias»), ¿qué ve el visitante? → A: Catálogo **global** por modo (todas las publicadas) en cada actividad con ese modo.
- Q: ¿Qué hacer con las actividades ya existentes del CMS «Qué hacer» que no son los siete hubs? → A: Migración canónica a los **siete temas** (+ extras reales de staff); retirar semillas mock viejas.
- Q: ¿La página pública usa estética Sucre Natural para todas las actividades o solo las siete? → A: **Misma plantilla** temática (acento/identidad) para **todas** las actividades.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver temas en «Qué hacer en Sucre» (Priority: P1)

Una persona visitante llega a la portada y ve la sección **Qué hacer en Sucre**. Cada tarjeta es un **tema** (por ejemplo Playas, Ciénagas, Biodiversidad), no una actividad suelta tipo “kayak”. Al pulsar una tarjeta abre la página pública de ese tema, donde encuentra el contenido que antes ofrecía el hub correspondiente (destinos del tema, o especies, o experiencias, según el tipo).

**Why this priority**: Es el valor público de la unificación: una sola entrada mental (“Qué hacer”) que lleva a los temas territoriales, sin dos catálogos compitiendo.

**Independent Test**: Con al menos un tema publicado equivalente a un hub actual, la home muestra esa tarjeta y el clic lleva a su página pública con el listado esperado.

**Acceptance Scenarios**:

1. **Given** hay temas publicados (p. ej. los siete temas naturales actuales), **When** la visitante abre la portada, **Then** ve esas tarjetas en «Qué hacer en Sucre» con pictograma, título y descripción, sin textos de demostración y sin una sección paralela llamada “micrositio”.
2. **Given** la visitante pulsa la tarjeta «Playas», **When** carga la página del tema, **Then** ve la identidad del tema (título, lema/intro si existen, acento visual) y el listado de destinos publicados asociados a ese tema, con la plantilla temática unificada.
3. **Given** la visitante pulsa «Biodiversidad» o «Experiencias», **When** carga la página del tema, **Then** ve el listado correspondiente (especies o experiencias de naturaleza publicadas), no un listado vacío de destinos si ese tema usa otro modo de contenido.
4. **Given** no hay ningún tema publicado, **When** se carga la portada, **Then** la sección «Qué hacer» no aparece (no vuelve un mock ni hubs hardcodeados).

---

### User Story 2 - Administrar temas solo desde Actividades (Priority: P1)

Una persona administradora gestiona todos los temas desde el módulo **Actividades** del panel: crear, editar, reordenar, publicar, despublicar o eliminar. En la interfaz de administración la entidad se sigue llamando **Actividad** (no se renombra el menú ni los formularios a «Tema»). Ya no administra un módulo separado de “micrositios” o hubs. Cada actividad/tema incluye lo necesario para la tarjeta de home y para la página pública (identidad visual básica, texto, fotos, pictograma, destinos asociados y, si aplica, el modo de listado).

**Why this priority**: Sin un único lugar de administración, la unificación de producto falla aunque la home se vea bien.

**Independent Test**: Crear o editar un tema en Actividades, publicarlo, verlo en home y en su URL pública; despublicarlo y comprobar que desaparece de ambos sitios públicos.

**Acceptance Scenarios**:

1. **Given** una sesión de administradora, **When** crea un tema con campos mínimos válidos y lo publica, **Then** aparece en la home y es alcanzable por su identificador de URL estable.
2. **Given** un tema publicado, **When** cambia título, descripción, fotos, pictograma, destinos o modo de listado y guarda, **Then** la portada y la página pública reflejan el cambio en la siguiente visita.
3. **Given** un tema publicado, **When** lo despublica o elimina, **Then** deja de verse en la portada y la URL pública no muestra el contenido al visitante.
4. **Given** el panel de administración, **When** la administradora busca gestionar lo que antes eran hubs/micrositios, **Then** lo hace desde Actividades; no hay un flujo paralelo obligatorio de hubs como concepto de producto.
5. **Given** un intento de publicar sin foto, sin título o sin pictograma válido, **When** envía el formulario, **Then** recibe un error claro en español y no queda un registro público inválido.

---

### User Story 3 - Conservar destinos, especies y experiencias (Priority: P1)

Al unificar, no se pierde la capacidad de mostrar destinos por tema, el catálogo de biodiversidad ni las experiencias de naturaleza. Los destinos se asocian a uno o más temas. Las especies y las experiencias siguen existiendo como contenidos propios y se presentan bajo el tema cuyo modo de listado corresponda.

**Why this priority**: El usuario exige unificar sin perder funcionalidad; esta historia es el criterio de no-regresión.

**Independent Test**: Un destino publicado asociado a «Playas» aparece en la página de ese tema; una especie publicada aparece bajo el tema Biodiversidad; una experiencia publicada bajo el tema Experiencias.

**Acceptance Scenarios**:

1. **Given** un destino publicado asociado al tema «Playas», **When** una visitante abre ese tema, **Then** ve el destino y puede abrir su ficha.
2. **Given** un destino se despublica o se quita del tema, **When** se abre el tema, **Then** ese destino no aparece; no hay enlaces rotos visibles.
3. **Given** especies publicadas, **When** se abre el tema con modo biodiversidad, **Then** se listan y se puede abrir cada ficha de especie.
4. **Given** experiencias de naturaleza publicadas, **When** se abre el tema con modo experiencias, **Then** se listan y se puede abrir cada ficha de experiencia.
5. **Given** un destino asociado a varios temas, **When** se abren esos temas, **Then** el destino aparece en cada uno sin duplicar la ficha del destino.
6. **Given** la administradora asocia un destino desde el formulario de Destino, **When** abre la Actividad correspondiente, **Then** ve esa misma asociación; y a la inversa desde Actividad hacia Destino.

---

### User Story 4 - URL única y continuidad de enlaces antiguos (Priority: P2)

La URL canónica de un tema es la de Actividades / Qué hacer. Las rutas antiguas de hubs Sucre Natural siguen llevando al mismo contenido (redirección o equivalente) para no romper favoritos, materiales impresos ni enlaces externos.

**Why this priority**: Evita perder tráfico y confianza; no bloquea el MVP de home + admin unificado.

**Independent Test**: Abrir una URL antigua de hub conocida y comprobar que se llega al tema equivalente publicado.

**Acceptance Scenarios**:

1. **Given** el tema «Playas» publicado, **When** la visitante usa la URL canónica del tema, **Then** ve la página del tema.
2. **Given** una URL antigua del hub Playas, **When** la visitante la abre, **Then** llega al mismo contenido del tema (sin página muerta ni contenido distinto).
3. **Given** un tema despublicado, **When** se usa la URL canónica o la antigua, **Then** el visitante no ve el contenido publicado (comportamiento coherente de no encontrado / no público).

---

### User Story 5 - Temas más allá de los siete naturales (Priority: P2)

La administradora puede crear temas adicionales (p. ej. Cultura, Gastronomía) con el mismo flujo de Actividades, sin depender de un catálogo cerrado de siete ids. Los siete temas naturales iniciales se cargan o migran como temas editables.

**Why this priority**: Evita volver a rigidizar el producto; el alcance natural se preserva como contenido inicial, no como techo permanente.

**Independent Test**: Crear un octavo tema, publicarlo y verlo en home; editar un tema migrado de un hub sin recrearlo desde cero.

**Acceptance Scenarios**:

1. **Given** los temas naturales iniciales, **When** la administradora los edita, **Then** puede cambiar textos, fotos e identidad sin recrear el registro.
2. **Given** un tema nuevo (fuera de los siete), **When** se publica con modo de listado de destinos, **Then** aparece en home, lista solo los destinos asociados y usa la misma plantilla temática con su propio acento/identidad.
3. **Given** la carga o migración inicial, **When** se ejecuta de forma repetible, **Then** no duplica el mismo identificador de URL de tema y las semillas mock antiguas de demostración ya no aparecen publicadas en la home.

---

### Edge Cases

- Cero temas publicados: la sección de home no se renderiza.
- Una a cinco temas: grilla/fila sin carrusel de tarjetas innecesario; más de cinco: carrusel con flechas y autoplay pausable (mismo criterio de usabilidad ya esperado en «Qué hacer»).
- Tema con modo destinos pero sin destinos asociados: página válida; no muestra bloque vacío engañoso.
- Tema con modo biodiversidad o experiencias: lista el catálogo global publicado; si no hay ítems, página válida con listado vacío comprensible.
- Varias actividades con el mismo modo especial: cada una muestra el mismo catálogo global (no es error).
- Destino huérfano respecto a temas: sigue existiendo en Imperdibles / ficha; simplemente no aparece en ningún tema.
- Eliminar un tema: no borra destinos, especies ni experiencias; solo quita asociaciones y la entrada pública del tema.
- Pictograma fuera de catálogo: en público reserva segura; en admin se exige uno válido al guardar.
- Preferencia de «menos movimiento»: autoplay de home se respeta.
- Terminología: la interfaz pública y de admin no presenta la etiqueta «micrositio» para estos temas.
- Roles: solo admin administra temas (mismo criterio que el CMS de actividades actual); visitante solo ve publicados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST tratar cada entrada publicada de «Qué hacer» / Actividades como un **tema** (tarjeta de home + página pública), no como una actividad granular suelta en el mismo nivel.
- **FR-002**: El sistema MUST permitir administrar esos temas **únicamente** desde el módulo Actividades del panel (crear, editar, reordenar, publicar, despublicar, eliminar). MUST NOT exigir un módulo de producto separado llamado micrositios/hubs para el mismo fin.
- **FR-003**: Cada tema MUST soportar al menos: título, descripción, identificador estable de URL, pictograma de catálogo cerrado, una o más fotos, orden, estado de publicación, identidad visual del tema (acento/portada suficientes para la plantilla temática), destinos asociados (cero o más) y un **modo de listado** (destinos | biodiversidad | experiencias).
- **FR-020**: La página pública de **toda** actividad publicada MUST usar la **misma plantilla temática** (estética tipo Sucre Natural: identidad/acento por actividad). Las siete migradas conservan sus acentos actuales; las nuevas definen el suyo. MUST NOT reservar esa plantilla solo a las siete ni degradar v1 a una plantilla neutra única sin identidad por actividad.
- **FR-004**: La sección «Qué hacer en Sucre» de la portada MUST mostrar solo temas publicados (pictograma + título + descripción sobre foto representativa), con la misma regla de carrusel si hay más de cinco.
- **FR-005**: Al abrir un tema, si el modo es destinos, el sistema MUST listar destinos publicados asociados a esa actividad; si es biodiversidad, MUST listar **todas** las especies publicadas del catálogo (listado global por modo); si es experiencias, MUST listar **todas** las experiencias de naturaleza publicadas (listado global por modo) — sin perder la navegación a sus fichas existentes. En v1 no se exige filtrar especies/experiencias por actividad.
- **FR-018**: Varias actividades MAY compartir el mismo modo de listado especial; el visitante verá el mismo catálogo global en cada una. El filtrado por actividad de especies/experiencias queda fuera de alcance de esta feature.
- **FR-006**: Los destinos MUST poder asociarse a uno o más temas (actividades). La asociación MUST ser la misma relación editable desde el formulario de **Actividad** y desde el formulario de **Destino** (entrada dual; no dos taxonomías). MUST NOT exigir mantener hubs o categorías paralelas para el mismo propósito.
- **FR-017**: Quitar o añadir un destino en cualquiera de las dos entradas MUST reflejarse en la otra y en las páginas públicas del tema tras guardar.
- **FR-007**: El sistema MUST migrar o cargar los siete temas naturales actuales (Playas, Ciénagas, Ríos, Paisajes, Biodiversidad, Senderos, Experiencias) como actividades editables canónicas, preservando asociaciones de destinos y el comportamiento de listado especial de Biodiversidad y Experiencias. La migración MUST retirar o despublicar las **semillas mock** antiguas de «Qué hacer» que solo servían de demostración (p. ej. Cultura/Gastronomía/Naturaleza de seed) cuando entren en conflicto o dupliquen el propósito. Las actividades **creadas a mano por staff** (no seedManaged) MUST conservarse si ya existen.
- **FR-019**: La carga/migración MUST ser repetible sin duplicar identificadores de URL de los siete temas canónicos.
- **FR-008**: La URL canónica pública de un tema MUST ser la de Qué hacer / Actividades. Las URLs antiguas de hubs Sucre Natural MUST redirigir o resolver al tema equivalente.
- **FR-009**: El copy de producto (home, admin, mensajes) MUST dejar de presentar estos temas como «micrositios». En administración, la etiqueta canónica de la entidad MUST seguir siendo **Actividad** / módulo **Actividades**; el término «tema» es de esta especificación, no un rename obligatorio de UI.
- **FR-016**: En la home pública la sección puede seguir titulándose «Qué hacer en Sucre»; no se exige renombrar tarjetas a «temas» frente al visitante.
- **FR-010**: Solo personal **admin** MAY mutar temas. La lectura pública MUST limitarse a temas publicados y a contenidos ya públicos enlazados.
- **FR-011**: Al guardar un tema publicado, el sistema MUST actualizar de inmediato la portada y las páginas públicas afectadas (tema y, si aplica, vistas que listaban por hub).
- **FR-012**: El sistema MUST validar en el límite de administración (campos obligatorios al publicar, pictograma de catálogo, identificador de URL, destinos existentes, modo de listado válido). Errores en español sin filtrar detalles internos.
- **FR-013**: El sistema MUST permitir temas adicionales además de los siete iniciales, con el mismo modelo.
- **FR-014**: Eliminar o despublicar un tema MUST NOT eliminar destinos, especies ni experiencias; solo deja de exponer el tema y sus asociaciones desde ese tema.
- **FR-015**: El catálogo paralelo de «categorías» de actividades que duplicaba la taxonomía temática MUST dejar de ser requisito de producto para organizar la home; no se exige mantener dos etiquetados obligatorios (categoría + tema) para el mismo propósito. (Los contenidos finos —especies, experiencias— siguen siendo entidades propias.)

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: La unificación MUST reducir conceptos de producto (un tema = una tarjeta), documentando la decisión de no modelar actividades granulares en el mismo nivel.
- **NFR-002 (Security)**: Mutaciones de temas MUST exigir autorización admin; entradas MUST validarse en el límite administrativo.
- **NFR-003 (Observability)**: Fallos al publicar, migrar o resolver URLs antiguas MUST registrarse con contexto suficiente (identificador de tema, acción).
- **NFR-004 (Performance)**: La portada con temas publicados MUST seguir siendo usable: listado de temas en home percibido como inmediato en condiciones normales (< 3 s hasta contenido útil de la sección en red típica de oficina).
- **NFR-005 (Accessibility)**: Tarjetas de home, página de tema y listados MUST ser operables por teclado, con textos/alternativas que no dependan solo del pictograma; contraste legible en tipografía sobre fotos.

### Key Entities *(include if feature involves data)*

- **Tema (Actividad unificada)**: Entrada de «Qué hacer»; tarjeta de home y página pública; identidad, fotos, pictograma, modo de listado, publicación y orden. En admin se presenta como **Actividad**.
- **Destino / ficha**: Lugar ya existente; puede pertenecer a varios temas.
- **Entrada de biodiversidad**: Especie/ecosistema; se lista bajo el tema en modo biodiversidad.
- **Experiencia de naturaleza**: Vivencia; se lista bajo el tema en modo experiencias.
- **Hub / micrositio (legado)**: Concepto a retirar del producto; sus datos y URLs se absorben en Tema.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una administradora completa el alta o la edición de un tema publicado (campos mínimos) en menos de 10 minutos sin usar un módulo distinto de Actividades.
- **SC-002**: El 100 % de los siete temas naturales iniciales son alcanzables desde la sección «Qué hacer» de la home cuando están publicados, con el tipo de listado correcto (destinos / especies / experiencias).
- **SC-003**: El 100 % de un conjunto de URLs antiguas de hub de referencia resuelven al tema equivalente (sin error 404 para temas publicados migrados).
- **SC-004**: Tras la unificación, no queda un flujo de admin obligatorio etiquetado como micrositio/hub para el mismo contenido; una revisión de copy de admin/home encuentra 0 usos de «micrositio» para estos temas.
- **SC-005**: Visitantes pueden recorrer home → tema → ficha (destino, especie o experiencia) solo con teclado en los flujos principales.
- **SC-006**: En una pasada de regresión manual/automatizada acordada, no se pierde la capacidad de listar destinos por tema ni de abrir especies y experiencias ya publicadas.

## Assumptions

- Se adopta el modelo **opción A** acordado: una Actividad/tema = una tarjeta de home; el detalle granular vive en destinos, especies y experiencias, no en un segundo nivel de “subactividades” en v1.
- El personal acepta migrar el **comportamiento** de «actividad» hacia tema / qué hacer; en admin el copy permanece **Actividad** (clarificación 2026-09-17).
- Los siete hubs actuales se migran o siembran como las actividades canónicas iniciales; se retiran semillas mock viejas de «Qué hacer»; no se borra el contenido de destinos/especies/experiencias; se conservan actividades no-seed creadas por staff.
- Las URLs canónicas nuevas son las de Qué hacer; las de `/sucre-natural/...` se conservan como continuidad, no como marca de producto “micrositio”.
- El mapa interactivo unificado (roadmap prompt 11), RAG y respuestas ricas del chatbot quedan **fuera de alcance** de esta feature.
- La administración de fichas de destino, especies y experiencias puede seguir en sus pantallas actuales; esta feature unifica el **contenedor temático** y la home, no obliga a fusionar todos los CRUDs hijos en una sola pantalla en v1.
- Roles: solo `admin` muta, igual que el CMS de actividades vigente.
- Contenido inicial o migración repetible sin duplicar identificadores de URL.

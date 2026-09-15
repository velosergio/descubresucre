# Feature Specification: Fichas de destino y micrositios Sucre Natural

**Feature Branch**: `006-fichas-sucre-natural`  
**Created**: 2026-09-15  
**Status**: Draft  
**Input**: User description: "2. Fichas de destino y micrositios “Sucre Natural” (referencia visual: `docs/fichas_destinos`). Extiende el CMS de Imperdibles; no replicar carteles estáticos: páginas web interactivas con la misma estética. Hubs temáticos con paleta propia. Cada ficha es CMS estructurado. Catálogo de especies enlazado a destinos. Admin CRUD; fuentes en la ficha. Al publicar: revalidar home e Imperdibles. Campos listos para el mapa (prompt 11) y el RAG (prompt 14). Transcribir `docs/fichas_destinos` y cargar el contenido inicial; documentar transcripciones en un .md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recorrer Sucre Natural por temas (Priority: P1)

Una persona visitante entra a **Sucre Natural** (portada del programa de turismo de naturaleza) y elige un hub temático — Playas, Ciénagas, Ríos, Paisajes, Biodiversidad, Senderos o Experiencias en naturaleza —. Ve una página con la paleta, el lema y la estética de ese tema, y una lista de destinos (o de especies / experiencias, según el hub) publicados. Al abrir un destino, lee una **ficha estructurada** (no un cartel ni un bloque de texto libre): ubicación, municipio, región, ecosistemas, tagline, “en 30 segundos”, “qué lo hace especial”, biodiversidad, actividades, turismo responsable, cómo llegar / clima / tiempo / para quién, galería, mapa y fuentes.

**Why this priority**: Es el valor público del Anexo 2 y del prompt 2 del roadmap: convertir las fichas de `docs/fichas_destinos` en micrositios útiles, no en PDFs o imágenes estáticas.

**Independent Test**: Con al menos un hub y un destino publicados, se puede ir de la portada Sucre Natural → hub → ficha y comprobar que cada sección de la ficha muestra datos reales (o se oculta si está vacía). Entrega valor aunque el admin aún no tenga el catálogo completo de especies.

**Acceptance Scenarios**:

1. **Given** hay destinos publicados asignados a Playas, **When** la visitante abre el hub Playas, **Then** ve solo esos destinos, con paleta turquesa y la estética de papel crema / títulos pincel / polaroids, y puede abrir cada ficha.
2. **Given** una ficha publicada con todos los bloques de contenido, **When** la visitante recorre la página, **Then** encuentra ubicación, “30 segundos”, “qué lo hace especial”, chips de biodiversidad, “vive el destino”, turismo responsable, información útil, galería, mapa y fuentes, sin depender de un único texto corrido.
3. **Given** un bloque de la ficha está vacío (p. ej. sin clima), **When** se muestra la página, **Then** ese bloque no aparece como sección hueca; el resto de la ficha sigue siendo usable.
4. **Given** un destino de Imperdibles publicado **sin** ficha estructurada aún, **When** se abre su página pública existente, **Then** sigue mostrándose el contenido actual (tarjeta + cuerpo ya publicado) y no se rompe la home.

---

### User Story 2 - Administrar fichas, hubs y publicación (Priority: P1)

Una persona administradora (rol admin) extiende el CMS de Destinos imperdibles: crea o edita un destino con campos estructurados de ficha Sucre Natural, lo asigna a uno o más hubs, adjunta galería, registra coordenadas y fuentes, y lo publica o despublica. Al publicar, la portada, la sección Imperdibles y las páginas de Sucre Natural muestran el contenido actualizado sin pasos manuales extra.

**Why this priority**: Sin CRUD y publicación, las fichas no se pueden mantener ni alinear con Imperdibles.

**Independent Test**: Desde el panel, crear un destino de prueba con campos mínimos, publicarlo, verlo en un hub y en Imperdibles; despublicarlo y comprobar que deja de ser público.

**Acceptance Scenarios**:

1. **Given** una sesión de administradora, **When** completa los campos obligatorios de un destino y lo publica, **Then** el destino aparece en su(s) hub(s), en el detalle público y, si aplica a Imperdibles, en la home.
2. **Given** un destino publicado, **When** la administradora despublica, **Then** la ficha y las listas públicas dejan de mostrarlo; el personal staff sigue viéndolo en el panel.
3. **Given** un destino publicado, **When** cambia el tagline o la galería y guarda, **Then** home, listado de Imperdibles y ficha pública reflejan el cambio en la siguiente visita.
4. **Given** un intento de guardar sin título, identificador de URL o municipio, **When** envía el formulario, **Then** recibe un error claro en español y no se persiste un registro inválido.

---

### User Story 3 - Catálogo de especies enlazado a destinos (Priority: P2)

Una visitante en el hub Biodiversidad (paleta ámbar) explora fichas de fauna y flora (foto, nombre común, nombre científico si existe, grupo, hábitat, por qué importa). Cada especie puede enlazarse a uno o más destinos; desde la ficha del destino ve chips o enlaces a esas especies, y desde la especie puede ir a los destinos donde se observa.

**Why this priority**: El material de referencia dedica láminas enteras a fauna, aves, flora y bosques; el roadmap pide que el catálogo alimente el micrositio y, más adelante, el asistente — sin implementar búsqueda inteligente en esta feature.

**Independent Test**: Con dos especies y un destino vinculados, se verifica la navegación destino → especie y especie → destino.

**Acceptance Scenarios**:

1. **Given** especies publicadas, **When** se abre Biodiversidad, **Then** se listan agrupadas (p. ej. mamíferos, aves, reptiles y anfibios, flora, bosques/ecosistemas) y cada ficha de especie es accesible.
2. **Given** el tití cabeciblanco vinculado a un destino de manglar o bosque, **When** se abre ese destino, **Then** la sección de biodiversidad incluye esa especie como chip o enlace, no solo un texto genérico.
3. **Given** una especie sin destinos vinculados, **When** se abre su ficha, **Then** se muestra igual y no promete destinos inexistentes.

---

### User Story 4 - Experiencias de turismo en naturaleza (Priority: P2)

Una visitante abre el hub naranja **Experiencias en naturaleza** y ve experiencias (senderismo, avistamiento de aves, navegación, buceo y careteo, espeleología, naturaleza nocturna). Cada una indica dónde vivirla (destinos o zonas), qué se hace, por qué es especial y recomendaciones responsables.

**Why this priority**: Completa los siete micrositios del material visual; no es el CMS posterior de “Qué hacer” (prompt 3), pero deja las experiencias de naturaleza publicables y enlazadas a destinos.

**Independent Test**: Publicar una experiencia vinculada a dos destinos y abrirla desde el hub.

**Acceptance Scenarios**:

1. **Given** experiencias publicadas, **When** se abre el hub Experiencias, **Then** se listan con la paleta naranja y se puede abrir cada ficha.
2. **Given** “Avistamiento de aves” vinculado a Sanguaré y La Caimanera, **When** la visitante abre la experiencia, **Then** puede navegar a esas fichas de destino.

---

### User Story 5 - Carga inicial desde las fichas de referencia (Priority: P1)

El equipo pone en marcha el entorno y ejecuta la **carga inicial** alimentada por las transcripciones de las fichas de referencia. Quedan creados hubs, destinos, especies, experiencias y fuentes. El personal puede editarlos después en el panel. Las transcripciones viven en un archivo Markdown versionado para auditoría y para regenerar la carga.

**Why this priority**: Sin contenido semilla, los micrositios estarían vacíos y se perdería el trabajo de las 45 láminas.

**Independent Test**: En un entorno limpio (o reejecutando la carga sin crear duplicados), aparecen los destinos y especies documentados en las transcripciones, con identificadores de URL estables.

**Acceptance Scenarios**:

1. **Given** las transcripciones publicadas en el repositorio, **When** se ejecuta la carga inicial, **Then** existen los siete hubs y los destinos/especies/experiencias transcritos, sin duplicar registros si se vuelve a ejecutar.
2. **Given** un destino ya editado a mano con el mismo identificador estable, **When** se reejecuta la carga, **Then** no se crean duplicados; la política de no pisar ediciones humanas queda documentada en la carga (actualizar solo campos aún vacíos, o solo registros marcados como provenientes de la carga inicial).
3. **Given** el archivo de transcripciones, **When** una editora lo abre, **Then** puede leer el texto de cada lámina organizado por hub, con referencia al número de “Mesa de trabajo”.

---

### Edge Cases

- Destino asignado a **varios hubs** (p. ej. Reserva Sanguaré en Paisajes y Senderos): aparece en cada hub sin duplicar la ficha canónica.
- **Ciénaga / playa / río** con datos incompletos de clima o “para quién”: se publican igual; solo se exigen campos mínimos (nombre, identificador de URL, municipio o ámbito territorial, al menos un hub, estado de publicación).
- Destino **despublicado** o borrado: desaparece de hubs, home e Imperdibles; las especies o experiencias que lo citaban omiten el enlace roto.
- **Identificador de URL** duplicado o con caracteres no aptos: se rechaza con mensaje en español.
- Coordenadas ausentes: la ficha se publica; el bloque de mapa muestra una alternativa (indicaciones de “cómo llegar” y, si existe, mapa ilustrativo o enlace externo), sin bloquear la página. Los campos de mapa quedan listos para el mapa unificado posterior.
- Hub **Biodiversidad** sin destinos pero con especies: el hub sigue siendo útil.
- Hub **Experiencias** sin destinos vinculados: la ficha de experiencia se muestra con el texto de zonas; no exige destinos.
- Imágenes de galería faltantes o huérfanas: no se muestran huecos rotos; se usa la imagen de tarjeta si existe.
- Paletas decorativas (turquesa, violeta, etc.) sobre papel crema: el texto de cuerpo y los controles siguen siendo legibles (contraste de lectura, no solo color de marca).
- Visitante con teclado o lector de pantalla: puede recorrer hubs, listas y fichas; los iconos no son el único medio de significado.
- Contenido de **Paisaje de la Mojana** aparece dos veces en el material de referencia (láminas 21 y 26): en la carga inicial hay **un** destino, no dos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST ofrecer una portada pública **Sucre Natural** que presente el programa de turismo de naturaleza y sostenibilidad y enlace a los siete hubs temáticos, con la estética de referencia (papel crema, títulos tipo pincel, fotos polaroid, iconos, acentos botánicos, mapas ilustrados cuando existan).
- **FR-002**: El sistema MUST exponer siete hubs públicos con paleta e identidad propias: Playas (turquesa), Ciénagas (verde), Ríos (tierra), Paisajes (verde), Biodiversidad (ámbar), Senderos (violeta), Experiencias en naturaleza (naranja). En v1 el conjunto de hubs es cerrado (no se crean ni se eliminan temas nuevos desde el admin); el staff MAY editar lema, texto introductorio e imagen de portada de cada hub.
- **FR-003**: Cada hub (excepto lo propio de Biodiversidad y Experiencias, ver FR-011 y FR-012) MUST listar los destinos publicados asociados a ese tema, con tarjeta (imagen, título, tagline o subtítulo, municipio).
- **FR-004**: El CMS de Destinos imperdibles MUST extenderse: un destino publicado sigue pudiendo aparecer en la home / Imperdibles **y** tener ficha Sucre Natural estructurada. No se crea un catálogo paralelo desconectado.
- **FR-005**: La ficha de destino MUST ser contenido estructurado (campos), no un único texto libre como fuente de verdad. Campos de la ficha: nombre, identificador estable de URL, tagline, municipio, región, ubicación/ámbito, ecosistemas, enfoque, “el destino en 30 segundos” (ubicación, región, ecosistemas, experiencias, enfoque), “qué lo hace especial”, chips de biodiversidad, actividades (“vive el destino”), turismo responsable (lista de pautas), cómo llegar, clima, tiempo recomendado, para quién, galería de imágenes, ubicación en el mapa (coordenadas y nivel de acercamiento), etiqueta o nota de mapa, fuentes, estado publicado, orden.
- **FR-006**: El cuerpo narrativo ya existente en Imperdibles MAY conservarse como respaldo para destinos aún no migrados; la ficha estructurada, cuando tiene datos, MUST gobernar la página pública de ese destino.
- **FR-007**: Un destino MUST poder pertenecer a **uno o más** hubs.
- **FR-008**: Solo personal **admin** MAY crear, editar, publicar, despublicar o eliminar destinos, especies y experiencias. La lectura pública MUST limitarse a registros publicados. Las editoras sin rol admin no administran este módulo en v1 (mismo criterio que Imperdibles).
- **FR-009**: Al guardar un destino publicado, el sistema MUST actualizar de inmediato la home, el listado/detalle de Imperdibles y las páginas Sucre Natural afectadas.
- **FR-010**: Cada ficha de destino MUST poder registrar **fuentes** (nombre, URL opcional, nota). Las siete referencias institucionales del material (CARSUCRE, Colombia Travel, CORPOMOJANA, Instituto Humboldt, Parques Nacionales, Ministerio de Ambiente, Gobernación de Sucre) MUST cargarse como fuentes reutilizables y asociarse donde el material lo indica.
- **FR-011**: El sistema MUST incluir un catálogo de **especies** (fauna y flora) y de **ecosistemas/bosques** del material de biodiversidad, con: tipo (fauna / flora / ecosistema), grupo (p. ej. mamíferos, aves), nombre común, nombre científico opcional, descripción (“por qué importa” / hábitat), imagen, destinos relacionados, publicado. El hub Biodiversidad lista este catálogo y, si hay destinos etiquetados en ese tema, también esos destinos.
- **FR-012**: El sistema MUST incluir fichas de **experiencias de turismo en naturaleza** (distintas del futuro CMS “Qué hacer”): título, lema, dónde vivirla, qué se hace, por qué es especial, recomendaciones, destinos relacionados, imagen(es), publicado. El hub Experiencias las lista. El enlace posterior con “Qué hacer” queda fuera de alcance.
- **FR-013**: El sistema MUST cargar el contenido inicial a partir de las transcripciones de las fichas de referencia (carga repetible que no duplica destinos con el mismo identificador). El inventario esperado se detalla en [docs/fichas_destinos/transcripciones.md](../../docs/fichas_destinos/transcripciones.md).
- **FR-014**: Los destinos y especies MUST tener **identificador estable de URL** y texto estructurado suficiente para que, en una feature posterior, el mapa unificado (prompt 11) y la base de conocimiento del asistente (prompt 14) los consuman. Esta feature MUST NOT implementar el mapa unificado ni la indexación del asistente.
- **FR-015**: Los campos de geolocalización (coordenadas, municipio, región, nota de mapa) MUST existir aunque el mapa interactivo unificado no se construya aquí. Si hay coordenadas, la ficha MUST mostrar un mapa como en el detalle actual de destinos; si no, MUST mostrar cómo llegar y no un error.
- **FR-016**: La galería de la ficha MUST usar el mismo sistema de medios del sitio (elección desde la galería o subida nueva, dentro de los límites ya vigentes) y mostrar las imágenes de forma segura.
- **FR-017**: La carga inicial MUST documentar autoría del material de referencia (Juana Valentina Patiño Moncada / Sucre Natural) en la portada o en fuentes, sin presentar el contenido como saber comunitario no atribuido.
- **FR-018**: El sistema MUST validar entradas en el límite de administración (longitudes, enlaces de medios, coordenadas en rango, identificadores de URL). Los errores al público y al staff MUST estar en español y no filtrar detalles internos.
- **FR-019**: Municipios y ámbitos territoriales MUST admitir todos los citados en las fichas (San Onofre, Tolú, Coveñas, Caimito, San Benito Abad, San Marcos, Toluviejo, Chalán, Colosó, La Mojana y otros) sin rediseñar el modelo cuando se añadan más.
- **FR-020**: Las páginas públicas MUST ser interactivas (navegación, enlaces entre hub, destino, especie y experiencia; galería recorrible) y MUST NOT limitarse a mostrar las PNG o el PDF de las mesas de trabajo.

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: La extensión de Imperdibles MUST reutilizar el módulo existente (listados, publicación, medios) en lugar de un segundo CMS duplicado. Las decisiones de campos y de no implementar mapa ni base de conocimiento del asistente aquí MUST quedar documentadas en esta spec.
- **NFR-002 (Security)**: Mutaciones MUST exigir sesión admin. Medios y coordenadas MUST validarse. No se exponen secretos de mapas ni webhooks en el cliente más allá de lo ya aceptado en Imperdibles.
- **NFR-003 (Observability)**: Publicar, fallar validación o ejecutar la carga inicial MUST dejar registro diagnosticable (quién / qué / resultado) en las rutas críticas de administración y de carga.
- **NFR-004 (Performance)**: Una visitante en conexión urbana típica MUST ver el contenido principal de un hub o una ficha (título, tagline y primer bloque) en menos de 3 segundos; las galerías no MUST bloquear ese primer contenido.
- **NFR-005 (Accessibility)**: Hub, listado y ficha MUST ser operables por teclado; imágenes MUST tener texto alternativo; el color de marca no MAY ser el único distintivo de sección; el texto sobre fondos crema o manchas de color MUST mantener contraste de lectura. Iconos decorativos MUST ir acompañados de etiqueta visible o accesible.

### Key Entities *(include if feature involves data)*

- **Hub temático**: Uno de los siete micrositios. Atributos: clave estable, nombre, lema, paleta, textos de portada, imagen, orden. Relación: muchos destinos, y según el hub también especies o experiencias.
- **Destino (Imperdible extendido)**: Lugar o paisaje visitables. Atributos de ficha (FR-005), publicación, orden, coordenadas. Relaciones: N hubs, N especies, N experiencias, N fuentes, N imágenes de galería.
- **Especie o ecosistema**: Entrada del catálogo de biodiversidad. Atributos: tipo, grupo, nombres, texto, imagen, publicación. Relación N destinos.
- **Experiencia de naturaleza**: Actividad o vivencia del hub naranja. Relación N destinos.
- **Fuente**: Procedencia citables (institución, URL). Relación N destinos (y, si aplica, especies).
- **Carga inicial**: Conjunto versionado de transcripciones y volcado repetible a destinos, especies, experiencias y hubs, sin duplicar identificadores.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los siete hubs es alcanzable desde la portada Sucre Natural en menos de 2 clics (o equivalentes de teclado).
- **SC-002**: Tras la carga inicial, una visitante puede abrir al menos 20 fichas de destino distintas correspondientes al material de referencia, más el catálogo de especies y las 6 experiencias transcritas.
- **SC-003**: En una prueba con 5 personas no técnicas, al menos 4 encuentran en la ficha de Playa El Francés (o equivalente) “cómo llegar”, “vive el destino” y “turismo responsable” en el primer minuto, sin instrucciones.
- **SC-004**: Una administradora crea o edita y publica un destino de prueba en menos de 10 minutos (campos mínimos + un hub + una imagen).
- **SC-005**: El 100 % de destinos despublicados deja de verse en home, Imperdibles y Sucre Natural en la siguiente visita a esas páginas.
- **SC-006**: El 100 % de los flujos públicos de portada → hub → ficha (y especie ↔ destino cuando hay vínculo) es operable solo con teclado.
- **SC-007**: Ninguna página pública de esta feature muestra la PNG o el PDF de “Mesa de trabajo” como contenido principal; el contenido se lee como página web (secciones, enlaces, galería).
- **SC-008**: Reejecutar la carga inicial no crea destinos duplicados (mismo identificador de URL).

## Assumptions

- Se extiende el CMS de Imperdibles ya implementado (prompt 1); las URLs públicas de detalle de destino existentes se conservan o redirigen de forma estable para no romper enlaces. Los hubs y la portada Sucre Natural son rutas públicas nuevas.
- Los siete hubs son un catálogo cerrado alineado al material visual; ampliar temas es un cambio de producto posterior.
- “Experiencias en naturaleza” de esta feature no sustituye el CMS de actividades “Qué hacer” (prompt 3); podrán enlazarse más adelante.
- El mapa unificado (prompt 11) y la base de conocimiento del asistente (prompt 14) **no** se construyen aquí; sí se persisten identificadores de URL, textos, municipio, región y coordenadas.
- Idioma de la interfaz y del contenido inicial: español. El inglés (prompt 18) queda fuera.
- Municipios del alcance territorial amplio: el modelo no se limita a Sincelejo / Tolú / Coveñas / Sampués / Morroa.
- Créditos del material: Juana Valentina Patiño Moncada; marca Sucre Natural. Las fotos de las láminas son referencia visual; la carga inicial prioriza **textos**. Las imágenes se asocian cuando existan archivos de medios disponibles; si no, el staff las carga después y las páginas usan un marcador de imagen de tarjeta.
- Láminas 21 y 26 (Paisaje de la Mojana) se consolidan en un solo destino.
- Reserva Sanguaré, Cavernas de Toluviejo y similares pueden ser a la vez destino y destino citado por una experiencia o un sendero.
- Autorización: mismo umbral que Imperdibles (solo admin). Lectura pública sin cuenta.
- La home sigue mostrando Imperdibles según la configuración actual (tres destacados o carrusel); Sucre Natural es además un micrositio propio, enlazable desde navegación o desde Imperdibles.
- “Revalidar” significa que la visitante ve datos frescos tras publicar, sin esperar un ciclo largo de caché.
- El archivo [docs/fichas_destinos/transcripciones.md](../../docs/fichas_destinos/transcripciones.md) es la fuente editorial de la carga inicial; las PNG siguen siendo la referencia visual de estética, no el contenido servido al público.

## Out of Scope

- Mapa interactivo unificado con eventos y actores (prompt 11).
- Indexación de conocimiento para el asistente (prompt 14).
- CMS de actividades “Qué hacer”, eventos, convocatorias, actores, guías, memoria cultural, rutas, favoritos.
- Multilingüe, analítica de plataforma, WCAG completo de todos los flujos del sitio (más allá de los NFR de esta feature).
- Replicar las láminas como descargables PDF estáticos (no es el entregable; un “imprimir ficha” es opcional y no requerido en v1).
- Alta de hubs temáticos arbitrarios por el staff.
- Aprobación comunitaria de fichas de naturaleza (prompt 10 aplica a patrimonio, no a este módulo).

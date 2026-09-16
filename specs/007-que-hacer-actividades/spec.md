# Feature Specification: CMS de actividades «Qué hacer en Sucre»

**Feature Branch**: `007-que-hacer-actividades`  
**Created**: 2026-09-15  
**Status**: Draft  
**Input**: User description: "3. Reemplazar el mock de ActivitiesSection por un CMS de actividades “Qué hacer en Sucre”. Admin CRUD de actividades y de categorías (relación M-N: una categoría varios destinos/actividades y viceversa). Cada actividad: título, descripción, 1+ fotos en carrusel, icono Lucide desde un catálogo. En la home: icono + título + descripción; si hay más de 5, carrusel con flechas y autoplay; fondo con imágenes en autoplay. Enlazar a destinos/fichas del prompt 2 cuando aplique."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver «Qué hacer en Sucre» con contenido real (Priority: P1)

Una persona visitante llega a la portada y ve la sección **Qué hacer en Sucre**. Las tarjetas ya no son datos de demostración: cada una muestra el pictograma, el título y la descripción de una actividad publicada, sobre una foto. Si hay hasta cinco actividades, las ve todas a la vez. Si hay más de cinco, recorre un carrusel de tarjetas con flechas; el carrusel también avanza solo. Detrás de las tarjetas, el fondo de la sección cambia solo entre fotos de las actividades publicadas.

**Why this priority**: Es el valor público del prompt 3: la home deja de mentir con un mock y muestra oferta turística mantenible.

**Independent Test**: Con al menos una actividad publicada (título, descripción, pictograma y una foto), la sección de la home muestra esos datos y no los cinco ítems fijos actuales. Entrega valor aunque aún no haya categorías ni destinos enlazados.

**Acceptance Scenarios**:

1. **Given** hay 1 a 5 actividades publicadas, **When** la visitante abre la portada, **Then** ve exactamente esas actividades (pictograma, título y descripción), sin los textos de demostración (Playas / Cultura / Gastronomía / Naturaleza / Experiencias hardcodeados).
2. **Given** hay 6 o más actividades publicadas, **When** la visitante abre la portada, **Then** ve un carrusel de tarjetas con flechas anterior/siguiente y avance automático, y puede pausar o retomar ese avance.
3. **Given** hay actividades publicadas con fotos, **When** la visitante mira la sección, **Then** el fondo recorre esas fotos de forma automática (y se puede pausar), sin tapar el título de la sección ni las tarjetas.
4. **Given** no hay ninguna actividad publicada, **When** se carga la portada, **Then** la sección «Qué hacer» no aparece (no se cae al mock).

---

### User Story 2 - Administrar actividades (Priority: P1)

Una persona administradora crea, edita, reordena, publica, despublica o elimina actividades. Cada actividad tiene título, descripción, al menos una foto (recorridas en carrusel en la ficha pública), un pictograma elegido de un catálogo cerrado y un identificador estable de URL. Tras publicar, la home y la ficha pública muestran el contenido sin pasos extra.

**Why this priority**: Sin alta y publicación, la sección pública no se puede mantener ni sustituir el mock de forma duradera.

**Independent Test**: Crear una actividad de prueba con campos mínimos, publicarla, verla en la home y en su ficha; despublicarla y comprobar que desaparece.

**Acceptance Scenarios**:

1. **Given** una sesión de administradora, **When** completa título, descripción, pictograma y al menos una foto y publica, **Then** la actividad aparece en la home y es alcanzable por su identificador de URL.
2. **Given** una actividad publicada, **When** la administradora cambia el título o las fotos y guarda, **Then** la portada y la ficha pública reflejan el cambio en la siguiente visita.
3. **Given** una actividad publicada, **When** la despublica o la elimina, **Then** deja de verse en la portada y la URL pública no muestra el contenido (el personal staff sigue viéndola en el panel si no fue eliminada).
4. **Given** un intento de publicar sin foto, sin título o sin pictograma del catálogo, **When** envía el formulario, **Then** recibe un error claro en español y no queda un registro público inválido.

---

### User Story 3 - Categorías compartidas entre actividades y destinos (Priority: P1)

Una administradora mantiene un catálogo de **categorías** (por ejemplo Playas, Cultura, Gastronomía, Naturaleza, Experiencias). Una categoría puede agrupar varias actividades y varios destinos/fichas de Sucre Natural; una actividad o un destino puede pertenecer a varias categorías. En público, la actividad muestra sus categorías como etiquetas comprensibles, no como códigos internos.

**Why this priority**: El prompt exige la relación de muchos a muchos como eje de organización; sin ella las actividades quedan sueltas y no se articulan con el CMS de destinos ya existente.

**Independent Test**: Crear dos categorías, asignar una actividad a ambas y un destino a una de ellas; verificar en admin y en la ficha pública de la actividad.

**Acceptance Scenarios**:

1. **Given** las categorías «Playas» y «Naturaleza», **When** la administradora asigna una actividad a las dos, **Then** ambas quedan asociadas y se pueden quitar después sin borrar la actividad.
2. **Given** un destino/ficha publicado, **When** la administradora lo asigna a «Playas» junto con otras actividades de esa categoría, **Then** la categoría lista ese destino y esas actividades; el destino no se duplica como otra ficha.
3. **Given** se elimina una categoría, **When** se confirma, **Then** las actividades y destinos siguen existiendo y solo pierden esa etiqueta.
4. **Given** una visitante abre una actividad con categorías, **When** mira la ficha, **Then** ve los nombres de esas categorías.

---

### User Story 4 - Enlazar actividades con destinos y fichas (Priority: P2)

Cuando una actividad se vive en un lugar concreto, la administradora la enlaza a uno o más destinos o fichas ya publicados (Imperdibles / Sucre Natural). La visitante, desde la actividad, puede abrir esos lugares. Si el destino se despublica, el enlace deja de mostrarse. Una actividad sin destinos enlazados sigue siendo válida.

**Why this priority**: Articula el prompt 3 con el 2 («cuando aplique») sin bloquear el MVP de la home.

**Independent Test**: Enlazar una actividad a dos destinos publicados, abrir la actividad y navegar a cada ficha; despublicar un destino y ver que el enlace desaparece.

**Acceptance Scenarios**:

1. **Given** una actividad publicada enlazada a dos destinos publicados, **When** la visitante abre la actividad, **Then** ve ambos destinos y puede entrar a cada ficha.
2. **Given** una actividad sin destinos enlazados, **When** se muestra en home o en su ficha, **Then** no promete lugares inexistentes ni muestra huecos rotos.
3. **Given** un destino enlazado que luego se despublica, **When** se abre la actividad, **Then** ese destino no aparece; los demás enlaces válidos sí.
4. **Given** un destino publicado enlazado a una actividad publicada, **When** la visitante abre esa ficha de destino, **Then** puede descubrir la actividad relacionada (enlace de vuelta).

---

### User Story 5 - Recorrer fotos de una actividad (Priority: P2)

Una visitante abre la ficha pública de una actividad y recorre sus fotos en un carrusel (más de una foto si existen). En la home, la tarjeta usa una foto representativa detrás del pictograma, el título y la descripción; no sustituye el carrusel completo de la ficha.

**Why this priority**: El prompt pide 1 o más fotos por actividad; la home debe seguir siendo una grilla/carrusel de tarjetas compactas, no una galería anidada ilegible.

**Independent Test**: Publicar una actividad con tres fotos; en home se ve una tarjeta con pictograma + título + descripción; en la ficha se recorren las tres fotos.

**Acceptance Scenarios**:

1. **Given** una actividad con varias fotos, **When** se abre su ficha pública, **Then** hay un carrusel con anterior/siguiente y las fotos se anuncian de forma accesible (no solo como decoración muda).
2. **Given** la misma actividad en la home, **When** se mira la tarjeta, **Then** se ve pictograma, título y descripción sobre una foto; no es obligatorio que la tarjeta recorra sola todas las fotos.
3. **Given** una foto faltante o huérfana, **When** se muestra la actividad, **Then** no aparece un recuadro roto; se usan solo las fotos que existen.

---

### Edge Cases

- **Cero** actividades publicadas: la sección no se renderiza; no reaparecen los cinco ítems de demostración.
- **Una a cinco** publicadas: grilla o fila completa, **sin** carrusel de tarjetas ni flechas innecesarias.
- **Más de cinco**: carrusel de tarjetas con flechas; el autoplay se pausa al enfocar, al pasar el puntero o si la persona pidió menos movimiento en el sistema.
- Fondo de sección en autoplay: misma pausa por interacción y por «menos movimiento»; el texto de la sección sigue leyéndose (contraste).
- Actividad **sin destinos**: publicable; la ficha no muestra un bloque de lugares vacío.
- Destino enlazado **eliminado** o despublicado: se omite el enlace; no hay URL rota visible.
- Categoría compartida por muchas actividades y destinos: no duplica fichas; solo etiqueta.
- Identificador de URL duplicado o no apto: se rechaza con mensaje en español.
- Pictograma que ya no está en el catálogo: en público se usa un pictograma de reserva y un texto visible (el título); en admin se pide elegir uno válido al guardar.
- Orden: la administradora define el orden de aparición en home; el carrusel de tarjetas respeta ese orden.
- Teclado y lector de pantalla: flechas del carrusel, pausa del autoplay y enlaces de destinos son operables sin ratón; el pictograma no es el único significado.
- Esta feature **no** sustituye el hub «Experiencias en naturaleza» ni los siete micrositios de Sucre Natural: son catálogos distintos que pueden enlazarse.
- Borrar una actividad no borra destinos ni categorías; solo quita asociaciones.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST reemplazar por completo el contenido de demostración de la sección «Qué hacer en Sucre» de la portada por actividades publicadas mantenidas en el CMS.
- **FR-002**: El sistema MUST permitir crear, editar, reordenar, publicar, despublicar y eliminar **actividades**. Campos de la actividad: título, descripción, identificador estable de URL, pictograma del catálogo, una o más fotos, orden, estado de publicación, categorías (cero o más) y destinos/fichas enlazados (cero o más).
- **FR-003**: El sistema MUST permitir crear, editar, reordenar y eliminar **categorías**. Una categoría MUST poder asociarse a varias actividades y a varios destinos/fichas; una actividad o un destino MUST poder pertenecer a varias categorías (relación de muchos a muchos en ambos sentidos).
- **FR-004**: Cada actividad publicada MUST mostrar en la portada **pictograma + título + descripción**. La tarjeta MUST apoyarse visualmente en una foto de la actividad (foto representativa).
- **FR-005**: Si hay **más de cinco** actividades publicadas, la portada MUST mostrarlas en un carrusel de tarjetas con controles anterior/siguiente y avance automático. Si hay cinco o menos, MUST mostrarlas todas sin ese carrusel de tarjetas.
- **FR-006**: La sección de la portada MUST tener un **fondo que recorre automáticamente** fotos de las actividades publicadas, pausable, y que no impida leer el encabezado ni las tarjetas.
- **FR-007**: Cada actividad MUST tener una **ficha pública** (URL estable) donde se recorren todas sus fotos en carrusel, se lee la descripción y, si aplica, se listan categorías y destinos/fichas enlazados.
- **FR-008**: Desde la tarjeta de la portada la visitante MUST poder abrir la ficha pública de esa actividad.
- **FR-009**: El pictograma MUST elegirse de un **catálogo cerrado** de iconos pictográficos turísticos (el mismo sistema de pictogramas ya usado en el sitio). El staff MUST NOT pegar un nombre de icono arbitrario fuera de ese catálogo.
- **FR-010**: Las fotos MUST tomarse del sistema de medios ya existente del sitio (elegir desde la galería o subir, dentro de los límites vigentes). Hace falta **al menos una foto** para publicar. El carrusel de la ficha respeta el orden definido en administración.
- **FR-011**: Una actividad MAY enlazarse a uno o más destinos o fichas del CMS de destinos / Sucre Natural. Solo se muestran en público destinos **publicados**. El enlace de vuelta (destino → actividades relacionadas) MUST existir cuando hay vínculo.
- **FR-012**: Las categorías MUST poder asignarse también a destinos/fichas existentes, sin crear un segundo catálogo de destinos. Asignar una categoría a un destino no lo publica ni lo oculta por sí solo.
- **FR-013**: Solo personal **admin** MAY crear, editar, publicar, despublicar o eliminar actividades y categorías. La lectura pública MUST limitarse a actividades publicadas (y a destinos ya públicos). Las editoras sin rol admin no administran este módulo en v1 (mismo criterio que Imperdibles y Sucre Natural).
- **FR-014**: Al guardar una actividad publicada, el sistema MUST actualizar de inmediato la portada y la ficha pública afectadas.
- **FR-015**: El sistema MUST validar en el límite de administración (longitudes, identificador de URL, pictograma del catálogo, al menos una foto al publicar, que los destinos enlazados existan). Los errores al público y al staff MUST estar en español y no filtrar detalles internos.
- **FR-016**: El sistema MUST cargar un **contenido inicial** equivalente a los cinco ítems de demostración actuales (Playas, Cultura, Gastronomía, Naturaleza, Experiencias), como categorías y/o actividades editables, para que la portada no quede vacía al retirar el mock. La carga MUST ser repetible sin duplicar el mismo identificador.
- **FR-017**: El módulo MUST permanecer distinto del hub «Experiencias en naturaleza» y de los micrositios Sucre Natural. No se reutilizan esos hubs como si fueran este CMS.
- **FR-018**: Los identificadores de URL de actividades MUST quedar listos para que, en features posteriores, las rutas/itinerarios y los favoritos los citen. Esta feature MUST NOT implementar itinerarios, favoritos, mapa unificado ni la base de conocimiento del asistente.
- **FR-019**: Los carruseles con avance automático MUST ofrecer control de pausa y MUST respetar la preferencia de menos movimiento del sistema.
- **FR-020**: Si una foto deja de existir en el almacén de medios, la actividad MUST omitirla en público; si al publicar no queda ninguna foto válida, MUST impedirse la publicación o despublicar con aviso en admin.

### Non-Functional Requirements *(mandatory)*

- **NFR-001 (Maintainability)**: El CMS MUST reutilizar el patrón ya conocido de administración de destinos (listado, publicación, medios, mensajes en español) y MUST documentar que es un catálogo aparte de Sucre Natural. No se duplica un segundo almacén de destinos.
- **NFR-002 (Security)**: Toda mutación MUST exigir sesión de administradora. Medios e identificadores MUST validarse. No se exponen secretos en el cliente.
- **NFR-003 (Observability)**: Publicar, rechazar validación, eliminar o ejecutar la carga inicial MUST dejar registro diagnosticable (quién / qué / resultado) en las rutas críticas de administración.
- **NFR-004 (Performance)**: Una visitante en conexión urbana típica MUST ver el encabezado y las primeras tarjetas de «Qué hacer» en menos de 3 segundos; el autoplay de fondo no MUST bloquear ese primer contenido ni descargar de golpe un número ilimitado de fotos de alta resolución.
- **NFR-005 (Accessibility)**: Sección de portada, carruseles y ficha de actividad MUST ser operables por teclado. Fotos MUST tener texto alternativo. El pictograma MUST ir acompañado de título visible. Controles de carrusel y de pausa MUST tener nombre accesible. El texto sobre fotos o fondo MUST mantener contraste de lectura. El autoplay MUST pausarse con «menos movimiento».

### Key Entities *(include if feature involves data)*

- **Actividad**: Oferta de «qué hacer» (p. ej. playas, un recorrido gastronómico, una vivencia cultural). Atributos: título, descripción, identificador de URL, pictograma del catálogo, fotos ordenadas, orden en portada, publicado. Relaciones: N categorías, N destinos/fichas.
- **Categoría**: Etiqueta de agrupación reutilizable (p. ej. Playas, Cultura). Atributos: nombre, identificador, orden, texto breve opcional. Relaciones: N actividades, N destinos/fichas.
- **Destino / ficha (existente)**: Lugar del CMS de Imperdibles / Sucre Natural. Esta feature solo lo asocia; no redefine su ficha.
- **Foto de actividad**: Imagen del almacén de medios, con orden y texto alternativo, usada en tarjeta, ficha y fondo de sección.
- **Catálogo de pictogramas**: Lista cerrada de iconos elegibles en administración; cada actividad apunta a uno.
- **Carga inicial**: Volcado repetible de las cinco propuestas de demostración actuales a categorías/actividades editables, sin duplicar identificadores.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las visitas a la portada con al menos una actividad publicada muestra datos del CMS y **cero** ítems del mock anterior.
- **SC-002**: Una administradora crea, publica y verifica en la portada una actividad de prueba (campos mínimos + una foto + un pictograma) en menos de 8 minutos.
- **SC-003**: Con 6 actividades publicadas, el 100 % de las testers puede avanzar y retroceder el carrusel de tarjetas con teclado o puntero y pausar el autoplay en el primer intento.
- **SC-004**: El 100 % de las actividades despublicadas o sin foto válida deja de verse en la portada y en su URL pública en la siguiente visita.
- **SC-005**: En una prueba con 5 personas no técnicas, al menos 4 identifican en la ficha de una actividad con destinos enlazados al menos un lugar al que ir, en el primer minuto, sin instrucciones.
- **SC-006**: El 100 % de los flujos públicos (ver sección en portada → abrir actividad → abrir destino enlazado, cuando existe) es operable solo con teclado.
- **SC-007**: Reejecutar la carga inicial no crea actividades ni categorías duplicadas con el mismo identificador.
- **SC-008**: Una categoría puede listar al menos 2 actividades y 2 destinos a la vez, y cada uno de esos registros puede pertenecer a más de una categoría, comprobable en el panel.

## Assumptions

- Se trabaja sobre el CMS de destinos / fichas Sucre Natural ya especificado (prompt 2) y sobre la portada actual; no se rediseña todo el sitio.
- El copy de encabezado de la sección permanece: «Qué hacer en Sucre» y el subtítulo actual, salvo que el staff lo cambie más adelante (v1 no exige un formulario de textos de sección).
- Autorización: mismo umbral que Imperdibles (solo admin). Lectura pública sin cuenta.
- «Revalidar» significa que la visitante ve datos frescos tras publicar, sin esperar un ciclo largo de caché.
- El catálogo de pictogramas es un subconjunto cerrado (temática turística y cultural), no la biblioteca completa de iconos del mundo. Incluye como mínimo los cinco de la demostración actual (mar, cultura, gastronomía, naturaleza, experiencias).
- La foto representativa de la tarjeta de portada es la primera foto del orden definido, salvo que el admin marque otra como principal (si no hay marca, la primera).
- Tope razonable de fotos por actividad alineado a galerías existentes del sitio (decenas, no cientos); el fondo de sección usa un subconjunto (p. ej. la foto representativa de cada actividad publicada) para no saturar.
- Municipios y destinos siguen el alcance ya abierto en Sucre Natural; esta feature no limita a Sincelejo / Tolú / Coveñas / Sampués / Morroa.
- Idioma de interfaz y contenido inicial: español. El inglés (prompt 18) queda fuera.
- La carga inicial puede modelar los cinco ítems actuales **tanto** como categorías **como** actividades homónimas (una actividad «Playas» en la categoría «Playas»), para no vaciar la home y para ilustrar la relación. El staff podrá sustituirlas por actividades más granulares después.
- Enlazar destinos es opcional por actividad; no todas las categorías tendrán destinos al día uno.
- Rutas/itinerarios (prompt 12), favoritos (prompt 13), mapa unificado (prompt 11) y base de conocimiento del asistente (prompt 14) **no** se construyen aquí.
- No se crea un buscador ni un listado público aparte de la portada más allá de la ficha de cada actividad.

## Out of Scope

- Mapa interactivo unificado (prompt 11).
- Indexación para el asistente (prompt 14).
- Eventos / agenda cultural, convocatorias, footer, actores, guías, memoria cultural.
- Rutas e itinerarios y «Mi viaje» / favoritos (sí se dejan identificadores de URL listos).
- Multilingüe, analítica de plataforma, WCAG completo de todos los flujos del sitio (más allá de los NFR de esta feature).
- Convertir los hubs de Sucre Natural en este CMS, o fusionar «Experiencias en naturaleza» con «Qué hacer».
- Alta pública de actividades por visitantes o por el rol editor.
- Filtro público avanzado por categoría en la portada (las categorías se ven como etiquetas; un directorio filtrable puede ser una mejora posterior).

---
name: Sucre Vivo
description: Una postal viva del Caribe colombiano: teal, naranja y oro sobre papel crema, con fotografía aérea y tarjetas que se inclinan al tacto.
colors:
  teal-caribe: "hsl(174, 62%, 35%)"
  naranja-atardecer: "hsl(28, 85%, 55%)"
  oro-sol: "hsl(45, 93%, 58%)"
  coral-fiesta: "hsl(5, 72%, 60%)"
  arena-crema: "hsl(40, 33%, 97%)"
  tinta-profunda: "hsl(210, 25%, 12%)"
  lienzo-tenue: "hsl(40, 20%, 92%)"
  gris-bruma: "hsl(210, 10%, 45%)"
  linea-arena: "hsl(40, 15%, 88%)"
  superficie-blanca: "hsl(0, 0%, 100%)"
  alerta-rojo: "hsl(0, 84%, 60%)"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "12px"
  card: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.teal-caribe}"
    textColor: "{colors.superficie-blanca}"
    rounded: "{rounded.xl}"
    padding: "12px"
  suggestion-pill:
    backgroundColor: "hsla(0, 0%, 100%, 0.10)"
    textColor: "hsla(0, 0%, 100%, 0.70)"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-tipo:
    backgroundColor: "hsla(28, 85%, 55%, 0.10)"
    textColor: "{colors.naranja-atardecer}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  card-convocatoria:
    backgroundColor: "{colors.superficie-blanca}"
    textColor: "{colors.tinta-profunda}"
    rounded: "{rounded.card}"
    padding: "24px"
  card-actividad:
    backgroundColor: "{colors.superficie-blanca}"
    textColor: "{colors.superficie-blanca}"
    rounded: "{rounded.card}"
---

# Design System: Sucre Vivo

## Overview

**Creative North Star: "La postal viva"**

Sucre Vivo es una postal del Caribe colombiano que cobra vida. La fotografía aérea de la costa abre la página con luz cálida; debajo, una paleta de teal, naranja y oro sobre papel crema mantiene el tono luminoso, y las tarjetas se inclinan en 3D con retorno elástico al pasar el cursor. El ánimo es cálido, luminoso y juguetón: el movimiento es parte de la personalidad, no un adorno.

La densidad es media y espaciosa. Los títulos serif (Playfair) dan carácter editorial y la sans (DM Sans) mantiene el texto funcional ligero. El color se reparte por rol: el teal manda en acciones, el naranja y el coral marcan acentos y urgencia, y el oro es el destello sobre foto. Las superficies son planas en reposo; la profundidad aparece solo como respuesta a la interacción.

**Key Characteristics:**
- Fotografía a pantalla completa como protagonista del primer pliegue.
- Papel crema (`arena-crema`) como lienzo, no blanco puro.
- Titulares serif con una palabra clave resaltada en color.
- Elevación y rotación 3D solo al interactuar (tilt, sombra difusa).
- Vidrio esmerilado únicamente sobre fotografía.
- Movimiento con curvas expo-out y retorno elástico puntual en las tarjetas.

## Colors

Paleta tropical cálida: tres acentos saturados (teal, naranja, oro) sobre neutros arena y tinta azulada. Todo está definido como variables HSL en `:root` (`globals.css`) y expuesto en Tailwind como `primary`, `secondary`, `accent` y `tropical-*`.

### Primary
- **Teal Caribe** (hsl(174, 62%, 35%)): acción principal, enlaces, foco (`--ring`), botón de enviar del hero y degradado del hero. Es el color de "avanza".

### Secondary
- **Naranja Atardecer** (hsl(28, 85%, 55%)): palabra clave de títulos de sección, chips y etiquetas cálidas.
- **Oro Sol** (hsl(45, 93%, 58%)): destellos sobre foto (palabra "Sucre" del H1, iconos del hero). Con texto oscuro encima es el acento `accent`.

### Tertiary
- **Coral Fiesta** (hsl(5, 72%, 60%)): fechas límite, urgencia y acentos de cultura.

### Neutral
- **Arena Crema** (hsl(40, 33%, 97%)): fondo de página.
- **Lienzo Tenue** (hsl(40, 20%, 92%)): fondos alternos y de respaldo.
- **Línea Arena** (hsl(40, 15%, 88%)): bordes y divisores.
- **Tinta Profunda** (hsl(210, 25%, 12%)): texto principal y velos sobre foto.
- **Gris Bruma** (hsl(210, 10%, 45%)): texto secundario.
- **Superficie Blanca** (hsl(0, 0%, 100%)): tarjetas.
- **Alerta Rojo** (hsl(0, 84%, 60%)): errores y acciones destructivas.

### Named Rules
**The Tinted Sand Rule.** El fondo nunca es blanco puro ni gris frío: es arena crema. El blanco puro queda para tarjetas elevadas.

**The Sun Only On Photo Rule.** El oro se usa sobre fotografía u oscuro; sobre crema no tiene contraste suficiente para texto.

**The Hub Accent Rule.** Las fichas de Sucre Natural usan un acento propio por tema (`data-hub`: playas teal, ciénagas verde, ríos tierra, paisajes verde oscuro, biodiversidad ámbar, senderos violeta, experiencias terracota) sobre el papel `sn-paper` y la tinta `sn-ink`.

## Typography

**Display Font:** Playfair Display (con serif de respaldo)
**Body Font:** DM Sans (con sans-serif de respaldo)

**Character:** Un serif editorial de alto contraste para los titulares, con una sans geométrica y amable para todo lo funcional. Se cargan por `next/font` como `--font-display` y `--font-body`, y los `h1`-`h6` usan display por defecto.

### Hierarchy
- **Display** (700, `text-4xl` a `md:text-7xl`, line-height 1.1): H1 del hero, en blanco con la palabra clave en oro.
- **Headline** (700, `text-3xl` a `md:text-5xl`): H2 de sección con una palabra clave en color.
- **Title** (700, 1.125rem): título de tarjetas.
- **Body** (400, 1rem a 1.25rem, `muted-foreground` para apoyo): párrafos y subtítulos de sección, con ancho máximo `max-w-xl` o `max-w-2xl`.
- **Label** (500, 0.875rem): chips, píldoras y enlaces de acción.

### Named Rules
**The One Colored Word Rule.** Un titular lleva como máximo una palabra resaltada en color. (Hoy el color elegido varía entre secciones sin criterio fijo.)

## Layout

Una sola columna centrada, con secciones apiladas y fondo alterno. Cada sección usa `.section-padding` (4rem 1rem en móvil; 2rem laterales desde 768px; 6rem 4rem desde 1024px) y un contenedor `max-w-7xl`. Cabecera de sección centrada con título y subtítulo, y debajo una rejilla de 2 a 5 columnas según contenido: 5 en Qué hacer, 2 en Convocatorias.

El hero ocupa la pantalla (`min-h-screen`) con el contenido centrado en `max-w-4xl`. En móvil las rejillas colapsan a 1 o 2 columnas. Hay un rail de progreso lateral y un botón flotante del chat.

## Elevation & Depth

Híbrido: planas en reposo, con elevación en respuesta a la interacción. Las tarjetas (`tilt-card`) llevan una sombra difusa fija y, al pasar el cursor, rotan en 3D con perspectiva y desplazan la sombra con un retorno tipo resorte. El vidrio esmerilado se reserva para elementos sobre foto.

### Shadow Vocabulary
- **Sombra de tarjeta** (`box-shadow: var(--tilt-shadow-x) var(--tilt-shadow-y) 32px -14px hsla(210, 25%, 12%, 0.3)`): reposo y hover de las tarjetas con tilt.
- **Vidrio sobre foto** (`background: hsla(0,0%,100%,.15); backdrop-filter: blur(12px); border: 1px solid hsla(0,0%,100%,.25)`): campo del chat en el hero.

### Named Rules
**The Flat Until Touched Rule.** En reposo no hay inclinación ni elevación extra; el tilt solo responde al puntero y se desactiva con `prefers-reduced-motion`.

## Shapes

Esquinas generosas y amistosas. La base es `--radius` 0.75rem (12px): tarjetas a `rounded-2xl` (16px), botones y campos a `rounded-xl` (12px), píldoras y chips totalmente redondeados. Los bordes son de un píxel en `linea-arena`. No hay formas angulosas ni recortes.

## Components

### Buttons
- **Shape:** esquina suave (12px).
- **Primary:** fondo Teal Caribe, texto blanco, padding 12px; en el hero es un botón cuadrado con icono de enviar.
- **Hover / Focus:** fondo al 90 % de opacidad; el foco usa el anillo teal.

### Chips
- **Píldora sobre foto:** fondo blanco al 10 %, texto blanco al 70 %, desenfoque; al pasar el cursor sube al 20 % y el texto a blanco pleno.
- **Chip de categoría:** fondo del color de acento al 10 %, texto del acento y borde al 20 %. El color se deriva de un hash del texto (sin diccionario fijo).

### Cards / Containers
- **Corner Style:** 16px.
- **Actividad (Qué hacer):** cuadrada, foto de fondo con velo `foreground` al 55 %, icono, título serif blanco y descripción pequeña; zoom suave de la imagen al hover.
- **Convocatoria:** fondo blanco, borde de un píxel, padding 24px, chip de tipo, fecha límite en coral y enlace en teal.
- **Shadow Strategy:** ver Elevation & Depth.

### Inputs / Fields
- **Style:** campo de vidrio sobre foto, transparente, texto blanco con marcador al 50 %.
- **Focus:** sin contorno nativo; el foco depende del contenedor (a revisar).

### Navigation
- Enlaces con subrayado al hover, rail de progreso lateral que marca la sección activa y botón flotante del chat con burbuja de introducción.

### Tarjeta con tilt (signature)
Tarjeta que se inclina hasta unos grados hacia el cursor con perspectiva de 900px y retorno elástico `cubic-bezier(0.16, 1.4, 0.3, 1)`. Es el rasgo distintivo de la interacción actual.

## Do's and Don'ts

### Do:
- **Do** usar el Teal Caribe para acciones primarias y foco.
- **Do** mantener Arena Crema como lienzo y reservar el blanco para tarjetas.
- **Do** resaltar una sola palabra clave en cada titular serif.
- **Do** respetar `prefers-reduced-motion` en tilt, autoplay y transiciones.
- **Do** usar los tokens (`primary`, `secondary`, `tropical-*`) en lugar de colores literales.

### Don't:
- **Don't** usar texto en oro sobre fondo crema: no alcanza contraste.
- **Don't** añadir sombras en reposo a las tarjetas: la elevación responde a la interacción.
- **Don't** usar blanco puro ni gris frío como fondo de página.
- **Don't** mezclar más de un acento de color en un mismo titular.
- **Don't** reformatear a mano `src/components/ui` (shadcn).

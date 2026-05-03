# Feature Specification: Destinos imperdibles (CMS)

**Feature Branch**: `[005-destinos-imperdibles-cms]`  
**Created**: 2026-05-03  
**Status**: Implemented  

## User stories

### P1 – Administrar destinos
Un administrador accede a Personalizar → Destinos imperdibles, crea o edita ítems con imagen (galería o subida), título, subtítulo, cuerpo en Markdown, coordenadas para el mapa y publicación.

### P2 – Sección en la home
Los visitantes ven la sección con datos de BD: modo **tres destacados** (rejilla) o **carrusel** con autoplay y flechas; el orden puede ser **manual** (`sortOrder`) o **aleatorio** (mezcla en servidor por petición).

### P3 – Detalle del destino
Al pulsar la tarjeta o «Explorar», se abre `/imperdibles/[slug]` con Markdown renderizado y mapa Google (embed con clave) o enlace externo si no hay clave.

## Requirements

- Modelos `ImperdibleDestination` e `ImperdiblesSectionSettings` (singleton).
- Solo administradores para CRUD; lectura pública solo `published`.
- Borrado en galería bloqueado si la URL está en uso en un destino.
- Máximo **20** destinos publicados recomendado en spec de rendimiento; técnico sin tope duro salvo validación razonable en create.

## Success criteria

- Tras guardar, la home y el detalle reflejan los cambios (revalidación).
- Carrusel: autoplay configurable y navegación con flechas.
- Sin clave de Maps: el detalle muestra alternativa (enlace «Abrir en Google Maps»).

# Feature Specification: Galería de medios y selector en banner

**Feature Branch**: `[004-galeria-medios]`  
**Created**: 2026-05-03  
**Status**: Draft  

## User stories

### P1 – Administrar galería
Un administrador accede a Personalizar → Galería, sube imágenes (JPEG/PNG/WebP) o vídeos (MP4/WebM), ve la lista en rejilla y elimina ítems que no estén en uso en el banner del hero.

### P2 – Banner usa galería o sube nuevo
En Banner principal, para imagen custom, vídeo por archivo y slides del carrusel, el administrador puede **elegir un archivo ya existente en la galería** o **subir uno nuevo** que queda registrado en la galería.

### P3 – Borrado seguro
Si un medio está referenciado por la configuración actual del hero (imagen, vídeo o slide del carrusel), el sistema **impide borrarlo** y muestra un mensaje claro.

## Requirements

- Persistencia en BD (`GalleryAsset`) y disco bajo `/uploads/gallery/`.
- Rutas públicas permitidas en validación del hero: `/uploads/hero/` (legado) y `/uploads/gallery/`.
- Solo rol administrador para CRUD de galería y sin cambio en política del banner.

## Success criteria

- Tras subir desde el banner, el archivo aparece en Galería y la URL es válida para guardar.
- Intento de borrar un asset en uso falla sin borrar fichero ni fila.

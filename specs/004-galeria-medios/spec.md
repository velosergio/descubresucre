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

### P3.1 – Limpieza de huérfanos
Un administrador puede ejecutar una limpieza que elimina filas de `GalleryAsset` cuyo archivo físico ya no existe en `public/uploads/gallery/...`, sin afectar archivos válidos.

## Requirements

- Persistencia en BD (`GalleryAsset`) y disco bajo `/uploads/gallery/`.
- Rutas públicas permitidas en validación del hero: `/uploads/hero/` (legado) y `/uploads/gallery/`.
- Solo rol administrador para CRUD de galería y sin cambio en política del banner.
- Entrega de medios subidos por ruta API (`/api/media?src=...`) para evitar dependencia de ruteo estático de `/uploads/...` en producción.
- Optimización de imagen al subir: imágenes raster se guardan como WebP optimizado.
- Debe existir acción de limpieza de huérfanos invocable desde la UI de galería.

## Success criteria

- Tras subir desde el banner, el archivo aparece en Galería y la URL es válida para guardar.
- Intento de borrar un asset en uso falla sin borrar fichero ni fila.
- Si un registro apunta a archivo inexistente, no rompe la vista y puede eliminarse con la rutina de limpieza.

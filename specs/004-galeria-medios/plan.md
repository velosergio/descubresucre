# Plan: Galería de medios

**Spec**: [spec.md](./spec.md)

## Summary

Modelo `GalleryAsset`, acciones list/upload/delete con comprobación de referencias en `HeroAppearanceSettings`, página `/admin/personalizar/galeria`, componente `GalleryPickerDialog` integrado en `HeroBannerSettingsForm`, límites centralizados en `src/lib/upload-limits.ts`.

Se añade rutina de limpieza de registros huérfanos (fila en BD sin archivo físico) y servicio de medios por API (`/api/media?src=...`) para desacoplar la entrega de archivos de `/uploads/...` del ruteo estático del entorno.

## Technical notes

- Referencias hero: comparar `publicUrl` con `heroImageUrl`, `heroVideoUrl` y cada `url` en `carouselSlides` JSON.
- Archivos: `public/uploads/gallery/images`, `public/uploads/gallery/video`.
- Optimización de imágenes: se realiza al subir (conversión a WebP). En render de rutas `/uploads/...` se usa entrega directa sin optimizador dinámico de Next.
- Limpieza de huérfanos: acción server `cleanupGalleryOrphansAction` con botón en UI de galería.

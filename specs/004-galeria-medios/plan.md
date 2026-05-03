# Plan: Galería de medios

**Spec**: [spec.md](./spec.md)

## Summary

Modelo `GalleryAsset`, acciones list/upload/delete con comprobación de referencias en `HeroAppearanceSettings`, página `/admin/personalizar/galeria`, componente `GalleryPickerDialog` integrado en `HeroBannerSettingsForm`, límites centralizados en `src/lib/upload-limits.ts`.

## Technical notes

- Referencias hero: comparar `publicUrl` con `heroImageUrl`, `heroVideoUrl` y cada `url` en `carouselSlides` JSON.
- Archivos: `public/uploads/gallery/images`, `public/uploads/gallery/video`.

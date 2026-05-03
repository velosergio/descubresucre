# Plan: Destinos imperdibles CMS

**Spec**: [spec.md](./spec.md)

## Summary

Persistencia en MySQL vía Prisma, server actions bajo `assertAdminAction`, UI admin con `GalleryPickerDialog` + subida, textarea Markdown con vista previa, coordenadas numéricas; home con `ImperdiblesSection` (client) para carrusel Embla + `embla-carousel-autoplay`; detalle con `react-markdown` e iframe Maps Embed API.

## Technical notes

- Aleatorio: `shuffle` en servidor al resolver la lista para la home (cada request puede variar).
- Referencias galería: función pura `isGalleryUrlReferencedByImperdibles(urls[], needle)` usada en `deleteGalleryAssetAction`.
- P1 mapa admin: lat/lng + zoom en inputs; P2 futuro: picker JS Maps.

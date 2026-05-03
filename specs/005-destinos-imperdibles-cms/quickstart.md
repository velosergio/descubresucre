# Quickstart: Destinos imperdibles

## Variables de entorno

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (opcional): habilita iframe **Maps Embed API** en la página de detalle. En Google Cloud Console, activar «Maps Embed API» y restringir por HTTP referrer del sitio.

Sin clave, el detalle muestra un botón/enlace «Abrir en Google Maps» con `query=lat,lng`.

## Admin

1. Personalizar → Galería (opcional): subir imágenes.
2. Personalizar → Destinos imperdibles: ajustar modo rejilla/carrusel y orden; crear destinos con slug único.

## Migración

Tras pull: `npx prisma migrate dev` (o `deploy` en CI) y `npm install` si se añadió `embla-carousel-autoplay`.

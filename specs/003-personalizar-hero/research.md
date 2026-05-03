# Research: Personalizar hero

## Decisiones

1. **Almacenamiento de archivos**: Carpeta pública `public/uploads/hero/images` y `public/uploads/hero/video` con nombres UUID; URLs guardadas en DB como rutas absolutas del sitio (`/uploads/...`).
2. **Next/Image**: Rutas bajo `/uploads` son locales; URLs HTTPS externas en carrusel se renderizan con `<img>` para evitar configurar `remotePatterns` por cada dominio, manteniendo validación HTTPS en guardado.
3. **Vídeo externo**: Elemento `<video src={url}>` con fallback a imagen por defecto en `onError`.
4. **Autoplay carrusel**: `setApi` + `setInterval` para `scrollNext` cada 6s con cleanup (sin dependencia nueva).

## Alternativas descartadas

- **Solo URL sin subida**: No cumple requisito de subida local.
- **Blob/Vercel Blob**: Añade dependencia y configuración; posible migración posterior.

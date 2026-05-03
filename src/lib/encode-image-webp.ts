import sharp from "sharp";

export const HERO_WEBP_MAX_EDGE = 2560;
export const GALLERY_WEBP_MAX_EDGE = 2048;

/**
 * Convierte una imagen raster a WebP (orientación EXIF, redimensiona al límite, compresión).
 * Usar en server actions; no importar en el cliente.
 */
export async function encodeRasterImageToWebp(
  input: Buffer,
  options: { maxEdge: number; quality?: number },
): Promise<Buffer> {
  const quality = options.quality ?? 82;
  return sharp(input)
    .rotate()
    .resize({
      width: options.maxEdge,
      height: options.maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 4, smartSubsample: true })
    .toBuffer();
}

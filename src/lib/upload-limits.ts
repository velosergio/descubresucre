/** Límites compartidos: hero y galería (alinear con serverActions.bodySizeLimit). */

export const MAX_UPLOAD_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_UPLOAD_VIDEO_BYTES = 80 * 1024 * 1024;

export const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const VIDEO_MIME_TO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

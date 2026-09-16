import { z } from "zod";
import { isQueHacerIconKey } from "@/lib/que-hacer-icons";
import { QUE_HACER_MAX_PHOTOS } from "@/lib/que-hacer-photos";
import {
  galleryImageUrlSchema,
  SLUG_REGEX,
  slugSchema,
} from "@/lib/sucre-natural-destination-schema";

export { SLUG_REGEX, slugSchema };

export const queHacerActivitySchema = z
  .object({
    title: z.string().trim().min(1, "El título es obligatorio.").max(120, "Máximo 120 caracteres."),
    description: z
      .string()
      .trim()
      .min(1, "La descripción es obligatoria.")
      .max(1000, "Máximo 1000 caracteres."),
    slug: z
      .string()
      .max(160)
      .optional()
      .transform((s) => (s?.trim() ? s.trim() : undefined))
      .refine((s) => s == null || SLUG_REGEX.test(s), "Slug: solo minúsculas, números y guiones."),
    iconKey: z
      .string()
      .trim()
      .min(1, "Elige un pictograma del catálogo.")
      .refine((k) => isQueHacerIconKey(k), "Pictograma no permitido."),
    published: z.coerce.boolean(),
    sortOrder: z.coerce.number().int().default(0),
    photoUrls: z
      .array(galleryImageUrlSchema)
      .max(QUE_HACER_MAX_PHOTOS, "Puedes añadir hasta 12 fotos."),
    coverUrl: z.string().optional(),
    photoAlts: z.array(z.string().max(300).nullable()).optional().default([]),
    categoryIds: z.array(z.string()).optional().default([]),
    destinationIds: z.array(z.string()).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.published && data.photoUrls.length < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Publica al menos una foto de la galería.",
      });
    }
    if (data.coverUrl?.trim() && !data.photoUrls.includes(data.coverUrl.trim())) {
      ctx.addIssue({
        code: "custom",
        path: ["coverUrl"],
        message: "La foto de portada debe estar entre las fotos de la actividad.",
      });
    }
  });

export const queHacerCategorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(120, "Máximo 120 caracteres."),
  slug: z
    .string()
    .max(160)
    .optional()
    .transform((s) => (s?.trim() ? s.trim() : undefined))
    .refine((s) => s == null || SLUG_REGEX.test(s), "Slug: solo minúsculas, números y guiones."),
  description: z
    .string()
    .max(500)
    .optional()
    .transform((s) => {
      const t = s?.trim();
      return t ? t : null;
    }),
  sortOrder: z.coerce.number().int().default(0),
});

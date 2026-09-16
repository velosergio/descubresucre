import { z } from "zod";
import { isSucreNaturalHubId, SUCRE_NATURAL_HUB_IDS } from "@/lib/sucre-natural-hubs";

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LIVE_ACTIVITY_ICON_KEYS = [
  "waves",
  "fish",
  "binoculars",
  "sun",
  "utensils",
  "users",
  "ship",
  "tree",
  "camera",
  "moon",
  "mountain",
  "droplet",
  "bird",
  "footprints",
  "compass",
] as const;

export type LiveActivityIconKey = (typeof LIVE_ACTIVITY_ICON_KEYS)[number];

const ICON_SET = new Set<string>(LIVE_ACTIVITY_ICON_KEYS);

export function isLiveActivityIconKey(value: string): value is LiveActivityIconKey {
  return ICON_SET.has(value);
}

export const galleryImageUrlSchema = z
  .string()
  .max(2048)
  .refine(
    (u) => u.startsWith("/uploads/gallery/images/") && !u.includes(".."),
    "Imagen: debe ser una ruta de galería válida (/uploads/gallery/images/…).",
  );

const optionalGalleryImage = z
  .union([z.string(), z.null(), z.undefined()])
  .optional()
  .transform((v) => {
    if (v == null) return null;
    const t = v.trim();
    return t ? t : null;
  })
  .superRefine((u, ctx) => {
    if (u == null) return;
    const parsed = galleryImageUrlSchema.safeParse(u);
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        message: parsed.error.issues[0]?.message ?? "Imagen inválida.",
      });
    }
  });

const optionalCoord = z
  .union([z.literal(""), z.null(), z.undefined(), z.coerce.number()])
  .optional()
  .transform((v) => {
    if (v === "" || v == null) return null;
    if (typeof v === "number" && Number.isNaN(v)) return null;
    return v as number;
  });

export const slugSchema = z
  .string()
  .min(1, "El identificador de URL es obligatorio.")
  .max(160, "El identificador de URL no puede superar 160 caracteres.")
  .regex(SLUG_REGEX, "Slug: solo minúsculas, números y guiones.");

const liveActivitySchema = z.object({
  title: z.string().trim().min(1).max(80, "Cada actividad puede tener hasta 80 caracteres."),
  iconKey: z
    .string()
    .optional()
    .transform((s) => s?.trim() || undefined)
    .refine((k) => !k || isLiveActivityIconKey(k), "Icono de actividad no permitido."),
});

export const sucreNaturalDestinationSchema = z
  .object({
    title: z.string().min(1, "El título es obligatorio.").max(200),
    subtitle: z.string().max(500).default(""),
    slug: z
      .string()
      .max(160)
      .optional()
      .transform((s) => (s?.trim() ? s.trim() : undefined))
      .refine((s) => s == null || SLUG_REGEX.test(s), "Slug: solo minúsculas, números y guiones."),
    cardImageUrl: optionalGalleryImage,
    bodyMarkdown: z.string().max(100_000).default(""),
    mapLat: optionalCoord,
    mapLng: optionalCoord,
    mapZoom: z.coerce.number().int().gte(1).lte(21).default(14),
    published: z.coerce.boolean(),
    showOnHome: z.coerce.boolean().default(false),
    sortOrder: z.coerce.number().int().default(0),
    municipality: z.string().max(200).optional().nullable(),
    region: z.string().max(200).optional().nullable(),
    locationLabel: z.string().max(300).optional().nullable(),
    ecosystems: z.string().max(500).optional().nullable(),
    approach: z.string().max(500).optional().nullable(),
    specialWhy: z.string().max(20_000).optional().nullable(),
    howToArrive: z.string().max(20_000).optional().nullable(),
    climate: z.string().max(300).optional().nullable(),
    recommendedTime: z.string().max(300).optional().nullable(),
    audience: z.string().max(300).optional().nullable(),
    mapNote: z.string().max(500).optional().nullable(),
    liveActivities: z
      .array(liveActivitySchema)
      .max(12, "Puedes añadir hasta 12 actividades.")
      .optional()
      .default([]),
    responsibleTips: z.array(z.string().max(400)).optional().default([]),
    biodiversityChipLabels: z.array(z.string().max(80)).optional().default([]),
    hubIds: z.array(z.string()).default([]),
    galleryUrls: z.array(galleryImageUrlSchema).optional().default([]),
    sourceIds: z.array(z.string()).optional().default([]),
    biodiversityIds: z.array(z.string()).optional().default([]),
    experienceIds: z.array(z.string()).optional().default([]),
    queHacerCategoryIds: z.array(z.string()).optional().default([]),
  })
  .superRefine((data, ctx) => {
    const hasLat = data.mapLat != null;
    const hasLng = data.mapLng != null;
    if (hasLat !== hasLng) {
      ctx.addIssue({
        code: "custom",
        message: "Indica latitud y longitud juntas, o deja ambas vacías.",
      });
    }
    const lat = data.mapLat;
    const lng = data.mapLng;
    if (hasLat && lat != null && (lat < -90 || lat > 90)) {
      ctx.addIssue({ code: "custom", message: "Latitud fuera de rango (−90 a 90)." });
    }
    if (hasLng && lng != null && (lng < -180 || lng > 180)) {
      ctx.addIssue({ code: "custom", message: "Longitud fuera de rango (−180 a 180)." });
    }
    const municipality = data.municipality?.trim();
    if (!municipality && data.hubIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Indica el municipio o asigna al menos un tema de Sucre Natural.",
      });
    }
    for (const id of data.hubIds) {
      if (!isSucreNaturalHubId(id)) {
        ctx.addIssue({
          code: "custom",
          message: `Hub desconocido: ${id}. Solo se admiten los siete temas de Sucre Natural.`,
        });
      }
    }
  });

export const sucreNaturalHubSaveSchema = z.object({
  id: z.string().refine((id) => SUCRE_NATURAL_HUB_IDS.includes(id as never), "Hub desconocido."),
  title: z.string().min(1).max(200),
  tagline: z.string().max(500).optional().nullable(),
  introMarkdown: z.string().max(20_000).optional().nullable(),
  coverImageUrl: optionalGalleryImage,
});

export const biodiversityEntrySchema = z.object({
  slug: slugSchema,
  kind: z.enum(["FAUNA", "FLORA", "ECOSYSTEM"], { message: "Tipo de ficha inválido." }),
  groupKey: z.string().min(1).max(80),
  commonName: z.string().min(1).max(200),
  scientificName: z.string().max(200).optional().nullable(),
  summary: z.string().min(1).max(20_000),
  whereFound: z.string().max(20_000).optional().nullable(),
  imageUrl: optionalGalleryImage,
  published: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  destinationIds: z.array(z.string()).optional().default([]),
});

export const natureExperienceSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(200),
  tagline: z.string().max(500).optional().nullable(),
  whereText: z.string().max(20_000).optional().nullable(),
  whatYouDo: z.array(z.string().max(400)).optional().default([]),
  specialWhy: z.string().max(20_000).optional().nullable(),
  recommendations: z.array(z.string().max(400)).optional().default([]),
  imageUrl: optionalGalleryImage,
  published: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  destinationIds: z.array(z.string()).optional().default([]),
});

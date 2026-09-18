import { z } from "zod";

export const culturalEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "El título es obligatorio.")
      .max(200, "El título no puede superar 200 caracteres."),
    description: z.string().trim().min(1, "La descripción es obligatoria."),
    category: z
      .string()
      .trim()
      .min(1, "La categoría es obligatoria.")
      .max(80, "La categoría no puede superar 80 caracteres."),
    location: z
      .string()
      .trim()
      .min(1, "El lugar es obligatorio.")
      .max(300, "El lugar no puede superar 300 caracteres."),
    startsAt: z.coerce
      .date()
      .refine((d) => !Number.isNaN(d.getTime()), "La fecha de inicio es obligatoria."),
    endsAt: z.coerce.date().nullable().optional(),
    allDay: z.coerce.boolean().default(true),
    imageUrl: z.string().max(2048).nullable().optional(),
    mapLat: z.coerce.number().nullable().optional(),
    mapLng: z.coerce.number().nullable().optional(),
    published: z.coerce.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.endsAt != null && data.endsAt.getTime() < data.startsAt.getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "La fecha de fin no puede ser anterior a la de inicio.",
      });
    }

    const lat = data.mapLat ?? null;
    const lng = data.mapLng ?? null;
    if ((lat == null) !== (lng == null)) {
      ctx.addIssue({
        code: "custom",
        path: ["mapLat"],
        message: "Completa ambas coordenadas o ninguna.",
      });
    }
    if (lat != null && (lat < -90 || lat > 90)) {
      ctx.addIssue({
        code: "custom",
        path: ["mapLat"],
        message: "Latitud fuera de rango (−90 a 90).",
      });
    }
    if (lng != null && (lng < -180 || lng > 180)) {
      ctx.addIssue({
        code: "custom",
        path: ["mapLng"],
        message: "Longitud fuera de rango (−180 a 180).",
      });
    }
  });

export type CulturalEventInput = z.infer<typeof culturalEventSchema>;

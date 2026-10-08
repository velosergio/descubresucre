import { z } from "zod";
import { startOfUtcDay } from "@/lib/convocatoria-deadline";

const REQUIRED_MSG =
  "Completa los campos obligatorios: título, descripción, audiencia, tipo, fecha límite y enlace.";

const URL_MSG = "El enlace debe ser una URL válida que empiece por http:// o https://.";

export const convocatoriaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, REQUIRED_MSG)
    .max(200, "El título no puede superar 200 caracteres."),
  description: z.string().trim().min(1, REQUIRED_MSG),
  audience: z
    .string()
    .trim()
    .min(1, REQUIRED_MSG)
    .max(200, "La audiencia no puede superar 200 caracteres."),
  type: z.string().trim().min(1, REQUIRED_MSG).max(80, "El tipo no puede superar 80 caracteres."),
  deadline: z.coerce
    .date()
    .refine((d) => !Number.isNaN(d.getTime()), REQUIRED_MSG)
    .transform((d) => startOfUtcDay(d)),
  externalUrl: z
    .string()
    .trim()
    .min(1, REQUIRED_MSG)
    .max(2048, "El enlace no puede superar 2048 caracteres.")
    .url(URL_MSG)
    .refine((url) => {
      try {
        const proto = new URL(url).protocol;
        return proto === "http:" || proto === "https:";
      } catch {
        return false;
      }
    }, URL_MSG),
  published: z.coerce.boolean().default(true),
});

export type ConvocatoriaInput = z.infer<typeof convocatoriaSchema>;

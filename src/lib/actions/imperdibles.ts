"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ImperdiblesDisplayMode, ImperdiblesItemOrder } from "@/generated/prisma";
import { assertAdminAction } from "@/lib/auth-helpers";
import { IMPERDIBLES_HOME_MAX_ITEMS } from "@/lib/imperdibles-public";
import { slugifyImperdible } from "@/lib/imperdibles-slug";
import { prisma } from "@/lib/prisma";

const slugSchema = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: solo minúsculas, números y guiones.");

const cardImageSchema = z
  .string()
  .min(1)
  .max(2048)
  .refine(
    (u) => u.startsWith("/uploads/gallery/images/") && !u.includes(".."),
    "Imagen: debe ser una ruta de galería válida.",
  );

const destinationBaseSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500),
  slug: z
    .string()
    .max(160)
    .optional()
    .transform((s) => (s?.trim() ? s.trim() : undefined)),
  cardImageUrl: cardImageSchema,
  bodyMarkdown: z.string().max(100_000),
  mapLat: z.coerce.number().gte(-90).lte(90),
  mapLng: z.coerce.number().gte(-180).lte(180),
  mapZoom: z.coerce.number().int().gte(1).lte(21).default(14),
  published: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().default(0),
});

const sectionSchema = z.object({
  displayMode: z.enum(["GRID_THREE", "CAROUSEL"]),
  itemOrder: z.enum(["MANUAL", "RANDOM"]),
  headingTitle: z.string().max(200).nullable(),
  headingSubtitle: z.string().max(500).nullable(),
  carouselIntervalMs: z.coerce.number().int().min(2000).max(60_000).default(5000),
});

export async function saveImperdiblesSectionAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = sectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const d = parsed.data;
  await prisma.imperdiblesSectionSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      displayMode: d.displayMode as ImperdiblesDisplayMode,
      itemOrder: d.itemOrder as ImperdiblesItemOrder,
      headingTitle: d.headingTitle ?? null,
      headingSubtitle: d.headingSubtitle ?? null,
      carouselIntervalMs: d.carouselIntervalMs,
    },
    update: {
      displayMode: d.displayMode as ImperdiblesDisplayMode,
      itemOrder: d.itemOrder as ImperdiblesItemOrder,
      headingTitle: d.headingTitle ?? null,
      headingSubtitle: d.headingSubtitle ?? null,
      carouselIntervalMs: d.carouselIntervalMs,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/personalizar/destinos-imperdibles");
  return { ok: true as const };
}

async function assertPublishedLimit(excludeId: string | null, willBePublished: boolean) {
  if (!willBePublished) return { ok: true as const };
  const count = await prisma.imperdibleDestination.count({
    where: { published: true, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
  });
  if (count >= IMPERDIBLES_HOME_MAX_ITEMS) {
    return {
      ok: false as const,
      error: `Solo puedes tener hasta ${IMPERDIBLES_HOME_MAX_ITEMS} destinos publicados.`,
    };
  }
  return { ok: true as const };
}

export async function createImperdibleDestinationAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = destinationBaseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const raw = parsed.data;
  const slugCandidate = raw.slug?.trim()
    ? raw.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : slugifyImperdible(raw.title);
  const slugParsed = slugSchema.safeParse(slugCandidate || "destino");
  if (!slugParsed.success) {
    return { ok: false as const, error: slugParsed.error.issues[0]?.message ?? "Slug inválido" };
  }
  const slug = slugParsed.data;

  const limit = await assertPublishedLimit(null, raw.published);
  if (!limit.ok) return limit;

  try {
    const row = await prisma.imperdibleDestination.create({
      data: {
        slug,
        title: raw.title,
        subtitle: raw.subtitle,
        cardImageUrl: raw.cardImageUrl,
        bodyMarkdown: raw.bodyMarkdown,
        mapLat: raw.mapLat,
        mapLng: raw.mapLng,
        mapZoom: raw.mapZoom,
        published: raw.published,
        sortOrder: raw.sortOrder,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/personalizar/destinos-imperdibles");
    revalidatePath(`/imperdibles/${row.slug}`);
    return { ok: true as const, id: row.id };
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002") {
      return { ok: false as const, error: "Ya existe un destino con ese slug." };
    }
    console.error("createImperdibleDestinationAction", e);
    return { ok: false as const, error: "No se pudo crear el destino." };
  }
}

export async function updateImperdibleDestinationAction(id: string, input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  const parsed = destinationBaseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.imperdibleDestination.findUnique({ where: { id } });
  if (!existing) return { ok: false as const, error: "El destino no existe." };

  const raw = parsed.data;
  const slugCandidate = raw.slug?.trim()
    ? raw.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : slugifyImperdible(raw.title);
  const slugParsed = slugSchema.safeParse(slugCandidate || "destino");
  if (!slugParsed.success) {
    return { ok: false as const, error: slugParsed.error.issues[0]?.message ?? "Slug inválido" };
  }
  const slug = slugParsed.data;

  const wasPublished = existing.published;
  if (raw.published && !wasPublished) {
    const limit = await assertPublishedLimit(id, true);
    if (!limit.ok) return limit;
  }

  try {
    const row = await prisma.imperdibleDestination.update({
      where: { id },
      data: {
        slug,
        title: raw.title,
        subtitle: raw.subtitle,
        cardImageUrl: raw.cardImageUrl,
        bodyMarkdown: raw.bodyMarkdown,
        mapLat: raw.mapLat,
        mapLng: raw.mapLng,
        mapZoom: raw.mapZoom,
        published: raw.published,
        sortOrder: raw.sortOrder,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/personalizar/destinos-imperdibles");
    revalidatePath(`/imperdibles/${existing.slug}`);
    if (existing.slug !== row.slug) {
      revalidatePath(`/imperdibles/${row.slug}`);
    }
    return { ok: true as const };
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002") {
      return { ok: false as const, error: "Ya existe un destino con ese slug." };
    }
    console.error("updateImperdibleDestinationAction", e);
    return { ok: false as const, error: "No se pudo actualizar el destino." };
  }
}

export async function deleteImperdibleDestinationAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  try {
    const row = await prisma.imperdibleDestination.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/personalizar/destinos-imperdibles");
    revalidatePath(`/imperdibles/${row.slug}`);
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "No se pudo eliminar." };
  }
}

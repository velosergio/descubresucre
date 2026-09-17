"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ImperdiblesDisplayMode, ImperdiblesItemOrder } from "@/generated/prisma";
import { assertAdminAction } from "@/lib/auth-helpers";
import { IMPERDIBLES_HOME_MAX_ITEMS } from "@/lib/imperdibles-public";
import { slugifyImperdible } from "@/lib/imperdibles-slug";
import { prisma } from "@/lib/prisma";
import { revalidateQueHacerPaths } from "@/lib/que-hacer-revalidate";
import { slugSchema, sucreNaturalDestinationSchema } from "@/lib/sucre-natural-destination-schema";
import { revalidateSucreNaturalPaths } from "@/lib/sucre-natural-revalidate";

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

async function assertPublishedLimit(
  excludeId: string | null,
  willBePublished: boolean,
  willShowOnHome = false,
) {
  if (!willBePublished || !willShowOnHome) return { ok: true as const };
  const count = await prisma.imperdibleDestination.count({
    where: {
      published: true,
      showOnHome: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
  if (count >= IMPERDIBLES_HOME_MAX_ITEMS) {
    return {
      ok: false as const,
      error: "Solo puedes destacar hasta 20 destinos en la home.",
    };
  }
  return { ok: true as const };
}

export async function createImperdibleDestinationAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = sucreNaturalDestinationSchema.safeParse(input);
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

  const limit = await assertPublishedLimit(null, raw.published, raw.showOnHome);
  if (!limit.ok) return limit;

  try {
    const row = await prisma.imperdibleDestination.create({
      data: destinationWriteData(raw, slug, false),
    });
    await syncDestinationRelations(row.id, raw);
    const activitySlugs = await activitySlugsFor(raw.activityIds);
    revalidateSucreNaturalPaths({ slug: row.slug });
    for (const activitySlug of activitySlugs) {
      revalidateQueHacerPaths({ activitySlug, destinationSlugs: [row.slug] });
    }
    if (!activitySlugs.length) {
      revalidateQueHacerPaths({ destinationSlugs: [row.slug] });
    }
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

  const parsed = sucreNaturalDestinationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.imperdibleDestination.findUnique({
    where: { id },
    include: {
      queHacerActivities: { include: { activity: { select: { slug: true } } } },
    },
  });
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

  const willHighlight = raw.published && raw.showOnHome;
  const wasHighlight = existing.published && existing.showOnHome;
  if (willHighlight && !wasHighlight) {
    const limit = await assertPublishedLimit(id, true, true);
    if (!limit.ok) return limit;
  }

  try {
    const row = await prisma.imperdibleDestination.update({
      where: { id },
      data: destinationWriteData(raw, slug, false),
    });
    await syncDestinationRelations(row.id, raw);
    const destSlugs =
      existing.slug === row.slug ? [row.slug] : [existing.slug, row.slug];
    const activitySlugs = [
      ...existing.queHacerActivities.map((j) => j.activity.slug),
      ...(await activitySlugsFor(raw.activityIds)),
    ];
    revalidateSucreNaturalPaths({ slug: existing.slug });
    if (existing.slug !== row.slug) {
      revalidateSucreNaturalPaths({ slug: row.slug });
    }
    const uniqueActivitySlugs = [...new Set(activitySlugs)];
    if (uniqueActivitySlugs.length) {
      for (const activitySlug of uniqueActivitySlugs) {
        revalidateQueHacerPaths({ activitySlug, destinationSlugs: destSlugs });
      }
    } else {
      revalidateQueHacerPaths({ destinationSlugs: destSlugs });
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
    const existing = await prisma.imperdibleDestination.findUnique({
      where: { id },
      include: {
        queHacerActivities: { include: { activity: { select: { slug: true } } } },
      },
    });
    if (!existing) return { ok: false as const, error: "El destino no existe." };
    await prisma.imperdibleDestination.delete({ where: { id } });
    revalidateSucreNaturalPaths({ slug: existing.slug });
    const activitySlugs = existing.queHacerActivities.map((j) => j.activity.slug);
    if (activitySlugs.length) {
      for (const activitySlug of activitySlugs) {
        revalidateQueHacerPaths({ activitySlug, destinationSlugs: [existing.slug] });
      }
    } else {
      revalidateQueHacerPaths({ destinationSlugs: [existing.slug] });
    }
    return { ok: true as const };
  } catch (e) {
    console.error("deleteImperdibleDestinationAction", e);
    return { ok: false as const, error: "No se pudo eliminar." };
  }
}

async function activitySlugsFor(ids: string[]): Promise<string[]> {
  if (!ids.length) return [];
  const rows = await prisma.queHacerActivity.findMany({
    where: { id: { in: ids } },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

function emptyToNull(value: string | null | undefined) {
  const t = value?.trim();
  return t ? t : null;
}

function destinationWriteData(
  raw: z.infer<typeof sucreNaturalDestinationSchema>,
  slug: string,
  seedManaged: boolean,
) {
  return {
    slug,
    title: raw.title,
    subtitle: raw.subtitle,
    cardImageUrl: raw.cardImageUrl,
    bodyMarkdown: raw.bodyMarkdown,
    mapLat: raw.mapLat,
    mapLng: raw.mapLng,
    mapZoom: raw.mapZoom,
    published: raw.published,
    showOnHome: raw.showOnHome,
    sortOrder: raw.sortOrder,
    municipality: emptyToNull(raw.municipality),
    region: emptyToNull(raw.region),
    locationLabel: emptyToNull(raw.locationLabel),
    ecosystems: emptyToNull(raw.ecosystems),
    approach: emptyToNull(raw.approach),
    specialWhy: emptyToNull(raw.specialWhy),
    howToArrive: emptyToNull(raw.howToArrive),
    climate: emptyToNull(raw.climate),
    recommendedTime: emptyToNull(raw.recommendedTime),
    audience: emptyToNull(raw.audience),
    mapNote: emptyToNull(raw.mapNote),
    liveActivities: raw.liveActivities,
    responsibleTips: raw.responsibleTips.filter((t) => t.trim()),
    biodiversityChipLabels: raw.biodiversityChipLabels.filter((t) => t.trim()),
    seedManaged,
  };
}

async function syncDestinationRelations(
  destinationId: string,
  raw: z.infer<typeof sucreNaturalDestinationSchema>,
) {
  // Deprecado: ya no se escriben hubs; se limpia la tabla puente.
  await prisma.imperdibleDestinationHub.deleteMany({ where: { destinationId } });

  await prisma.queHacerActivityOnDestination.deleteMany({ where: { destinationId } });
  if (raw.activityIds.length) {
    await prisma.queHacerActivityOnDestination.createMany({
      data: raw.activityIds.map((activityId, i) => ({
        activityId,
        destinationId,
        sortOrder: i,
      })),
    });
  }

  await prisma.imperdibleGalleryItem.deleteMany({ where: { destinationId } });
  if (raw.galleryUrls.length) {
    await prisma.imperdibleGalleryItem.createMany({
      data: raw.galleryUrls.map((publicUrl, i) => ({
        destinationId,
        publicUrl,
        sortOrder: i,
      })),
    });
  }
  await prisma.destinationSource.deleteMany({ where: { destinationId } });
  if (raw.sourceIds.length) {
    await prisma.destinationSource.createMany({
      data: raw.sourceIds.map((sourceId) => ({ destinationId, sourceId })),
    });
  }
  await prisma.biodiversityOnDestination.deleteMany({ where: { destinationId } });
  if (raw.biodiversityIds.length) {
    await prisma.biodiversityOnDestination.createMany({
      data: raw.biodiversityIds.map((entryId) => ({ destinationId, entryId })),
    });
  }
  await prisma.experienceOnDestination.deleteMany({ where: { destinationId } });
  if (raw.experienceIds.length) {
    await prisma.experienceOnDestination.createMany({
      data: raw.experienceIds.map((experienceId) => ({ destinationId, experienceId })),
    });
  }
  // Deprecado: categorías Qué hacer en destinos.
  await prisma.queHacerDestinationOnCategory.deleteMany({ where: { destinationId } });
}

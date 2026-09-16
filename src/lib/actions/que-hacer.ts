"use server";

import { assertAdminAction } from "@/lib/auth-helpers";
import { galleryPublicUrlExists } from "@/lib/gallery-assets";
import { prisma } from "@/lib/prisma";
import { revalidateQueHacerPaths } from "@/lib/que-hacer-revalidate";
import { queHacerActivitySchema, queHacerCategorySchema, slugSchema } from "@/lib/que-hacer-schema";
import { slugifyQueHacer } from "@/lib/que-hacer-slug";

function prismaCode(e: unknown): string {
  return typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
}

function resolveSlug(rawSlug: string | undefined, title: string) {
  const candidate = rawSlug?.trim()
    ? rawSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : slugifyQueHacer(title);
  return slugSchema.safeParse(candidate || "actividad");
}

async function countLivePhotos(urls: string[]): Promise<number> {
  const flags = await Promise.all(urls.map((u) => galleryPublicUrlExists(u)));
  return flags.filter(Boolean).length;
}

async function syncActivityRelations(
  activityId: string,
  photoUrls: string[],
  coverUrl: string | undefined,
  photoAlts: (string | null)[],
  categoryIds: string[],
  destinationIds: string[],
) {
  await prisma.queHacerActivityPhoto.deleteMany({ where: { activityId } });
  if (photoUrls.length) {
    await prisma.queHacerActivityPhoto.createMany({
      data: photoUrls.map((publicUrl, i) => ({
        activityId,
        publicUrl,
        sortOrder: i,
        alt: photoAlts[i]?.trim() || null,
        isCover: coverUrl ? publicUrl === coverUrl.trim() : i === 0,
      })),
    });
  }
  await prisma.queHacerActivityOnCategory.deleteMany({ where: { activityId } });
  if (categoryIds.length) {
    await prisma.queHacerActivityOnCategory.createMany({
      data: categoryIds.map((categoryId) => ({ activityId, categoryId })),
    });
  }
  await prisma.queHacerActivityOnDestination.deleteMany({ where: { activityId } });
  if (destinationIds.length) {
    await prisma.queHacerActivityOnDestination.createMany({
      data: destinationIds.map((destinationId, i) => ({
        activityId,
        destinationId,
        sortOrder: i,
      })),
    });
  }
}

async function destinationSlugsFor(ids: string[]): Promise<string[]> {
  if (!ids.length) return [];
  const rows = await prisma.imperdibleDestination.findMany({
    where: { id: { in: ids } },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function createQueHacerActivityAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = queHacerActivitySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const raw = parsed.data;
  const slugParsed = resolveSlug(raw.slug, raw.title);
  if (!slugParsed.success) {
    return { ok: false as const, error: slugParsed.error.issues[0]?.message ?? "Slug inválido" };
  }
  if (raw.published) {
    const live = await countLivePhotos(raw.photoUrls);
    if (live < 1) {
      return { ok: false as const, error: "Publica al menos una foto de la galería." };
    }
  }

  try {
    const row = await prisma.queHacerActivity.create({
      data: {
        slug: slugParsed.data,
        title: raw.title,
        description: raw.description,
        iconKey: raw.iconKey,
        published: raw.published,
        sortOrder: raw.sortOrder,
        seedManaged: false,
      },
    });
    await syncActivityRelations(
      row.id,
      raw.photoUrls,
      raw.coverUrl,
      raw.photoAlts ?? [],
      raw.categoryIds,
      raw.destinationIds,
    );
    revalidateQueHacerPaths({
      activitySlug: row.slug,
      destinationSlugs: await destinationSlugsFor(raw.destinationIds),
    });
    return { ok: true as const, id: row.id };
  } catch (e: unknown) {
    if (prismaCode(e) === "P2002") {
      return { ok: false as const, error: "Ya existe una actividad con ese slug." };
    }
    console.error("createQueHacerActivityAction", e);
    return { ok: false as const, error: "No se pudo crear la actividad." };
  }
}

export async function updateQueHacerActivityAction(id: string, input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  const parsed = queHacerActivitySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const existing = await prisma.queHacerActivity.findUnique({
    where: { id },
    include: { destinations: { include: { destination: { select: { slug: true } } } } },
  });
  if (!existing) return { ok: false as const, error: "La actividad no existe." };

  const raw = parsed.data;
  const slugParsed = resolveSlug(raw.slug, raw.title);
  if (!slugParsed.success) {
    return { ok: false as const, error: slugParsed.error.issues[0]?.message ?? "Slug inválido" };
  }
  if (raw.published) {
    const live = await countLivePhotos(raw.photoUrls);
    if (live < 1) {
      return { ok: false as const, error: "Publica al menos una foto de la galería." };
    }
  }

  try {
    const row = await prisma.queHacerActivity.update({
      where: { id },
      data: {
        slug: slugParsed.data,
        title: raw.title,
        description: raw.description,
        iconKey: raw.iconKey,
        published: raw.published,
        sortOrder: raw.sortOrder,
        seedManaged: false,
      },
    });
    await syncActivityRelations(
      row.id,
      raw.photoUrls,
      raw.coverUrl,
      raw.photoAlts ?? [],
      raw.categoryIds,
      raw.destinationIds,
    );
    const destSlugs = [
      ...existing.destinations.map((j) => j.destination.slug),
      ...(await destinationSlugsFor(raw.destinationIds)),
    ];
    revalidateQueHacerPaths({
      activitySlug: row.slug,
      previousActivitySlug: existing.slug,
      destinationSlugs: destSlugs,
    });
    return { ok: true as const };
  } catch (e: unknown) {
    if (prismaCode(e) === "P2002") {
      return { ok: false as const, error: "Ya existe una actividad con ese slug." };
    }
    console.error("updateQueHacerActivityAction", e);
    return { ok: false as const, error: "No se pudo actualizar la actividad." };
  }
}

export async function deleteQueHacerActivityAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  try {
    const row = await prisma.queHacerActivity.findUnique({
      where: { id },
      include: { destinations: { include: { destination: { select: { slug: true } } } } },
    });
    if (!row) return { ok: false as const, error: "La actividad no existe." };
    await prisma.queHacerActivity.delete({ where: { id } });
    revalidateQueHacerPaths({
      activitySlug: row.slug,
      destinationSlugs: row.destinations.map((j) => j.destination.slug),
    });
    return { ok: true as const };
  } catch (e) {
    console.error("deleteQueHacerActivityAction", e);
    return { ok: false as const, error: "No se pudo eliminar la actividad." };
  }
}

export async function reorderQueHacerActivitiesAction(items: { id: string; sortOrder: number }[]) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  try {
    await prisma.$transaction(
      items.map((it) =>
        prisma.queHacerActivity.update({
          where: { id: it.id },
          data: { sortOrder: it.sortOrder },
        }),
      ),
    );
    revalidateQueHacerPaths();
    return { ok: true as const };
  } catch (e) {
    console.error("reorderQueHacerActivitiesAction", e);
    return { ok: false as const, error: "No se pudo reordenar." };
  }
}

export async function createQueHacerCategoryAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  const parsed = queHacerCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const slugParsed = resolveSlug(d.slug, d.name);
  if (!slugParsed.success) {
    return { ok: false as const, error: slugParsed.error.issues[0]?.message ?? "Slug inválido" };
  }
  try {
    await prisma.queHacerCategory.create({
      data: {
        slug: slugParsed.data,
        name: d.name,
        description: d.description,
        sortOrder: d.sortOrder,
        seedManaged: false,
      },
    });
    revalidateQueHacerPaths();
    return { ok: true as const };
  } catch (e: unknown) {
    if (prismaCode(e) === "P2002") {
      return { ok: false as const, error: "Ya existe una categoría con ese slug." };
    }
    console.error("createQueHacerCategoryAction", e);
    return { ok: false as const, error: "No se pudo crear la categoría." };
  }
}

export async function updateQueHacerCategoryAction(id: string, input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };
  const parsed = queHacerCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const existing = await prisma.queHacerCategory.findUnique({ where: { id } });
  if (!existing) return { ok: false as const, error: "La categoría no existe." };
  const d = parsed.data;
  const slugParsed = resolveSlug(d.slug, d.name);
  if (!slugParsed.success) {
    return { ok: false as const, error: slugParsed.error.issues[0]?.message ?? "Slug inválido" };
  }
  try {
    await prisma.queHacerCategory.update({
      where: { id },
      data: {
        slug: slugParsed.data,
        name: d.name,
        description: d.description,
        sortOrder: d.sortOrder,
        seedManaged: false,
      },
    });
    revalidateQueHacerPaths();
    return { ok: true as const };
  } catch (e: unknown) {
    if (prismaCode(e) === "P2002") {
      return { ok: false as const, error: "Ya existe una categoría con ese slug." };
    }
    console.error("updateQueHacerCategoryAction", e);
    return { ok: false as const, error: "No se pudo actualizar la categoría." };
  }
}

export async function deleteQueHacerCategoryAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };
  try {
    await prisma.queHacerCategory.delete({ where: { id } });
    revalidateQueHacerPaths();
    return { ok: true as const };
  } catch (e) {
    console.error("deleteQueHacerCategoryAction", e);
    return { ok: false as const, error: "No se pudo eliminar la categoría." };
  }
}

"use server";

import { assertAdminAction } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  biodiversityEntrySchema,
  natureExperienceSchema,
  slugSchema,
  sucreNaturalHubSaveSchema,
} from "@/lib/sucre-natural-destination-schema";
import { isSucreNaturalHubId } from "@/lib/sucre-natural-hubs";
import { revalidateSucreNaturalPaths } from "@/lib/sucre-natural-revalidate";

function emptyToNull(value: string | null | undefined) {
  const t = value?.trim();
  return t ? t : null;
}

export async function saveSucreNaturalHubAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = sucreNaturalHubSaveSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  if (!isSucreNaturalHubId(d.id)) {
    return { ok: false as const, error: "No se pueden crear hubs nuevos." };
  }
  const existing = await prisma.sucreNaturalHub.findUnique({ where: { id: d.id } });
  if (!existing) {
    return { ok: false as const, error: "El hub no existe. Ejecuta la carga inicial." };
  }
  try {
    await prisma.sucreNaturalHub.update({
      where: { id: d.id },
      data: {
        title: d.title,
        tagline: emptyToNull(d.tagline),
        introMarkdown: emptyToNull(d.introMarkdown),
        coverImageUrl: d.coverImageUrl,
      },
    });
    revalidateSucreNaturalPaths({ hubIds: [d.id] });
    return { ok: true as const };
  } catch (e) {
    console.error("saveSucreNaturalHubAction", e);
    return { ok: false as const, error: "No se pudo guardar el hub." };
  }
}

export async function createBiodiversityEntryAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  const parsed = biodiversityEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const slugParsed = slugSchema.safeParse(d.slug);
  if (!slugParsed.success) {
    return { ok: false as const, error: slugParsed.error.issues[0]?.message ?? "Slug inválido" };
  }
  try {
    const row = await prisma.biodiversityEntry.create({
      data: {
        slug: slugParsed.data,
        kind: d.kind,
        groupKey: d.groupKey,
        commonName: d.commonName,
        scientificName: emptyToNull(d.scientificName),
        summary: d.summary,
        whereFound: emptyToNull(d.whereFound),
        imageUrl: d.imageUrl,
        published: d.published,
        sortOrder: d.sortOrder,
        seedManaged: false,
      },
    });
    await syncBiodiversityDestinations(row.id, d.destinationIds);
    revalidateSucreNaturalPaths({ speciesSlug: row.slug, hubIds: ["biodiversidad"] });
    return { ok: true as const, id: row.id };
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002")
      return { ok: false as const, error: "Ya existe una especie con ese slug." };
    console.error("createBiodiversityEntryAction", e);
    return { ok: false as const, error: "No se pudo crear la ficha de especie." };
  }
}

export async function updateBiodiversityEntryAction(id: string, input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };
  const parsed = biodiversityEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const existing = await prisma.biodiversityEntry.findUnique({ where: { id } });
  if (!existing) return { ok: false as const, error: "La ficha no existe." };
  const d = parsed.data;
  try {
    const row = await prisma.biodiversityEntry.update({
      where: { id },
      data: {
        slug: d.slug,
        kind: d.kind,
        groupKey: d.groupKey,
        commonName: d.commonName,
        scientificName: emptyToNull(d.scientificName),
        summary: d.summary,
        whereFound: emptyToNull(d.whereFound),
        imageUrl: d.imageUrl,
        published: d.published,
        sortOrder: d.sortOrder,
        seedManaged: false,
      },
    });
    await syncBiodiversityDestinations(row.id, d.destinationIds);
    revalidateSucreNaturalPaths({
      speciesSlug: row.slug,
      hubIds: ["biodiversidad"],
    });
    return { ok: true as const };
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002")
      return { ok: false as const, error: "Ya existe una especie con ese slug." };
    console.error("updateBiodiversityEntryAction", e);
    return { ok: false as const, error: "No se pudo actualizar la ficha de especie." };
  }
}

export async function deleteBiodiversityEntryAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };
  try {
    const row = await prisma.biodiversityEntry.delete({ where: { id } });
    revalidateSucreNaturalPaths({ speciesSlug: row.slug, hubIds: ["biodiversidad"] });
    return { ok: true as const };
  } catch (e) {
    console.error("deleteBiodiversityEntryAction", e);
    return { ok: false as const, error: "No se pudo eliminar." };
  }
}

export async function createNatureExperienceAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  const parsed = natureExperienceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  try {
    const row = await prisma.natureExperience.create({
      data: {
        slug: d.slug,
        title: d.title,
        tagline: emptyToNull(d.tagline),
        whereText: emptyToNull(d.whereText),
        whatYouDo: d.whatYouDo,
        specialWhy: emptyToNull(d.specialWhy),
        recommendations: d.recommendations,
        imageUrl: d.imageUrl,
        published: d.published,
        sortOrder: d.sortOrder,
        seedManaged: false,
      },
    });
    await syncExperienceDestinations(row.id, d.destinationIds);
    revalidateSucreNaturalPaths({ experienceSlug: row.slug, hubIds: ["experiencias"] });
    return { ok: true as const, id: row.id };
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002") {
      return { ok: false as const, error: "Ya existe una experiencia con ese slug." };
    }
    console.error("createNatureExperienceAction", e);
    return { ok: false as const, error: "No se pudo crear la experiencia." };
  }
}

export async function updateNatureExperienceAction(id: string, input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };
  const parsed = natureExperienceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const existing = await prisma.natureExperience.findUnique({ where: { id } });
  if (!existing) return { ok: false as const, error: "La experiencia no existe." };
  const d = parsed.data;
  try {
    const row = await prisma.natureExperience.update({
      where: { id },
      data: {
        slug: d.slug,
        title: d.title,
        tagline: emptyToNull(d.tagline),
        whereText: emptyToNull(d.whereText),
        whatYouDo: d.whatYouDo,
        specialWhy: emptyToNull(d.specialWhy),
        recommendations: d.recommendations,
        imageUrl: d.imageUrl,
        published: d.published,
        sortOrder: d.sortOrder,
        seedManaged: false,
      },
    });
    await syncExperienceDestinations(row.id, d.destinationIds);
    revalidateSucreNaturalPaths({ experienceSlug: row.slug, hubIds: ["experiencias"] });
    return { ok: true as const };
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002") {
      return { ok: false as const, error: "Ya existe una experiencia con ese slug." };
    }
    console.error("updateNatureExperienceAction", e);
    return { ok: false as const, error: "No se pudo actualizar la experiencia." };
  }
}

export async function deleteNatureExperienceAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };
  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };
  try {
    const row = await prisma.natureExperience.delete({ where: { id } });
    revalidateSucreNaturalPaths({ experienceSlug: row.slug, hubIds: ["experiencias"] });
    return { ok: true as const };
  } catch (e) {
    console.error("deleteNatureExperienceAction", e);
    return { ok: false as const, error: "No se pudo eliminar." };
  }
}

async function syncBiodiversityDestinations(entryId: string, destinationIds: string[]) {
  await prisma.biodiversityOnDestination.deleteMany({ where: { entryId } });
  if (!destinationIds.length) return;
  await prisma.biodiversityOnDestination.createMany({
    data: destinationIds.map((destinationId) => ({ destinationId, entryId })),
  });
}

async function syncExperienceDestinations(experienceId: string, destinationIds: string[]) {
  await prisma.experienceOnDestination.deleteMany({ where: { experienceId } });
  if (!destinationIds.length) return;
  await prisma.experienceOnDestination.createMany({
    data: destinationIds.map((destinationId) => ({ destinationId, experienceId })),
  });
}

"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAction } from "@/lib/auth-helpers";
import { culturalEventSchema } from "@/lib/cultural-event-schema";
import { prisma } from "@/lib/prisma";

function revalidateCulturalEventPaths() {
  revalidatePath("/");
  revalidatePath("/admin/personalizar/eventos");
}

function writeData(raw: ReturnType<typeof culturalEventSchema.parse>) {
  return {
    title: raw.title,
    description: raw.description,
    category: raw.category,
    location: raw.location,
    startsAt: raw.startsAt,
    endsAt: raw.endsAt ?? null,
    allDay: raw.allDay,
    imageUrl: raw.imageUrl ?? null,
    mapLat: raw.mapLat ?? null,
    mapLng: raw.mapLng ?? null,
    published: raw.published,
  };
}

export async function createCulturalEventAction(input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  const parsed = culturalEventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    const row = await prisma.culturalEvent.create({ data: writeData(parsed.data) });
    revalidateCulturalEventPaths();
    return { ok: true as const, id: row.id };
  } catch (e) {
    console.error("createCulturalEventAction", e);
    return { ok: false as const, error: "No se pudo crear el evento." };
  }
}

export async function updateCulturalEventAction(id: string, input: unknown) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  const parsed = culturalEventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.culturalEvent.findUnique({ where: { id } });
  if (!existing) return { ok: false as const, error: "El evento no existe." };

  try {
    await prisma.culturalEvent.update({ where: { id }, data: writeData(parsed.data) });
    revalidateCulturalEventPaths();
    return { ok: true as const };
  } catch (e) {
    console.error("updateCulturalEventAction", e);
    return { ok: false as const, error: "No se pudo actualizar el evento." };
  }
}

export async function deleteCulturalEventAction(id: string) {
  const gate = await assertAdminAction();
  if (!gate.ok) return { ok: false as const, error: gate.error };

  if (!id?.trim()) return { ok: false as const, error: "Identificador inválido." };

  try {
    const existing = await prisma.culturalEvent.findUnique({ where: { id } });
    if (!existing) return { ok: false as const, error: "El evento no existe." };

    await prisma.culturalEvent.delete({ where: { id } });
    revalidateCulturalEventPaths();
    return { ok: true as const };
  } catch (e) {
    console.error("deleteCulturalEventAction", e);
    return { ok: false as const, error: "No se pudo eliminar." };
  }
}

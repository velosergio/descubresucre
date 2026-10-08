import type { Convocatoria } from "@/generated/prisma";
import { formatDeadlineLabel, startOfUtcDay } from "@/lib/convocatoria-deadline";
import { prisma } from "@/lib/prisma";

export type ConvocatoriaPublic = {
  id: string;
  title: string;
  description: string;
  audience: string;
  type: string;
  deadline: string;
  deadlineLabel: string;
  externalUrl: string;
};

export type ConvocatoriasHomePayload = {
  items: ConvocatoriaPublic[];
};

function toPublic(row: Convocatoria): ConvocatoriaPublic {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    audience: row.audience,
    type: row.type,
    deadline: row.deadline.toISOString(),
    deadlineLabel: formatDeadlineLabel(row.deadline),
    externalUrl: row.externalUrl,
  };
}

/** Convocatorias publicadas con fecha límite vigente (hoy o futuro, día UTC). */
export async function getConvocatoriasForHome(
  now: Date = new Date(),
): Promise<ConvocatoriasHomePayload> {
  const from = startOfUtcDay(now);
  const rows = await prisma.convocatoria.findMany({
    where: { published: true, deadline: { gte: from } },
    orderBy: [{ deadline: "asc" }, { createdAt: "asc" }],
  });
  return { items: rows.map(toPublic) };
}

export type ConvocatoriaAdminRow = ConvocatoriaPublic & {
  published: boolean;
  createdAt: string;
};

/** Todas las convocatorias para el panel de administración. */
export async function getAllConvocatoriasForAdmin(): Promise<ConvocatoriaAdminRow[]> {
  const rows = await prisma.convocatoria.findMany({
    orderBy: [{ deadline: "desc" }, { updatedAt: "desc" }],
  });
  return rows.map((row) => ({
    ...toPublic(row),
    published: row.published,
    createdAt: row.createdAt.toISOString(),
  }));
}

import { type ResolvedHeroConfig, resolveHeroFromRow } from "@/lib/hero-appearance";
import { prisma } from "@/lib/prisma";

function isMissingHeroTable(e: unknown): boolean {
  return (
    typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2021"
  );
}

/** Lee configuración del hero; si la tabla aún no existe (migración pendiente), usa imagen por defecto. */
export async function getResolvedHeroConfig(): Promise<ResolvedHeroConfig> {
  try {
    const row = await prisma.heroAppearanceSettings.findUnique({
      where: { id: "singleton" },
    });
    return resolveHeroFromRow(row);
  } catch (e) {
    if (isMissingHeroTable(e)) {
      return { mode: "IMAGE_DEFAULT" };
    }
    throw e;
  }
}

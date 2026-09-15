import { revalidatePath } from "next/cache";

export type RevalidateSucreNaturalOpts = {
  slug?: string | null;
  hubIds?: readonly string[];
  speciesSlug?: string | null;
  experienceSlug?: string | null;
};

/** Revalida home, micrositio Sucre Natural, detalle Imperdibles y admin afectados. */
export function revalidateSucreNaturalPaths(opts: RevalidateSucreNaturalOpts = {}) {
  revalidatePath("/");
  revalidatePath("/sucre-natural");
  revalidatePath("/sucre-natural", "layout");
  revalidatePath("/admin/personalizar/destinos-imperdibles");
  revalidatePath("/admin/personalizar/sucre-natural");
  revalidatePath("/admin/personalizar/biodiversidad");
  revalidatePath("/admin/personalizar/experiencias-naturaleza");

  if (opts.slug?.trim()) {
    revalidatePath(`/imperdibles/${opts.slug.trim()}`);
  }
  for (const hubId of opts.hubIds ?? []) {
    if (hubId.trim()) revalidatePath(`/sucre-natural/${hubId.trim()}`);
  }
  if (opts.speciesSlug?.trim()) {
    revalidatePath(`/sucre-natural/especies/${opts.speciesSlug.trim()}`);
  }
  if (opts.experienceSlug?.trim()) {
    revalidatePath(`/sucre-natural/experiencias/${opts.experienceSlug.trim()}`);
  }
}

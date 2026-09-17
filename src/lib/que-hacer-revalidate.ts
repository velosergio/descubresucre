import { revalidatePath } from "next/cache";

export type RevalidateQueHacerOpts = {
  activitySlug?: string | null;
  previousActivitySlug?: string | null;
  destinationSlugs?: readonly string[];
};

export function revalidateQueHacerPaths(opts: RevalidateQueHacerOpts = {}) {
  revalidatePath("/");
  revalidatePath("/admin/personalizar/que-hacer");
  revalidatePath("/admin/personalizar/destinos-imperdibles");
  revalidatePath("/sucre-natural");

  if (opts.activitySlug?.trim()) {
    const slug = opts.activitySlug.trim();
    revalidatePath(`/que-hacer/${slug}`);
    revalidatePath(`/sucre-natural/${slug}`);
  }
  if (opts.previousActivitySlug?.trim() && opts.previousActivitySlug !== opts.activitySlug) {
    const prev = opts.previousActivitySlug.trim();
    revalidatePath(`/que-hacer/${prev}`);
    revalidatePath(`/sucre-natural/${prev}`);
  }
  for (const slug of opts.destinationSlugs ?? []) {
    if (slug.trim()) revalidatePath(`/imperdibles/${slug.trim()}`);
  }
}

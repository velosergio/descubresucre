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

  if (opts.activitySlug?.trim()) {
    revalidatePath(`/que-hacer/${opts.activitySlug.trim()}`);
  }
  if (opts.previousActivitySlug?.trim() && opts.previousActivitySlug !== opts.activitySlug) {
    revalidatePath(`/que-hacer/${opts.previousActivitySlug.trim()}`);
  }
  for (const slug of opts.destinationSlugs ?? []) {
    if (slug.trim()) revalidatePath(`/imperdibles/${slug.trim()}`);
  }
}

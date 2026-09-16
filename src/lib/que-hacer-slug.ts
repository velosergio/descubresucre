import { slugifyImperdible } from "@/lib/imperdibles-slug";

/** Slug de actividad; si el título no da tokens, usa «actividad» (no «destino»). */
export function slugifyQueHacer(input: string): string {
  const slug = slugifyImperdible(input);
  return slug === "destino" ? "actividad" : slug;
}

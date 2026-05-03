/** Slug URL-safe en minúsculas, máx. 160 caracteres. */
export function slugifyImperdible(input: string): string {
  const base = input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
  return base.length > 0 ? base : "destino";
}

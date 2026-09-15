export type StructuredFichaInput = {
  hubs: readonly { id: string }[];
  specialWhy?: string | null;
  municipality?: string | null;
};

export function isNonEmptyText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

export function isNonEmptyList(values: readonly string[] | null | undefined): boolean {
  if (!values?.length) return false;
  return values.some((v) => v.trim().length > 0);
}

/** Layout ficha Sucre Natural si hay hub, “qué lo hace especial” o municipio. */
export function hasStructuredFicha(row: StructuredFichaInput): boolean {
  if (row.hubs.length > 0) return true;
  if (isNonEmptyText(row.specialWhy)) return true;
  if (isNonEmptyText(row.municipality)) return true;
  return false;
}

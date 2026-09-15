export type SeedMergeDecision = "create" | "update" | "skip";

export function decideSeedMerge(existing: { seedManaged: boolean } | null): SeedMergeDecision {
  if (!existing) return "create";
  if (!existing.seedManaged) return "skip";
  return "update";
}

/** Añade ids del seed que falten; no quita los extra del admin. */
export function mergeJoinIds(existingIds: readonly string[], seedIds: readonly string[]): string[] {
  const set = new Set(existingIds);
  for (const id of seedIds) {
    if (id) set.add(id);
  }
  return [...set];
}

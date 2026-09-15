import Link from "next/link";

export type BiodiversityListItem = {
  slug: string;
  commonName: string;
  scientificName: string | null;
  groupKey: string;
};

const GROUP_LABELS: Record<string, string> = {
  mamiferos: "Mamíferos",
  "reptiles-anfibios": "Reptiles y anfibios",
  aves: "Aves",
  flora: "Flora",
  bosques: "Bosques y ecosistemas",
};

export function BiodiversityGroupedList({ items }: { items: BiodiversityListItem[] }) {
  const grouped = new Map<string, BiodiversityListItem[]>();
  for (const entry of items) {
    const list = grouped.get(entry.groupKey) ?? [];
    list.push(entry);
    grouped.set(entry.groupKey, list);
  }
  return (
    <div className="space-y-8">
      {[...grouped.entries()].map(([group, groupItems]) => (
        <section key={group}>
          <h3 className="font-display text-lg font-semibold">{GROUP_LABELS[group] ?? group}</h3>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupItems.map((sp) => (
              <li key={sp.slug}>
                <Link
                  href={`/sucre-natural/especies/${sp.slug}`}
                  className="block rounded-xl border border-[hsl(var(--sn-ink)/0.08)] bg-white/70 p-4 outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
                >
                  <p className="font-display font-semibold">{sp.commonName}</p>
                  {sp.scientificName ? (
                    <p className="font-body text-sm italic">{sp.scientificName}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

import Link from "next/link";

type Crumb = { href: string; label: string };

type Props = {
  hubs: readonly { id: string; title: string }[];
  currentLabel: string;
};

export function FichaBreadcrumb({ hubs, currentLabel }: Props) {
  const primary = hubs[0];
  const crumbs: Crumb[] = [{ href: "/sucre-natural", label: "Sucre Natural" }];
  if (primary) {
    crumbs.push({ href: `/sucre-natural/${primary.id}`, label: primary.title });
  }
  return (
    <nav aria-label="Miga de pan" className="font-body text-sm text-[hsl(var(--sn-ink)/0.72)]">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c) => (
          <li key={c.href} className="flex items-center gap-2">
            <Link
              href={c.href}
              className="underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
            >
              {c.label}
            </Link>
            <span aria-hidden>/</span>
          </li>
        ))}
        <li>
          <span className="font-medium text-[hsl(var(--sn-ink))]">{currentLabel}</span>
        </li>
      </ol>
    </nav>
  );
}

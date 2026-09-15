import Link from "next/link";
import { PolaroidImage } from "@/components/sucre-natural/polaroid-image";
import { getSucreNaturalHubDef, type SucreNaturalHubId } from "@/lib/sucre-natural-hubs";

type Props = {
  id: SucreNaturalHubId;
  title: string;
  tagline: string | null;
  coverImageUrl: string | null;
};

export function HubCard({ id, title, tagline, coverImageUrl }: Props) {
  const def = getSucreNaturalHubDef(id);
  const Icon = def.icon;
  return (
    <Link
      href={`/sucre-natural/${id}`}
      className="group block rounded-2xl border border-[hsl(var(--sn-ink)/0.08)] bg-white/70 p-4 shadow-sm outline-none transition hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
      data-hub={id}
    >
      <PolaroidImage src={coverImageUrl} alt={`Portada de ${title}`} />
      <div className="mt-4 flex items-start gap-3">
        <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--sn-accent)/0.15)] px-2.5 py-1 font-body text-xs font-semibold text-[hsl(var(--sn-ink))]">
          <Icon className="size-3.5" aria-hidden />
          {def.iconLabel}
        </span>
      </div>
      <h2 className="sn-brush-title mt-3 font-display text-xl font-bold text-[hsl(var(--sn-ink))]">
        {title}
      </h2>
      {tagline ? (
        <p className="mt-2 font-body text-sm text-[hsl(var(--sn-ink)/0.75)]">{tagline}</p>
      ) : null}
    </Link>
  );
}

import Link from "next/link";
import { PolaroidImage } from "@/components/sucre-natural/polaroid-image";
import type { DestinationHubCard } from "@/lib/sucre-natural-public";
import { isNonEmptyText } from "@/lib/sucre-natural-resolve";

export type FichaEspecieView = {
  slug: string;
  commonName: string;
  scientificName: string | null;
  groupKey: string;
  summary: string;
  whereFound: string | null;
  imageUrl: string | null;
  destinations: DestinationHubCard[];
};

export function FichaEspecie({ ficha }: { ficha: FichaEspecieView }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10" data-hub="biodiversidad">
      <nav className="font-body text-sm">
        <Link
          href="/sucre-natural/biodiversidad"
          className="underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
        >
          Biodiversidad
        </Link>
      </nav>
      <PolaroidImage src={ficha.imageUrl} alt={ficha.commonName} priority />
      <header className="space-y-2">
        <h1 className="sn-brush-title font-display text-4xl font-bold">{ficha.commonName}</h1>
        {isNonEmptyText(ficha.scientificName) ? (
          <p className="font-body italic text-[hsl(var(--sn-ink)/0.7)]">{ficha.scientificName}</p>
        ) : null}
      </header>
      <section>
        <h2 className="font-display text-xl font-semibold">Por qué importa</h2>
        <p className="mt-2 font-body leading-relaxed">{ficha.summary}</p>
      </section>
      {isNonEmptyText(ficha.whereFound) ? (
        <section>
          <h2 className="font-display text-xl font-semibold">Dónde se encuentra</h2>
          <p className="mt-2 font-body">{ficha.whereFound}</p>
        </section>
      ) : null}
      {ficha.destinations.length > 0 ? (
        <section>
          <h2 className="font-display text-xl font-semibold">Destinos relacionados</h2>
          <ul className="mt-3 space-y-2 font-body">
            {ficha.destinations.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/imperdibles/${d.slug}`}
                  className="underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

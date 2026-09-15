import Link from "next/link";
import { PolaroidImage } from "@/components/sucre-natural/polaroid-image";
import type { DestinationHubCard } from "@/lib/sucre-natural-public";
import { isNonEmptyList, isNonEmptyText } from "@/lib/sucre-natural-resolve";

export type FichaExperienciaView = {
  slug: string;
  title: string;
  tagline: string | null;
  whereText: string | null;
  whatYouDo: string[];
  specialWhy: string | null;
  recommendations: string[];
  imageUrl: string | null;
  destinations: DestinationHubCard[];
};

export function FichaExperiencia({ ficha }: { ficha: FichaExperienciaView }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10" data-hub="experiencias">
      <nav className="font-body text-sm">
        <Link
          href="/sucre-natural/experiencias"
          className="underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
        >
          Experiencias
        </Link>
      </nav>
      <PolaroidImage src={ficha.imageUrl} alt={ficha.title} priority />
      <header className="space-y-2">
        <h1 className="sn-brush-title font-display text-4xl font-bold">{ficha.title}</h1>
        {isNonEmptyText(ficha.tagline) ? (
          <p className="font-body text-lg text-[hsl(var(--sn-ink)/0.75)]">{ficha.tagline}</p>
        ) : null}
      </header>
      {isNonEmptyText(ficha.whereText) ? (
        <section>
          <h2 className="font-display text-xl font-semibold">Dónde vivirla</h2>
          <p className="mt-2 font-body">{ficha.whereText}</p>
        </section>
      ) : null}
      {isNonEmptyList(ficha.whatYouDo) ? (
        <section>
          <h2 className="font-display text-xl font-semibold">Qué se hace</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-body">
            {ficha.whatYouDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {isNonEmptyText(ficha.specialWhy) ? (
        <section>
          <h2 className="font-display text-xl font-semibold">Por qué es especial</h2>
          <p className="mt-2 font-body leading-relaxed">{ficha.specialWhy}</p>
        </section>
      ) : null}
      {isNonEmptyList(ficha.recommendations) ? (
        <section>
          <h2 className="font-display text-xl font-semibold">Recomendaciones</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-body">
            {ficha.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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

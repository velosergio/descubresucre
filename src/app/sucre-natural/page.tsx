import type { Metadata } from "next";
import { HubCard } from "@/components/sucre-natural/hub-card";
import { getSucreNaturalLanding } from "@/lib/get-sucre-natural-public";

export const metadata: Metadata = {
  title: "Sucre Natural | Sucre Vivo",
  description: "Turismo de naturaleza y sostenibilidad en el departamento de Sucre.",
};

export default async function SucreNaturalLandingPage() {
  const data = await getSucreNaturalLanding();
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 md:py-14">
      <header className="max-w-3xl space-y-4">
        <p className="sn-section-label">Turismo de naturaleza y sostenibilidad</p>
        <h1 className="sn-brush-title font-display text-4xl font-bold text-[hsl(var(--sn-ink))] md:text-5xl">
          Sucre Natural
        </h1>
        <p className="font-display italic text-xl text-[hsl(var(--sn-accent))]">
          Naturaleza que inspira, experiencias que transforman
        </p>
        <p className="font-body text-[hsl(var(--sn-ink)/0.8)]">
          Siete caminos para recorrer playas, ciénagas, ríos, paisajes, biodiversidad, senderos y
          experiencias en armonía con el territorio.
        </p>
      </header>

      <section aria-labelledby="hubs-heading">
        <h2 id="hubs-heading" className="sr-only">
          Hubs temáticos
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.hubs.map((hub) => (
            <HubCard
              key={hub.id}
              id={hub.id}
              title={hub.title}
              tagline={hub.tagline}
              coverImageUrl={hub.coverImageUrl}
            />
          ))}
        </div>
      </section>

      {data.sources.length > 0 ? (
        <section aria-labelledby="fuentes-heading" className="space-y-3">
          <h2 id="fuentes-heading" className="font-display text-xl font-semibold">
            Fuentes institucionales
          </h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 font-body text-sm">
            {data.sources.map((s) => (
              <li key={s.name}>
                {s.url ? (
                  <a
                    href={s.url}
                    className="underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.name}
                  </a>
                ) : (
                  s.name
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="font-body text-xs text-[hsl(var(--sn-ink)/0.55)]">{data.credit}</p>
    </main>
  );
}

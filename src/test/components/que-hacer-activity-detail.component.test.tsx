import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityThemePage } from "@/components/que-hacer/activity-theme-page";
import type { QueHacerDetail } from "@/lib/get-que-hacer-detail";

const base: QueHacerDetail = {
  slug: "playas",
  title: "Playas de Sucre",
  description: "Tolú, Coveñas, San Bernardo, Rincón del Mar",
  iconKey: "waves",
  iconLabel: "Playas y mar",
  tagline: "Mar y naturaleza",
  introMarkdown: null,
  accentHsl: "174 45% 32%",
  listingMode: "DESTINATIONS",
  photos: [
    { publicUrl: "/uploads/gallery/images/a.webp", alt: "Playa 1" },
    { publicUrl: "/uploads/gallery/images/b.webp", alt: "Playa 2" },
  ],
  destinations: [],
  species: [],
  experiences: [],
};

describe("ActivityThemePage", () => {
  it("muestra identidad y fotos; mensaje si no hay destinos", () => {
    render(<ActivityThemePage detail={base} />);
    expect(screen.getByRole("heading", { name: "Playas de Sucre" })).toBeInTheDocument();
    expect(screen.getByText("Mar y naturaleza")).toBeInTheDocument();
    expect(screen.getByAltText("Playa 1")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Destinos" })).toBeInTheDocument();
    expect(screen.getByText(/Aún no hay destinos publicados/)).toBeInTheDocument();
  });

  it("lista especies en modo biodiversidad", () => {
    render(
      <ActivityThemePage
        detail={{
          ...base,
          listingMode: "BIODIVERSITY",
          destinations: [],
          species: [
            {
              slug: "manati",
              commonName: "Manatí",
              scientificName: "Trichechus",
              groupKey: "mamiferos",
            },
          ],
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Catálogo de especies" })).toBeInTheDocument();
    expect(screen.getByText("Manatí")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FichaExperiencia } from "@/components/sucre-natural/ficha-experiencia";

describe("hub experiencias (ficha)", () => {
  it("muestra dónde vivirla y enlaces a destinos", () => {
    render(
      <FichaExperiencia
        ficha={{
          slug: "avistamiento-de-aves",
          title: "Avistamiento de aves",
          tagline: "Colores y sonidos",
          whereText: "Sanguaré y La Caimanera",
          whatYouDo: ["Observar aves"],
          specialWhy: "Paraíso de aves",
          recommendations: ["Lleva binoculares"],
          imageUrl: null,
          destinations: [
            {
              slug: "reserva-natural-sanguare",
              title: "Reserva Natural Sanguaré",
              subtitle: "x",
              municipality: "San Onofre",
              cardImageUrl: null,
            },
          ],
        }}
      />,
    );
    expect(screen.getByText("Sanguaré y La Caimanera")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reserva Natural Sanguaré" })).toHaveAttribute(
      "href",
      "/imperdibles/reserva-natural-sanguare",
    );
  });

  it("muestra dónde vivirla aunque no haya destinos vinculados", () => {
    render(
      <FichaExperiencia
        ficha={{
          slug: "buceo-y-careteo",
          title: "Buceo y careteo",
          tagline: null,
          whereText: "Archipiélago de San Bernardo (Parques Nacionales Naturales).",
          whatYouDo: [],
          specialWhy: null,
          recommendations: [],
          imageUrl: null,
          destinations: [],
        }}
      />,
    );
    expect(screen.getByText(/Archipiélago de San Bernardo/)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Destinos relacionados" }),
    ).not.toBeInTheDocument();
  });
});

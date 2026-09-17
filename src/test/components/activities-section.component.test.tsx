import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ActivitiesSection from "@/components/ActivitiesSection";
import type { QueHacerHomeCard } from "@/lib/get-que-hacer-home";

function card(i: number): QueHacerHomeCard {
  return {
    slug: `act-${i}`,
    title: `Actividad ${i}`,
    description: `Descripción ${i}`,
    iconKey: "waves",
    iconLabel: "Playas y mar",
    coverUrl: `/uploads/gallery/images/act-${i}.webp`,
    coverAlt: `Actividad ${i}`,
  };
}

describe("ActivitiesSection", () => {
  it("no renderiza la sección si no hay ítems", () => {
    const { container } = render(
      <ActivitiesSection payload={{ items: [], useCardCarousel: false }} />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("heading", { name: /Qué hacer en/ })).not.toBeInTheDocument();
  });

  it("muestra grilla de 5 tarjetas sin flechas de carrusel", () => {
    const items = [1, 2, 3, 4, 5].map(card);
    render(<ActivitiesSection payload={{ items, useCardCarousel: false }} />);
    expect(screen.getByRole("heading", { name: /Qué hacer en/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Actividad 1/ })).toHaveAttribute(
      "href",
      "/que-hacer/act-1",
    );
    expect(screen.queryByRole("button", { name: "Anterior" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Siguiente" })).not.toBeInTheDocument();
  });

  it("muestra carrusel con anterior y siguiente si hay más de 5", () => {
    const items = [1, 2, 3, 4, 5, 6].map(card);
    render(<ActivitiesSection payload={{ items, useCardCarousel: true }} />);
    expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Pausar|Reanudar/ })).not.toBeInTheDocument();
  });
});

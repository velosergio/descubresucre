import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityDetail } from "@/components/que-hacer/activity-detail";
import type { QueHacerDetail } from "@/lib/get-que-hacer-detail";

const base: QueHacerDetail = {
  slug: "playas",
  title: "Playas",
  description: "Tolú, Coveñas, San Bernardo, Rincón del Mar",
  iconKey: "waves",
  iconLabel: "Playas y mar",
  photos: [
    { publicUrl: "/uploads/gallery/images/a.webp", alt: "Playa 1" },
    { publicUrl: "/uploads/gallery/images/b.webp", alt: "Playa 2" },
    { publicUrl: "/uploads/gallery/images/c.webp", alt: "Playa 3" },
  ],
  categories: [{ slug: "playas", name: "Playas" }],
  destinations: [],
};

describe("ActivityDetail carrusel", () => {
  it("recorre 3 fotos con controles accesibles", () => {
    render(<ActivityDetail detail={base} />);
    expect(screen.getByRole("heading", { name: "Playas" })).toBeInTheDocument();
    expect(screen.getByAltText("Playa 1")).toBeInTheDocument();
    expect(screen.getByAltText("Playa 2")).toBeInTheDocument();
    expect(screen.getByAltText("Playa 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Foto anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Foto siguiente" })).toBeInTheDocument();
  });

  it("omite el bloque de destinos si está vacío", () => {
    render(<ActivityDetail detail={base} />);
    expect(screen.queryByRole("heading", { name: "Dónde vivirlo" })).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("no publica correo ni teléfono de relleno", () => {
    render(<Footer />);
    expect(screen.queryByText(/turismo@sucre\.gov\.co/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/282\s*0000/)).not.toBeInTheDocument();
    expect(screen.queryByText(/ProColombia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ministerio de Cultura/i)).not.toBeInTheDocument();
  });

  it("enlaza solo a rutas propias y a la Gobernación", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Sucre Natural" })).toHaveAttribute(
      "href",
      "/sucre-natural",
    );
    const gobernacion = screen.getByRole("link", { name: "Gobernación de Sucre" });
    expect(gobernacion).toHaveAttribute("href", "https://www.sucre.gov.co/");
    expect(gobernacion).toHaveAttribute("target", "_blank");
    expect(screen.getByText(/Sincelejo, Sucre, Colombia/)).toBeInTheDocument();
  });
});

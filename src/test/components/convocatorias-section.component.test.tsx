import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConvocatoriasSection from "@/components/ConvocatoriasSection";
import type { ConvocatoriaPublic, ConvocatoriasHomePayload } from "@/lib/get-convocatorias-home";

function item(overrides: Partial<ConvocatoriaPublic> = {}): ConvocatoriaPublic {
  return {
    id: "c1",
    title: "Beca cultural",
    description: "Inscripciones abiertas",
    audience: "Artistas",
    type: "Arte",
    deadline: "2026-12-15T00:00:00.000Z",
    deadlineLabel: "15 de diciembre de 2026",
    externalUrl: "https://ejemplo.gov.co/beca",
    ...overrides,
  };
}

describe("ConvocatoriasSection", () => {
  it("renderiza tarjetas con enlace externo seguro", () => {
    const payload: ConvocatoriasHomePayload = { items: [item()] };
    render(<ConvocatoriasSection convocatoriasPayload={payload} />);
    expect(screen.getByText("Beca cultural")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Más información/i });
    expect(link).toHaveAttribute("href", "https://ejemplo.gov.co/beca");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel") ?? "").toContain("noopener");
  });

  it("muestra estado vacío sin inventar tarjetas", () => {
    render(<ConvocatoriasSection convocatoriasPayload={{ items: [] }} />);
    expect(screen.getByText(/No hay oportunidades abiertas/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Más información/i })).not.toBeInTheDocument();
  });
});

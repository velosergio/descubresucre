import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InvestigacionBanner from "@/components/InvestigacionBanner";
import ResearchLanding from "@/components/investigacion/research-landing";
import { RESEARCH_SECTIONS } from "@/lib/investigacion-content";

describe("InvestigacionBanner", () => {
  it("enlaza a la landing pública del proyecto", () => {
    render(<InvestigacionBanner />);
    expect(screen.getByRole("heading", { name: /investigación/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver el proyecto/i })).toHaveAttribute(
      "href",
      "/investigacion",
    );
  });
});

describe("ResearchLanding", () => {
  it("cubre las seis preguntas de la guía del póster con su índice", () => {
    render(<ResearchLanding />);
    const nav = screen.getByRole("navigation", { name: /Secciones de la investigación/i });
    for (const s of RESEARCH_SECTIONS) {
      expect(within(nav).getByRole("link", { name: new RegExp(s.label) })).toHaveAttribute(
        "href",
        `#${s.id}`,
      );
      expect(document.getElementById(s.id)).not.toBeNull();
    }
  });

  it("expone las cifras finales a lectores de pantalla aunque animen", () => {
    render(<ResearchLanding />);
    expect(screen.getAllByText("42,9 %").length).toBeGreaterThan(0);
    expect(screen.getAllByText("13.300").length).toBeGreaterThan(0);
  });

  it("filtra los indicadores de la encuesta por grupo", async () => {
    const user = userEvent.setup();
    render(<ResearchLanding />);
    expect(screen.getByText(/Participa en la recopilación del patrimonio/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Disposición" }));
    expect(screen.getByRole("button", { name: "Disposición" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.queryByText(/Participa en la recopilación del patrimonio/),
    ).not.toBeInTheDocument();
  });
});

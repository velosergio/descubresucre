import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HeroSection from "@/components/HeroSection";

describe("HeroSection accesibilidad", () => {
  it("nombra el botón de enviar del buscador", () => {
    render(<HeroSection onChatMessage={vi.fn()} heroConfig={{ mode: "IMAGE_DEFAULT" }} />);
    expect(screen.getByRole("button", { name: "Enviar búsqueda" })).toBeInTheDocument();
    expect(screen.getByLabelText("¿Qué te gustaría descubrir sobre Sucre?")).toBeInTheDocument();
  });
});

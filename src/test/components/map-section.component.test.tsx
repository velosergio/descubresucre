import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import MapSection from "@/components/MapSection";

describe("MapSection", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("embebe Google Maps Embed y recentra al elegir un destino", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key");
    const user = userEvent.setup();
    render(<MapSection />);

    const iframe = screen.getByTitle("Mapa de Sucre");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.google.com/maps/embed/v1/view?key=test-key&center=9.45,-75.5&zoom=9",
    );

    await user.click(screen.getByRole("button", { name: /Coveñas/ }));
    expect(screen.getByTitle("Mapa de Sucre")).toHaveAttribute(
      "src",
      "https://www.google.com/maps/embed/v1/view?key=test-key&center=9.4033,-75.6847&zoom=12",
    );
  });

  it("sin API key muestra enlace a Google Maps y no iframe OSM", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "");
    render(<MapSection />);

    expect(screen.queryByTitle("Mapa de Sucre")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Abrir en Google Maps/ })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/search/?api=1&query=9.45%2C-75.5",
    );
    expect(screen.queryByTitle(/openstreetmap/i)).not.toBeInTheDocument();
  });
});

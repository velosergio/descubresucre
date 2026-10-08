import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MapSection from "@/components/MapSection";

const mapsMock = vi.hoisted(() => {
  const panTo = vi.fn();
  const setZoom = vi.fn();
  const fitBounds = vi.fn();
  const setCenter = vi.fn();

  class FakeMap {
    panTo = panTo;
    setZoom = setZoom;
    fitBounds = fitBounds;
    setCenter = setCenter;
  }

  class FakeLatLngBounds {
    extend() {}
  }

  class FakeMarker {
    setMap() {}
    addListener() {
      return { remove: vi.fn() };
    }
  }

  class FakePoint {
    constructor(
      readonly x: number,
      readonly y: number,
    ) {}
  }

  return {
    panTo,
    setZoom,
    fitBounds,
    setCenter,
    install() {
      vi.stubGlobal("google", {
        maps: {
          Map: FakeMap,
          Marker: FakeMarker,
          Point: FakePoint,
          LatLngBounds: FakeLatLngBounds,
          Animation: { BOUNCE: 1, DROP: 2 },
        },
      });
    },
  };
});

const loaderMock = vi.hoisted(() => ({
  authListener: null as null | (() => void),
}));

vi.mock("@/lib/load-google-maps", () => ({
  loadGoogleMapsApi: vi.fn(async () => {
    mapsMock.install();
  }),
  onGoogleMapsAuthFailure: vi.fn((cb: () => void) => {
    loaderMock.authListener = cb;
    return () => {
      loaderMock.authListener = null;
    };
  }),
  resetGoogleMapsLoader: vi.fn(),
}));

describe("MapSection", () => {
  it("si Google rechaza la clave muestra un estado propio sin Reintentar y deja la lista", async () => {
    render(<MapSection mapsApiKey="test-key" />);
    await waitFor(() => expect(loaderMock.authListener).not.toBeNull());

    act(() => loaderMock.authListener?.());

    expect(await screen.findByRole("alert")).toHaveTextContent(/No pudimos cargar el mapa/);
    expect(screen.queryByRole("button", { name: "Reintentar" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Abrir en Google Maps/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Coveñas/ })).toBeInTheDocument();
  });

  it("si la carga falla ofrece Reintentar y vuelve a montar el mapa", async () => {
    const user = userEvent.setup();
    const { loadGoogleMapsApi } = await import("@/lib/load-google-maps");
    vi.mocked(loadGoogleMapsApi).mockRejectedValueOnce(new Error("sin red"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(<MapSection mapsApiKey="test-key" />);

    await user.click(await screen.findByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("application", { name: "Mapa de Sucre" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("con API key muestra el mapa JS y recentra al elegir un destino", async () => {
    const user = userEvent.setup();
    render(<MapSection mapsApiKey="test-key" />);

    expect(screen.getByRole("application", { name: "Mapa de Sucre" })).toBeInTheDocument();
    expect(screen.queryByText(/Mapa embebido no configurado/)).not.toBeInTheDocument();
    expect(screen.queryByTitle("Mapa de Sucre")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Coveñas/ }));

    await waitFor(() => {
      expect(mapsMock.panTo).toHaveBeenCalledWith({ lat: 9.4033, lng: -75.6847 });
    });
    expect(mapsMock.setZoom).toHaveBeenCalledWith(12);
  });

  it("sin API key muestra enlace a Google Maps y no iframe OSM", async () => {
    const user = userEvent.setup();
    render(<MapSection mapsApiKey={null} />);

    expect(screen.queryByRole("application", { name: "Mapa de Sucre" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Abrir en Google Maps/ })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/search/?api=1&query=9.45%2C-75.5",
    );
    expect(screen.queryByTitle(/openstreetmap/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Coveñas/ }));
    expect(screen.getByRole("link", { name: /Abrir en Google Maps/ })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/search/?api=1&query=9.4033%2C-75.6847",
    );
  });
});

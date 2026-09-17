import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  document.head.replaceChildren();
  document.body.replaceChildren();
  Reflect.deleteProperty(window, "google");
  Reflect.deleteProperty(window, "__descubresucreGoogleMapsInit");
  vi.resetModules();
  vi.useRealTimers();
});

describe("loadGoogleMapsApi", () => {
  it("resuelve de inmediato si google.maps.Map ya existe", async () => {
    window.google = { maps: { Map: class FakeMap {} } } as never;
    const { loadGoogleMapsApi } = await import("./load-google-maps");

    await loadGoogleMapsApi("test-key");

    expect(document.querySelectorAll("script").length).toBe(0);
  });

  it("inyecta el script con callback clásico y espera a Map", async () => {
    const { loadGoogleMapsApi } = await import("./load-google-maps");
    const pending = loadGoogleMapsApi("test-key");
    const script = document.querySelector("script");

    expect(script?.src).toContain("maps.googleapis.com/maps/api/js");
    expect(script?.src).toContain("callback=__descubresucreGoogleMapsInit");
    expect(script?.src).not.toContain("loading=async");
    expect(script?.dataset.googleMaps).toBe("true");

    window.google = { maps: { Map: class FakeMap {} } } as never;
    await pending;
  });

  it("no inyecta un segundo script si Google Maps ya está cargando", async () => {
    const existing = document.createElement("script");
    existing.src = "https://maps.googleapis.com/maps/api/js?key=old&v=weekly&loading=async";
    document.head.appendChild(existing);

    const { loadGoogleMapsApi } = await import("./load-google-maps");
    const pending = loadGoogleMapsApi("test-key");

    expect(document.querySelectorAll("script").length).toBe(1);

    window.google = { maps: { Map: class FakeMap {} } } as never;
    await pending;
  });
});

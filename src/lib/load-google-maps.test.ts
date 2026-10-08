import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  document.head.replaceChildren();
  document.body.replaceChildren();
  Reflect.deleteProperty(window, "google");
  Reflect.deleteProperty(window, "__descubresucreGoogleMapsInit");
  Reflect.deleteProperty(window, "gm_authFailure");
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

  it("rechaza de inmediato y retira el script si falla la red, y permite reintentar", async () => {
    const { loadGoogleMapsApi, GoogleMapsLoadError } = await import("./load-google-maps");
    const pending = loadGoogleMapsApi("test-key");
    document.querySelector("script")?.dispatchEvent(new Event("error"));

    await expect(pending).rejects.toBeInstanceOf(GoogleMapsLoadError);
    expect(document.querySelectorAll("script").length).toBe(0);

    const retry = loadGoogleMapsApi("test-key");
    expect(document.querySelectorAll("script").length).toBe(1);
    window.google = { maps: { Map: class FakeMap {} } } as never;
    await retry;
  });

  it("avisa a los oyentes cuando Google rechaza la clave (gm_authFailure)", async () => {
    const { onGoogleMapsAuthFailure } = await import("./load-google-maps");
    const listener = vi.fn();
    const off = onGoogleMapsAuthFailure(listener);

    (window as unknown as { gm_authFailure: () => void }).gm_authFailure();
    expect(listener).toHaveBeenCalledTimes(1);

    off();
    (window as unknown as { gm_authFailure: () => void }).gm_authFailure();
    expect(listener).toHaveBeenCalledTimes(1);
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

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildGoogleMapsEmbedPlaceUrl,
  buildGoogleMapsEmbedViewUrl,
  buildGoogleMapsSearchUrl,
  getGoogleMapsApiKey,
} from "@/lib/google-maps-embed";

describe("getGoogleMapsApiKey", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("prioriza GOOGLE_MAPS_API_KEY de runtime", () => {
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "runtime-key");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "public-key");
    expect(getGoogleMapsApiKey()).toBe("runtime-key");
  });

  it("usa NEXT_PUBLIC_GOOGLE_MAPS_API_KEY si no hay clave de runtime", () => {
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "public-key");
    expect(getGoogleMapsApiKey()).toBe("public-key");
  });

  it("devuelve null si ambas están vacías", () => {
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "  ");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "");
    expect(getGoogleMapsApiKey()).toBeNull();
  });
});

describe("buildGoogleMapsEmbedViewUrl", () => {
  it("construye el iframe Embed API con clave, centro y zoom", () => {
    expect(
      buildGoogleMapsEmbedViewUrl({
        apiKey: "abc 123",
        lat: 9.45,
        lng: -75.5,
        zoom: 9,
      }),
    ).toBe("https://www.google.com/maps/embed/v1/view?key=abc%20123&center=9.45,-75.5&zoom=9");
  });

  it("devuelve null si la clave está vacía", () => {
    expect(
      buildGoogleMapsEmbedViewUrl({ apiKey: "  ", lat: 9.45, lng: -75.5, zoom: 9 }),
    ).toBeNull();
  });
});

describe("buildGoogleMapsEmbedPlaceUrl", () => {
  it("construye el iframe Embed con pin", () => {
    expect(
      buildGoogleMapsEmbedPlaceUrl({
        apiKey: "k",
        lat: 9.4033,
        lng: -75.6847,
        zoom: 12,
      }),
    ).toBe("https://www.google.com/maps/embed/v1/place?key=k&q=9.4033,-75.6847&zoom=12");
  });
});

describe("buildGoogleMapsSearchUrl", () => {
  it("arma el enlace de búsqueda por coordenadas", () => {
    expect(buildGoogleMapsSearchUrl(9.4033, -75.6847)).toBe(
      "https://www.google.com/maps/search/?api=1&query=9.4033%2C-75.6847",
    );
  });
});

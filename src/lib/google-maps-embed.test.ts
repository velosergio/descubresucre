import { describe, expect, it } from "vitest";
import { buildGoogleMapsEmbedViewUrl, buildGoogleMapsSearchUrl } from "@/lib/google-maps-embed";

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

describe("buildGoogleMapsSearchUrl", () => {
  it("arma el enlace de búsqueda por coordenadas", () => {
    expect(buildGoogleMapsSearchUrl(9.4033, -75.6847)).toBe(
      "https://www.google.com/maps/search/?api=1&query=9.4033%2C-75.6847",
    );
  });
});

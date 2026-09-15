import { describe, expect, it } from "vitest";
import {
  hubIdOrNull,
  parseLiveActivities,
  parseStringList,
  publishedOnly,
  toDestinationHubCard,
} from "@/lib/sucre-natural-public";

describe("DTO público Sucre Natural", () => {
  it("publishedOnly deja solo registros publicados", () => {
    const rows = [
      { id: "a", published: true },
      { id: "b", published: false },
      { id: "c", published: true },
    ];
    expect(publishedOnly(rows).map((r) => r.id)).toEqual(["a", "c"]);
  });

  it("hubIdOrNull es 404 conceptual si el id no es de los 7", () => {
    expect(hubIdOrNull("playas")).toBe("playas");
    expect(hubIdOrNull("biodiversidad")).toBe("biodiversidad");
    expect(hubIdOrNull("playa")).toBeNull();
    expect(hubIdOrNull("archipielago-de-san-bernardo")).toBeNull();
  });

  it("toDestinationHubCard omite destinos unpublished", () => {
    expect(
      toDestinationHubCard({
        slug: "playa-el-frances",
        title: "Playa El Francés",
        subtitle: "Arena blanca",
        municipality: "Tolú",
        cardImageUrl: null,
        published: false,
      }),
    ).toBeNull();
    expect(
      toDestinationHubCard({
        slug: "playa-el-frances",
        title: "Playa El Francés",
        subtitle: "Arena blanca",
        municipality: "Tolú",
        cardImageUrl: null,
        published: true,
      })?.slug,
    ).toBe("playa-el-frances");
  });

  it("parsea listas JSON y actividades", () => {
    expect(parseStringList(["  Peces  ", "", 3])).toEqual(["Peces"]);
    expect(parseLiveActivities([{ title: "Snorkel", iconKey: "waves" }, { title: "  " }])).toEqual([
      { title: "Snorkel", iconKey: "waves" },
    ]);
  });
});

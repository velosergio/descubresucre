import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BiodiversityGroupedList } from "@/components/sucre-natural/biodiversidad-grouped-list";

describe("listado agrupado biodiversidad", () => {
  it("agrupa mamíferos y aves", () => {
    render(
      <BiodiversityGroupedList
        items={[
          {
            slug: "titi-cabeciblanco",
            commonName: "Tití cabeciblanco",
            scientificName: null,
            groupKey: "mamiferos",
          },
          {
            slug: "garza-real",
            commonName: "Garza real",
            scientificName: null,
            groupKey: "aves",
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Mamíferos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Aves" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tití cabeciblanco/ })).toHaveAttribute(
      "href",
      "/sucre-natural/especies/titi-cabeciblanco",
    );
  });
});

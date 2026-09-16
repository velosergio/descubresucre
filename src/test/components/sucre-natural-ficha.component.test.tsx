import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FichaDestinoView } from "@/components/sucre-natural/ficha-destino";
import { FichaDestino } from "@/components/sucre-natural/ficha-destino";

const base: FichaDestinoView = {
  slug: "playa-el-frances",
  title: "Playa El Francés",
  subtitle: "Arena blanca, mar tranquilo y la esencia del Caribe.",
  cardImageUrl: null,
  municipality: "Tolú",
  region: "Golfo de Morrosquillo",
  locationLabel: "Tolú, Sucre",
  ecosystems: "Playa · mar",
  approach: "Naturaleza y turismo sostenible",
  specialWhy: "Aguas tranquilas y cristalinas.",
  howToArrive: "Desde Tolú, en lancha o transporte terrestre (aprox. 15 min)",
  climate: null,
  recommendedTime: "1 día",
  audience: "",
  mapNote: null,
  mapLat: null,
  mapLng: null,
  mapZoom: 14,
  liveActivities: [{ title: "Relájate en la playa" }],
  responsibleTips: ["Lleva contigo tus residuos."],
  biodiversityChips: [{ label: "Peces" }],
  gallery: [],
  sources: [],
  hubs: [{ id: "playas", title: "Playas de Sucre" }],
  queHacerActivities: [],
};

describe("FichaDestino", () => {
  it("oculta clima y audiencia vacíos y muestra cómo llegar", () => {
    render(<FichaDestino ficha={base} />);
    expect(screen.queryByRole("heading", { name: "Clima" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Para quién" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cómo llegar" })).toBeInTheDocument();
    expect(screen.getByText(/Desde Tolú/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Vive el destino" })).toBeInTheDocument();
  });
});

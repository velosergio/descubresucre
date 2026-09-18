import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CulturalEventsSection from "@/components/CulturalEventsSection";
import type {
  CulturalEventPublic,
  CulturalEventsHomePayload,
} from "@/lib/get-cultural-events-home";

function event(overrides: Partial<CulturalEventPublic> = {}): CulturalEventPublic {
  return {
    id: "ev-1",
    title: "Festival de Octubre",
    description: "Descripción del evento",
    category: "Música",
    location: "Sincelejo",
    startsAt: "2026-10-05T20:00:00.000Z",
    endsAt: null,
    allDay: false,
    imageUrl: null,
    mapLat: null,
    mapLng: null,
    ...overrides,
  };
}

describe("CulturalEventsSection", () => {
  it("muestra los eventos del mes recibido", () => {
    const payload: CulturalEventsHomePayload = { year: 2026, month: 10, events: [event()] };
    render(<CulturalEventsSection payload={payload} />);
    expect(screen.getByText("Festival de Octubre")).toBeInTheDocument();
    expect(screen.getByText("octubre de 2026")).toBeInTheDocument();
  });

  it("muestra el estado vacío cuando el mes no tiene eventos", () => {
    const payload: CulturalEventsHomePayload = { year: 2026, month: 10, events: [] };
    render(<CulturalEventsSection payload={payload} />);
    expect(screen.getByText("No hay eventos programados para este mes.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mes anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeInTheDocument();
  });

  it("navega al mes siguiente sin recargar la página", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () =>
        ({
          year: 2026,
          month: 11,
          events: [event({ id: "ev-2", title: "Evento de noviembre" })],
        }) satisfies CulturalEventsHomePayload,
    });
    vi.stubGlobal("fetch", fetchMock);

    const payload: CulturalEventsHomePayload = { year: 2026, month: 10, events: [event()] };
    render(<CulturalEventsSection payload={payload} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Mes siguiente" }));

    await waitFor(() => {
      expect(screen.getByText("Evento de noviembre")).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/cultural-events?mes=2026-11");
    expect(screen.getByText("noviembre de 2026")).toBeInTheDocument();
  });
});

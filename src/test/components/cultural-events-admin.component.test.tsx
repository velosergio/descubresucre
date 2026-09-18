import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CulturalEventsAdmin } from "@/components/admin/cultural-events-admin";
import type { CulturalEventAdminRow } from "@/lib/get-cultural-events-home";

const createMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const refreshMock = vi.fn();
const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/actions/cultural-events", () => ({
  createCulturalEventAction: (input: unknown) => createMock(input),
  updateCulturalEventAction: (id: string, input: unknown) => updateMock(id, input),
  deleteCulturalEventAction: (id: string) => deleteMock(id),
}));

vi.mock("@/lib/actions/gallery", () => ({
  uploadGalleryAssetAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => toastSuccessMock(msg),
    error: (msg: string) => toastErrorMock(msg),
  },
}));

function row(overrides: Partial<CulturalEventAdminRow> = {}): CulturalEventAdminRow {
  return {
    id: "ev-1",
    title: "Festival de Octubre",
    description: "Desc",
    category: "Música",
    location: "Sincelejo",
    startsAt: "2026-10-15T00:00:00.000Z",
    endsAt: null,
    allDay: true,
    imageUrl: null,
    mapLat: null,
    mapLng: null,
    published: true,
    ...overrides,
  };
}

describe("CulturalEventsAdmin", () => {
  it("muestra el listado con acciones de editar/eliminar", () => {
    render(<CulturalEventsAdmin initialEvents={[row()]} />);
    expect(screen.getByText("Festival de Octubre")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
  });

  it("el botón guardar está deshabilitado hasta completar los campos obligatorios", async () => {
    render(<CulturalEventsAdmin initialEvents={[]} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Nuevo" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Guardar" })).toBeDisabled();

    await user.type(within(dialog).getByLabelText("Título"), "Nuevo evento");
    await user.type(within(dialog).getByLabelText("Lugar"), "Tolú");
    await user.type(within(dialog).getByLabelText("Categoría"), "Arte");
    await user.type(within(dialog).getByLabelText("Descripción"), "Una descripción");
    const dateInput = within(dialog).getByLabelText("Fecha de inicio");
    await user.type(dateInput, "2026-12-01");

    expect(within(dialog).getByRole("button", { name: "Guardar" })).toBeEnabled();
  });

  it("muestra el error de la action si el guardado falla", async () => {
    createMock.mockResolvedValue({ ok: false, error: "No se pudo crear el evento." });
    render(<CulturalEventsAdmin initialEvents={[]} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Nuevo" }));

    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText("Título"), "Nuevo evento");
    await user.type(within(dialog).getByLabelText("Lugar"), "Tolú");
    await user.type(within(dialog).getByLabelText("Categoría"), "Arte");
    await user.type(within(dialog).getByLabelText("Descripción"), "Una descripción");
    await user.type(within(dialog).getByLabelText("Fecha de inicio"), "2026-12-01");
    await user.click(within(dialog).getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("No se pudo crear el evento.");
    });
    expect(createMock).toHaveBeenCalledOnce();
  });
});

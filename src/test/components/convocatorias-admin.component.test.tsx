import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConvocatoriasAdmin } from "@/components/admin/convocatorias-admin";
import type { ConvocatoriaAdminRow } from "@/lib/get-convocatorias-home";

const createMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const refreshMock = vi.fn();
const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/actions/convocatorias", () => ({
  createConvocatoriaAction: (input: unknown) => createMock(input),
  updateConvocatoriaAction: (id: string, input: unknown) => updateMock(id, input),
  deleteConvocatoriaAction: (id: string) => deleteMock(id),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => toastSuccessMock(msg),
    error: (msg: string) => toastErrorMock(msg),
  },
}));

function row(overrides: Partial<ConvocatoriaAdminRow> = {}): ConvocatoriaAdminRow {
  return {
    id: "c1",
    title: "Beca cultural",
    description: "Desc",
    audience: "Artistas",
    type: "Arte",
    deadline: "2026-12-15T00:00:00.000Z",
    deadlineLabel: "15 de diciembre de 2026",
    externalUrl: "https://ejemplo.gov.co/beca",
    published: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("ConvocatoriasAdmin", () => {
  it("muestra el listado con acciones de editar/eliminar e indicadores de estado", () => {
    render(
      <ConvocatoriasAdmin
        initialItems={[
          row(),
          row({
            id: "c2",
            title: "Ya cerrada",
            deadline: "2020-01-01T00:00:00.000Z",
            published: true,
          }),
          row({ id: "c3", title: "En borrador", published: false }),
        ]}
      />,
    );
    expect(screen.getByText("Beca cultural")).toBeInTheDocument();
    expect(screen.getByText("Ya cerrada")).toBeInTheDocument();
    expect(screen.getByText("En borrador")).toBeInTheDocument();
    expect(screen.getByText("Abierta")).toBeInTheDocument();
    expect(screen.getByText("Vencida")).toBeInTheDocument();
    expect(screen.getByText("Borrador")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Editar" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Eliminar" }).length).toBeGreaterThan(0);
  });

  it("el botón guardar está deshabilitado hasta completar los campos obligatorios", async () => {
    render(<ConvocatoriasAdmin initialItems={[]} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Nuevo" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Guardar" })).toBeDisabled();

    await user.type(within(dialog).getByLabelText("Título"), "Nueva");
    await user.type(within(dialog).getByLabelText("Descripción"), "Texto");
    await user.type(within(dialog).getByLabelText("Audiencia"), "Público");
    await user.type(within(dialog).getByLabelText("Tipo"), "Turismo");
    await user.type(within(dialog).getByLabelText("Fecha límite"), "2026-12-01");
    await user.type(within(dialog).getByLabelText("Enlace externo"), "https://ejemplo.gov.co/x");

    expect(within(dialog).getByRole("button", { name: "Guardar" })).toBeEnabled();
  });

  it("muestra el error de la action si el guardado falla", async () => {
    createMock.mockResolvedValue({ ok: false, error: "No se pudo crear la convocatoria." });
    render(<ConvocatoriasAdmin initialItems={[]} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Nuevo" }));

    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText("Título"), "Nueva");
    await user.type(within(dialog).getByLabelText("Descripción"), "Texto");
    await user.type(within(dialog).getByLabelText("Audiencia"), "Público");
    await user.type(within(dialog).getByLabelText("Tipo"), "Turismo");
    await user.type(within(dialog).getByLabelText("Fecha límite"), "2026-12-01");
    await user.type(within(dialog).getByLabelText("Enlace externo"), "https://ejemplo.gov.co/x");
    await user.click(within(dialog).getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("No se pudo crear la convocatoria.");
    });
    expect(createMock).toHaveBeenCalledOnce();
    expect(within(dialog).getByRole("alert")).toHaveTextContent(
      "No se pudo crear la convocatoria.",
    );
  });
});

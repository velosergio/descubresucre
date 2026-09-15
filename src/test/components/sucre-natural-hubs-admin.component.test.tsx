import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SucreNaturalHubsAdmin } from "@/components/admin/sucre-natural-hubs-admin";

const saveMock = vi.fn();
const listGalleryMock = vi.fn();
const refreshMock = vi.fn();
const toastSuccessMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/actions/sucre-natural", () => ({
  saveSucreNaturalHubAction: (input: unknown) => saveMock(input),
}));

vi.mock("@/lib/actions/gallery", () => ({
  listGalleryAssetsAction: (input: unknown) => listGalleryMock(input),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => toastSuccessMock(msg),
    error: vi.fn(),
  },
}));

const galleryUrl = "/uploads/gallery/images/playas-cover.webp";

describe("SucreNaturalHubsAdmin portada", () => {
  it("elige la portada desde la galería y no permite pegar una ruta", async () => {
    listGalleryMock.mockResolvedValue({
      ok: true,
      assets: [
        {
          id: "asset-1",
          kind: "IMAGE",
          publicUrl: galleryUrl,
          mimeType: "image/webp",
          originalName: "playas.webp",
          createdAt: "2026-09-15T00:00:00.000Z",
        },
      ],
    });
    saveMock.mockResolvedValue({ ok: true });

    render(
      <SucreNaturalHubsAdmin
        initialHubs={[
          {
            id: "playas",
            title: "Playas de Sucre",
            tagline: "Mar",
            introMarkdown: "",
            coverImageUrl: "",
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("button", { name: "Elegir de la galería" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByRole("textbox", { name: /imagen de portada/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/Elige una imagen en Personalizar/).length).toBeGreaterThan(0);

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    await user.click(screen.getAllByRole("button", { name: "Elegir de la galería" })[0]);

    await waitFor(() => expect(listGalleryMock).toHaveBeenCalledWith({ kind: "IMAGE" }));
    await user.click(await screen.findByRole("button", { name: "Seleccionar" }));

    expect(screen.getByAltText("Portada de Playas")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: "Guardar hub" })[0]);
    await waitFor(() =>
      expect(saveMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "playas",
          coverImageUrl: galleryUrl,
        }),
      ),
    );
  });
});

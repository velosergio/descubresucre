import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPanel } from "@/components/ChatPanel";

function mockCryptoWithSequence() {
  let id = 0;
  vi.stubGlobal("crypto", {
    randomUUID: () => {
      id += 1;
      return `id-fixed-${id}`;
    },
  } as Crypto);
}

describe("ChatPanel", () => {
  it("envía mensaje y renderiza respuesta del asistente", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ jobId: "job-1" }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ status: "DONE", reply: "Respuesta desde n8n" }),
      });

    vi.stubGlobal("fetch", fetchMock);
    mockCryptoWithSequence();

    render(<ChatPanel onClose={() => undefined} />);
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Escribe tu pregunta…"), "Hola");
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(screen.getByText("Respuesta desde n8n")).toBeInTheDocument();
    });
  });

  it("muestra error cuando la API no devuelve jobId", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ error: "Webhook no configurado" }),
      }),
    );
    mockCryptoWithSequence();

    render(<ChatPanel onClose={() => undefined} initialMessage="Necesito ayuda" />);

    await waitFor(() => {
      expect(screen.getByText("Webhook no configurado")).toBeInTheDocument();
    });
  });
});

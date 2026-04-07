import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatbotSettingsForm } from "@/components/admin/chatbot-settings-form";

const saveMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("@/lib/actions/chatbot-settings", () => ({
  saveChatbotWebhookAction: (input: unknown) => saveMock(input),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => toastSuccessMock(msg),
    error: (msg: string) => toastErrorMock(msg),
  },
}));

describe("ChatbotSettingsForm", () => {
  it("guarda configuración y muestra toast de éxito", async () => {
    saveMock.mockResolvedValue({ ok: true });
    render(
      <ChatbotSettingsForm
        initialWebhookUrl=""
        callbackHint="http://localhost:3000/api/chat/n8n-callback"
      />,
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("URL del webhook n8n"), "https://n8n.local/webhook/x");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => expect(toastSuccessMock).toHaveBeenCalledWith("Configuración guardada"));
  });

  it("muestra toast de error cuando falla", async () => {
    saveMock.mockResolvedValue({ ok: false, error: "URL inválida" });
    render(<ChatbotSettingsForm initialWebhookUrl="" callbackHint="http://localhost:3000/api/chat/n8n-callback" />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith("URL inválida"));
  });
});

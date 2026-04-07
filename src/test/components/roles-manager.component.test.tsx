import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RolesManager } from "@/components/admin/roles-manager";

const createRoleMock = vi.fn().mockResolvedValue({ ok: true });
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/actions/roles", () => ({
  createRoleAction: (input: unknown) => createRoleMock(input),
  deleteRoleAction: vi.fn(),
  updateRoleAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("RolesManager", () => {
  it("crea un nuevo rol", async () => {
    render(<RolesManager roles={[]} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Nuevo rol" }));
    await user.type(screen.getByLabelText("Nombre"), "moderador");
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(createRoleMock).toHaveBeenCalledWith({ name: "moderador" });
  });
});

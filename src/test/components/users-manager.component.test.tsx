import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsersManager } from "@/components/admin/users-manager";

const refreshMock = vi.fn();
const approveMock = vi.fn().mockResolvedValue({ ok: true });

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/actions/users", () => ({
  approveUserAction: (input: unknown) => approveMock(input),
  createUserAction: vi.fn(),
  deleteUserAction: vi.fn(),
  rejectUserAction: vi.fn(),
  updateUserAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("UsersManager", () => {
  it("permite aprobar usuarios pendientes", async () => {
    render(
      <UsersManager
        currentUserId="admin-1"
        roles={[{ id: "r1", name: "editor" }]}
        users={[{ id: "u1", email: "u1@x.com", name: "U1", accountStatus: "PENDING", roles: [] }]}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByTitle("Aprobar"));

    expect(approveMock).toHaveBeenCalledWith({ id: "u1" });
  });
});

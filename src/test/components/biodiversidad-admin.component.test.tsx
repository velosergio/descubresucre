import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BiodiversidadAdmin } from "@/components/admin/biodiversidad-admin";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/actions/sucre-natural", () => ({
  createBiodiversityEntryAction: vi.fn(),
  deleteBiodiversityEntryAction: vi.fn(),
  updateBiodiversityEntryAction: vi.fn(),
}));

describe("BiodiversidadAdmin accesibilidad", () => {
  it("asocia una etiqueta visible al selector de tipo", () => {
    render(<BiodiversidadAdmin initialEntries={[]} destinations={[]} />);
    expect(screen.getByLabelText("Tipo")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tipo" })).toHaveValue("FAUNA");
  });
});

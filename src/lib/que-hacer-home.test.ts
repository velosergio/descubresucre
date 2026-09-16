import { describe, expect, it } from "vitest";
import { shouldUseHomeCardCarousel } from "@/lib/que-hacer-home";

describe("shouldUseHomeCardCarousel", () => {
  it("es falso con 0 y 5 ítems", () => {
    expect(shouldUseHomeCardCarousel(0)).toBe(false);
    expect(shouldUseHomeCardCarousel(5)).toBe(false);
  });

  it("es verdadero con más de 5", () => {
    expect(shouldUseHomeCardCarousel(6)).toBe(true);
  });
});

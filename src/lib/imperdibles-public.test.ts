import { describe, expect, it } from "vitest";
import { shuffleImperdibleCards } from "@/lib/imperdibles-public";

describe("shuffleImperdibleCards", () => {
  it("conserva longitud y elementos", () => {
    const input = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const out = shuffleImperdibleCards(input);
    expect(out).toHaveLength(3);
    expect(out.map((x) => x.id).sort()).toEqual(["a", "b", "c"]);
    expect(out).not.toBe(input);
  });
});

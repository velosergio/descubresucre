import { describe, expect, it } from "vitest";
import { formatNumber } from "./format-number";

describe("formatNumber", () => {
  it("usa separadores colombianos", () => {
    expect(formatNumber(13300)).toBe("13.300");
    expect(formatNumber(42.9, 1)).toBe("42,9");
    expect(formatNumber(3.04, 2)).toBe("3,04");
  });
});

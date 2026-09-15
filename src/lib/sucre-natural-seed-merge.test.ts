import { describe, expect, it } from "vitest";
import { decideSeedMerge, mergeJoinIds } from "@/lib/sucre-natural-seed-merge";

describe("decideSeedMerge", () => {
  it("crea si el slug no existe", () => {
    expect(decideSeedMerge(null)).toBe("create");
  });

  it("omite contenido si seedManaged es false", () => {
    expect(decideSeedMerge({ seedManaged: false })).toBe("skip");
  });

  it("actualiza si seedManaged es true", () => {
    expect(decideSeedMerge({ seedManaged: true })).toBe("update");
  });
});

describe("mergeJoinIds", () => {
  it("añade joins faltantes y conserva extras del admin", () => {
    expect(mergeJoinIds(["a", "x"], ["a", "b"])).toEqual(["a", "x", "b"]);
  });
});

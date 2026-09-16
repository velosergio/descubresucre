import { describe, expect, it } from "vitest";
import { isQueHacerIconKey, resolveQueHacerIcon } from "@/lib/que-hacer-icons";

describe("que-hacer-icons", () => {
  it("incluye las cinco claves del mock", () => {
    for (const key of ["waves", "palette", "utensils-crossed", "tree-pine", "heart"]) {
      expect(isQueHacerIconKey(key)).toBe(true);
    }
  });

  it("resuelve clave inválida a compass", () => {
    const resolved = resolveQueHacerIcon("no-existe");
    expect(resolved.key).toBe("compass");
    expect(resolved.label).toBe("Explorar");
  });
});

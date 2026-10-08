import { describe, expect, it } from "vitest";
import { formatDeadlineLabel, isDeadlineOpen, startOfUtcDay } from "@/lib/convocatoria-deadline";

describe("convocatoria-deadline", () => {
  it("startOfUtcDay normaliza a medianoche UTC", () => {
    const d = new Date("2026-10-07T15:45:30.123Z");
    const start = startOfUtcDay(d);
    expect(start.toISOString()).toBe("2026-10-07T00:00:00.000Z");
  });

  it("isDeadlineOpen es true el mismo día y en el futuro", () => {
    const now = new Date("2026-10-07T18:00:00.000Z");
    expect(isDeadlineOpen(new Date("2026-10-07T00:00:00.000Z"), now)).toBe(true);
    expect(isDeadlineOpen(new Date("2026-10-08T00:00:00.000Z"), now)).toBe(true);
  });

  it("isDeadlineOpen es false cuando el deadline ya pasó", () => {
    const now = new Date("2026-10-07T18:00:00.000Z");
    expect(isDeadlineOpen(new Date("2026-10-06T00:00:00.000Z"), now)).toBe(false);
  });

  it("formatDeadlineLabel produce etiqueta en español", () => {
    const label = formatDeadlineLabel(new Date("2026-03-30T00:00:00.000Z"));
    expect(label.toLowerCase()).toContain("marzo");
    expect(label).toContain("2026");
    expect(label).toMatch(/30/);
  });
});

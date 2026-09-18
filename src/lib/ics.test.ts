import { describe, expect, it } from "vitest";
import { buildIcsContent } from "@/lib/ics";

function baseEvent() {
  return {
    id: "ev-123",
    title: "Festival de Octubre",
    description: "Una gran fiesta",
    location: "Sincelejo",
    startsAt: "2026-10-15T20:00:00.000Z",
    endsAt: null as string | null,
    allDay: false,
  };
}

describe("buildIcsContent", () => {
  it("produce un bloque VCALENDAR/VEVENT válido", () => {
    const ics = buildIcsContent(baseEvent());
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics.indexOf("BEGIN:VEVENT")).toBeGreaterThan(ics.indexOf("BEGIN:VCALENDAR"));
    expect(ics.indexOf("END:VEVENT")).toBeLessThan(ics.indexOf("END:VCALENDAR"));
  });

  it("usa un UID estable basado en el id del evento", () => {
    const ics = buildIcsContent(baseEvent());
    expect(ics).toContain("UID:ev-123@descubresucre");
  });

  it("escapa comas, punto y coma y saltos de línea en SUMMARY/DESCRIPTION/LOCATION", () => {
    const ics = buildIcsContent({
      ...baseEvent(),
      title: "Feria; Grande, Especial",
      description: "Línea uno\nLínea dos, con coma; y punto y coma",
      location: "Plaza; Central, Sincelejo",
    });
    expect(ics).toContain("SUMMARY:Feria\\; Grande\\, Especial");
    expect(ics).toContain("DESCRIPTION:Línea uno\\nLínea dos\\, con coma\\; y punto y coma");
    expect(ics).toContain("LOCATION:Plaza\\; Central\\, Sincelejo");
  });

  it("usa DTSTART/DTEND con hora en UTC cuando allDay es false", () => {
    const ics = buildIcsContent(baseEvent());
    expect(ics).toContain("DTSTART:20261015T200000Z");
    expect(ics).toContain("DTEND:20261015T210000Z");
  });

  it("usa DTSTART/DTEND con VALUE=DATE cuando allDay es true", () => {
    const ics = buildIcsContent({
      ...baseEvent(),
      allDay: true,
      startsAt: "2026-10-15T00:00:00.000Z",
      endsAt: "2026-10-18T00:00:00.000Z",
    });
    expect(ics).toContain("DTSTART;VALUE=DATE:20261015");
    expect(ics).toContain("DTEND;VALUE=DATE:20261019");
  });
});

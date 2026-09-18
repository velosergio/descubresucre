import { describe, expect, it } from "vitest";
import { buildGoogleCalendarUrl } from "@/lib/calendar-links";

function baseEvent() {
  return {
    title: "Festival de Octubre",
    description: "Una gran fiesta",
    location: "Sincelejo",
    startsAt: "2026-10-15T20:00:00.000Z",
    endsAt: null as string | null,
    allDay: false,
  };
}

describe("buildGoogleCalendarUrl", () => {
  it("genera una URL de plantilla de Google Calendar con los parámetros codificados", () => {
    const url = buildGoogleCalendarUrl(baseEvent());
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(parsed.searchParams.get("action")).toBe("TEMPLATE");
    expect(parsed.searchParams.get("text")).toBe("Festival de Octubre");
    expect(parsed.searchParams.get("location")).toBe("Sincelejo");
    expect(parsed.searchParams.get("details")).toBe("Una gran fiesta");
  });

  it("usa formato de fecha+hora en UTC para eventos con hora", () => {
    const url = buildGoogleCalendarUrl(baseEvent());
    const dates = new URL(url).searchParams.get("dates");
    expect(dates).toMatch(/^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/);
    expect(dates?.startsWith("20261015T200000Z")).toBe(true);
  });

  it("usa formato de solo fecha (todo el día) cuando allDay es true", () => {
    const url = buildGoogleCalendarUrl({ ...baseEvent(), allDay: true });
    const dates = new URL(url).searchParams.get("dates");
    expect(dates).toMatch(/^\d{8}\/\d{8}$/);
  });

  it("respeta endsAt para eventos de varios días", () => {
    const url = buildGoogleCalendarUrl({
      ...baseEvent(),
      allDay: true,
      startsAt: "2026-10-15T00:00:00.000Z",
      endsAt: "2026-10-18T00:00:00.000Z",
    });
    const dates = new URL(url).searchParams.get("dates");
    // Fin exclusivo para eventos de todo el día en Google Calendar: un día después del último día real.
    expect(dates).toBe("20261015/20261019");
  });
});

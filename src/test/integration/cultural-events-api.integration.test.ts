import { NextRequest } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestPrisma, resetTestDatabase } from "@/test/utils/test-db";
import { applyTestEnv } from "@/test/utils/test-env";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("rutas públicas de eventos y agenda cultural", () => {
  beforeAll(async () => {
    await prisma!.$connect();
  });
  afterAll(async () => {
    await prisma!.$disconnect();
  });
  beforeEach(async () => {
    await resetTestDatabase(prisma!);
    vi.resetModules();
  });

  describe("GET /api/cultural-events", () => {
    it("devuelve solo eventos publicados del mes pedido, ordenados por fecha", async () => {
      await prisma!.culturalEvent.create({
        data: {
          title: "Festival de Octubre",
          description: "Desc",
          category: "Música",
          location: "Sincelejo",
          startsAt: new Date("2026-10-15T20:00:00.000Z"),
          allDay: false,
          published: true,
        },
      });
      await prisma!.culturalEvent.create({
        data: {
          title: "Feria temprana",
          description: "Desc",
          category: "Arte",
          location: "Tolú",
          startsAt: new Date("2026-10-02T00:00:00.000Z"),
          allDay: true,
          published: true,
        },
      });
      await prisma!.culturalEvent.create({
        data: {
          title: "Evento sin publicar",
          description: "Desc",
          category: "Arte",
          location: "Tolú",
          startsAt: new Date("2026-10-10T00:00:00.000Z"),
          allDay: true,
          published: false,
        },
      });
      await prisma!.culturalEvent.create({
        data: {
          title: "Evento de otro mes",
          description: "Desc",
          category: "Arte",
          location: "Tolú",
          startsAt: new Date("2026-11-01T00:00:00.000Z"),
          allDay: true,
          published: true,
        },
      });

      const { GET } = await import("@/app/api/cultural-events/route");
      const res = await GET(
        new NextRequest("http://localhost:3000/api/cultural-events?mes=2026-10"),
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        year: number;
        month: number;
        events: { title: string }[];
      };
      expect(body.year).toBe(2026);
      expect(body.month).toBe(10);
      expect(body.events.map((e) => e.title)).toEqual(["Feria temprana", "Festival de Octubre"]);
    });

    it("mes ausente o inválido responde 400", async () => {
      const { GET } = await import("@/app/api/cultural-events/route");
      const noParam = await GET(new NextRequest("http://localhost:3000/api/cultural-events"));
      expect(noParam.status).toBe(400);
      const badParam = await GET(
        new NextRequest("http://localhost:3000/api/cultural-events?mes=no-es-un-mes"),
      );
      expect(badParam.status).toBe(400);
    });

    it("mes sin eventos devuelve lista vacía", async () => {
      const { GET } = await import("@/app/api/cultural-events/route");
      const res = await GET(
        new NextRequest("http://localhost:3000/api/cultural-events?mes=2030-01"),
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as { events: unknown[] };
      expect(body.events).toEqual([]);
    });
  });

  describe("GET /api/cultural-events/[id]/ics", () => {
    it("devuelve un .ics válido para un evento publicado", async () => {
      const event = await prisma!.culturalEvent.create({
        data: {
          title: "Festival de Octubre",
          description: "Desc",
          category: "Música",
          location: "Sincelejo",
          startsAt: new Date("2026-10-15T20:00:00.000Z"),
          allDay: false,
          published: true,
        },
      });

      const { GET } = await import("@/app/api/cultural-events/[id]/ics/route");
      const res = await GET(
        new NextRequest(`http://localhost:3000/api/cultural-events/${event.id}/ics`),
        {
          params: Promise.resolve({ id: event.id }),
        },
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("text/calendar; charset=utf-8");
      expect(res.headers.get("Content-Disposition")).toContain("attachment");
      const body = await res.text();
      expect(body).toContain("BEGIN:VCALENDAR");
      expect(body).toContain(`UID:${event.id}@descubresucre`);
    });

    it("responde 404 para un id inexistente", async () => {
      const { GET } = await import("@/app/api/cultural-events/[id]/ics/route");
      const res = await GET(
        new NextRequest("http://localhost:3000/api/cultural-events/no-existe/ics"),
        {
          params: Promise.resolve({ id: "no-existe" }),
        },
      );
      expect(res.status).toBe(404);
    });

    it("responde 404 para un evento no publicado", async () => {
      const event = await prisma!.culturalEvent.create({
        data: {
          title: "Borrador",
          description: "Desc",
          category: "Arte",
          location: "Tolú",
          startsAt: new Date("2026-10-15T00:00:00.000Z"),
          published: false,
        },
      });

      const { GET } = await import("@/app/api/cultural-events/[id]/ics/route");
      const res = await GET(
        new NextRequest(`http://localhost:3000/api/cultural-events/${event.id}/ics`),
        {
          params: Promise.resolve({ id: event.id }),
        },
      );
      expect(res.status).toBe(404);
    });
  });
});

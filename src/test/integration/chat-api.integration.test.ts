import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTestEnv } from "@/test/utils/test-env";
import { createTestPrisma, resetTestDatabase } from "@/test/utils/test-db";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;

describeIfDb("chat API routes", () => {
  beforeAll(async () => {
    await prisma!.$connect();
  });

  afterAll(async () => {
    await prisma!.$disconnect();
  });

  beforeEach(async () => {
    await resetTestDatabase(prisma!);
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("POST /api/chat responde 503 si falta webhook", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hola" }] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });

  it("POST /api/chat crea job y llama webhook", async () => {
    process.env.N8N_CALLBACK_SECRET = "test-n8n-secret";
    await prisma!.chatbotSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", n8nWebhookUrl: "https://n8n.local/webhook/chat" },
      update: { n8nWebhookUrl: "https://n8n.local/webhook/chat" },
    });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("@/app/api/chat/route");
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", host: "localhost:3000" },
      body: JSON.stringify({ sessionKey: "s1", messages: [{ role: "user", content: "hola" }] }),
    });
    const res = await POST(req);
    const body = (await res.json()) as { jobId: string };

    expect(res.status).toBe(200);
    expect(body.jobId).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://n8n.local/webhook/chat");
  });

  it("callback marca job DONE y job endpoint lo expone", async () => {
    const job = await prisma!.chatJob.create({ data: { status: "PENDING" } });
    const { POST } = await import("@/app/api/chat/n8n-callback/route");
    const callbackRes = await POST(
      new Request("http://localhost:3000/api/chat/n8n-callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-n8n-secret": process.env.N8N_CALLBACK_SECRET ?? "test-n8n-secret",
        },
        body: JSON.stringify({ jobId: job.id, reply: "Respuesta final" }),
      }),
    );
    expect(callbackRes.status).toBe(200);

    const { GET } = await import("@/app/api/chat/job/[jobId]/route");
    const jobRes = await GET(new Request("http://localhost:3000/api/chat/job"), {
      params: Promise.resolve({ jobId: job.id }),
    });
    const data = (await jobRes.json()) as { status: string; reply?: string };
    expect(data.status).toBe("DONE");
    expect(data.reply).toBe("Respuesta final");
  });
});

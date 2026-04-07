import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTestEnv } from "@/test/utils/test-env";
import { createTestPrisma, resetTestDatabase, seedBaseRoles } from "@/test/utils/test-db";

const hasTestDb = applyTestEnv();
const describeIfDb = hasTestDb ? describe : describe.skip;
const prisma = hasTestDb ? createTestPrisma() : null;
const revalidatePathMock = vi.fn();
const assertAdminActionMock = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/lib/auth-helpers", () => ({ assertAdminAction: assertAdminActionMock }));

describeIfDb("server actions admin", () => {
  beforeAll(async () => {
    await prisma!.$connect();
  });

  afterAll(async () => {
    await prisma!.$disconnect();
  });

  beforeEach(async () => {
    await resetTestDatabase(prisma!);
    await seedBaseRoles(prisma!);
    revalidatePathMock.mockReset();
    assertAdminActionMock.mockResolvedValue({
      ok: true,
      user: { id: "admin-user", accountStatus: "APPROVED", roles: [{ name: "admin" }] },
      session: { user: { id: "admin-user" } },
    });
    vi.resetModules();
  });

  it("createRoleAction crea roles", async () => {
    const { createRoleAction } = await import("@/lib/actions/roles");
    const res = await createRoleAction({ name: "gestor" });
    expect(res.ok).toBe(true);

    const role = await prisma!.role.findUnique({ where: { name: "gestor" } });
    expect(role?.name).toBe("gestor");
  });

  it("createUserAction crea usuario aprobado con hash", async () => {
    const { createUserAction } = await import("@/lib/actions/users");
    const res = await createUserAction({
      email: "nuevo@correo.com",
      name: "Nuevo",
      password: "12345678",
      roleIds: [],
    });
    expect(res.ok).toBe(true);

    const user = await prisma!.user.findUnique({ where: { email: "nuevo@correo.com" } });
    expect(user?.accountStatus).toBe("APPROVED");
    expect(user?.password).not.toBe("12345678");
  });

  it("saveChatbotWebhookAction guarda la url singleton", async () => {
    const { saveChatbotWebhookAction } = await import("@/lib/actions/chatbot-settings");
    const res = await saveChatbotWebhookAction({ n8nWebhookUrl: "https://n8n.local/webhook/abc" });
    expect(res.ok).toBe(true);

    const row = await prisma!.chatbotSettings.findUnique({ where: { id: "singleton" } });
    expect(row?.n8nWebhookUrl).toBe("https://n8n.local/webhook/abc");
  });

  it("registerUserAction crea cuenta PENDING con rol editor", async () => {
    const { registerUserAction } = await import("@/lib/actions/register");
    const res = await registerUserAction({
      email: "registro@correo.com",
      name: "Registro",
      password: "12345678",
    });
    expect(res.ok).toBe(true);

    const user = await prisma!.user.findUnique({
      where: { email: "registro@correo.com" },
      include: { roles: true },
    });
    expect(user?.accountStatus).toBe("PENDING");
    expect(user?.roles.some((r) => r.name === "editor")).toBe(true);
  });
});

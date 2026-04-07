import { expect, test } from "@playwright/test";

test("redirige /admin a login cuando no hay sesión", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);
});

test("redirige /admin/configuracion a login cuando no hay sesión", async ({ page }) => {
  await page.goto("/admin/configuracion");
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin%2Fconfiguracion/);
});

test("flujo chatbot request -> polling -> respuesta", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ jobId: "job-e2e-1" }),
    });
  });

  let pollCount = 0;
  await page.route("**/api/chat/job/job-e2e-1", async (route) => {
    pollCount += 1;
    const payload =
      pollCount > 1
        ? { status: "DONE", reply: "Respuesta e2e desde callback simulado." }
        : { status: "PENDING" };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Abrir chat" }).click();
  await page.getByPlaceholder("Escribe tu pregunta…").fill("Quiero planes en Sincelejo");
  await page.getByRole("button", { name: "Enviar" }).click();

  await expect(page.getByText("Respuesta e2e desde callback simulado.")).toBeVisible();
});

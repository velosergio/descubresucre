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

test("sucre natural: portada → Playas → El Francés", async ({ page }) => {
  await page.goto("/sucre-natural");
  await expect(page.getByRole("heading", { name: "Sucre Natural" })).toBeVisible();
  await expect(page.getByText(/Juana Valentina Patiño Moncada/)).toBeVisible();

  const playas = page.getByRole("link", { name: /Playas de Sucre/ }).first();
  await playas.focus();
  await expect(playas).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/sucre-natural\/playas/);
  await expect(page.getByRole("heading", { name: "Playas de Sucre" })).toBeVisible();

  await page
    .getByRole("link", { name: /El Francés/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/imperdibles\/playa-el-frances/);
  await expect(page.getByRole("heading", { name: /El Francés/ })).toBeVisible();

  const badImgs = page.locator('img[src*="docs/fichas_destinos"]');
  await expect(badImgs).toHaveCount(0);
});

test("sucre natural admin: destacar y despublicar (opcional)", async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    test.skip(true, "Sin E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD");
    return;
  }

  await page.goto("/login");
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin/);

  await page.goto("/admin/personalizar/destinos-imperdibles");
  await expect(page.getByRole("heading", { name: "Destinos imperdibles" })).toBeVisible();
  await page.getByRole("button", { name: "Nuevo" }).click();
  await expect(page.getByText("Destacar en la home (máx. 20)")).toBeVisible();
  await page.getByRole("textbox").nth(0).fill("E2E Sucre Natural");
  await page.getByRole("textbox").nth(1).fill("e2e-sucre-natural");
  await page.getByLabel("Municipio").fill("Tolú");
  await page.getByRole("checkbox", { name: "Playas" }).check();
  await page.getByRole("checkbox", { name: "Publicado" }).uncheck();
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("e2e-sucre-natural")).toBeVisible({ timeout: 15_000 });

  const publicRes = await page.goto("/imperdibles/e2e-sucre-natural");
  expect(publicRes?.status()).toBe(404);
});

test("que hacer: portada muestra heading y Playas abre ficha", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#que-hacer");
  await expect(section.getByRole("heading", { name: /Qué hacer en/ })).toBeVisible();
  await expect(section.getByRole("link", { name: /Playas/ })).toHaveCount(1);
  await section.getByRole("link", { name: /Playas/ }).click();
  await expect(page).toHaveURL(/\/que-hacer\/playas/);
  await expect(page.getByRole("heading", { name: "Playas" })).toBeVisible();
});

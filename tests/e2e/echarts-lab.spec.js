const { test, expect } = require("@playwright/test");

test.describe("Itzamna ECharts comparison lab", () => {
  test("loads the isolated lab and two entity selectors", async ({ page }) => {
    await page.goto("dashboard/echarts-lab.html");
    await expect(page.locator("#echarts-first-entity option")).toHaveCount(32);
    await expect(page.locator("#echarts-second-entity option")).toHaveCount(32);
    await expect(page.locator("#echarts-status")).toContainText("5 periodos");
    await expect(page.locator("#echarts-comparison")).toBeVisible();
    await expect(page.locator("label[for='echarts-first-entity']")).toBeVisible();
    await expect(page.locator("#echarts-status")).toHaveAttribute("role", "status");
    const desktopChart = await page.locator("#echarts-comparison").boundingBox();
    expect(desktopChart.width).toBeGreaterThan(0);
    expect(desktopChart.height).toBeGreaterThan(300);
  });

  test("updates the comparison when the second entity changes", async ({ page }) => {
    await page.goto("dashboard/echarts-lab.html");
    await page.locator("#echarts-second-entity").selectOption("05");
    await expect(page.locator("#echarts-status")).toContainText("2 entidades");
    await expect(page.locator("#echarts-comparison svg")).toBeVisible();
  });

  test("rejects the same entity in both selectors", async ({ page }) => {
    await page.goto("dashboard/echarts-lab.html");
    await page.locator("#echarts-second-entity").selectOption("01");
    await expect(page.locator("#echarts-status")).toHaveText("Selecciona dos entidades distintas.");
  });

  test("keeps the lab usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("dashboard/echarts-lab.html");
    const toolbarBounds = await page.locator(".echarts-toolbar").boundingBox();
    const mobileChart = await page.locator("#echarts-comparison").boundingBox();
    expect(toolbarBounds.width).toBeLessThanOrEqual(390);
    expect(mobileChart.width).toBeLessThanOrEqual(toolbarBounds.width);
    expect(mobileChart.height).toBeGreaterThan(300);
    await expect(page.locator(".echarts-toolbar")).toHaveCSS("grid-template-columns", /px/);
    await expect(page.locator("#echarts-comparison")).toBeVisible();
  });

  test("loads the local chart engine without an external CDN", async ({ page }) => {
    const externalRequests = [];
    page.on("request", (request) => {
      if (request.url().includes("jsdelivr.net")) externalRequests.push(request.url());
    });
    await page.goto("dashboard/echarts-lab.html");
    await expect(page.locator("#echarts-status")).toContainText("6 series");
    expect(externalRequests).toEqual([]);
    const bundle = await page.evaluate(() => performance.getEntriesByType("resource")
      .find((entry) => entry.name.includes("/dashboard/vendor/echarts.esm.min.js")));
    expect(bundle.transferSize).toBeGreaterThan(0);
    expect(bundle.transferSize).toBeLessThan(1_500_000);
  });

  test("exposes keyboard and semantic chart controls", async ({ page }) => {
    await page.goto("dashboard/echarts-lab.html");
    const first = page.locator("#echarts-first-entity");
    const second = page.locator("#echarts-second-entity");
    await first.focus();
    await expect(first).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(second).toBeFocused();
    await expect(first).toHaveAttribute("aria-label", "Seleccionar entidad principal");
    await expect(second).toHaveAttribute("aria-label", "Seleccionar entidad comparativa");
    await expect(page.locator("#echarts-comparison")).toHaveAttribute(
      "aria-label",
      /Comparacion entre entidades/
    );
  });
});

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
    expect(toolbarBounds.width).toBeLessThanOrEqual(390);
    await expect(page.locator(".echarts-toolbar")).toHaveCSS("grid-template-columns", /px/);
    await expect(page.locator("#echarts-comparison")).toBeVisible();
  });
});

const { test, expect } = require("@playwright/test");

test.describe("Itzamna population dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("dashboard/");
    await expect(page.locator("#status-message")).toContainText("Datos oficiales");
  });

  test("loads critical controls and demographic metrics", async ({ page }) => {
    await expect(page.locator("#indicator-filter")).toBeVisible();
    await expect(page.locator("#entity-filter")).toBeVisible();
    await expect(page.locator("#period-filter")).toHaveValue("2020");
    await expect(page.locator("#latest-value")).not.toHaveText("N/D");
    await expect(page.locator("#period-change")).not.toHaveText("N/D");
  });

  test("filters one entity without losing the population metrics", async ({ page }) => {
    await page.locator("#entity-filter").selectOption("05");
    await expect(page.locator("#latest-value")).toHaveText("3,146,771");
    await expect(page.locator("#observation-table tr")).toHaveCount(1);
  });

  test("changes ranking direction", async ({ page }) => {
    await page.locator("#sort-filter").selectOption("asc");
    await expect(page.locator("#entity-ranking li").first()).toContainText("Colima");
  });

  test("keeps the dashboard usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("main.shell")).toBeVisible();
    await expect(page.locator("#entity-ranking")).toBeVisible();
  });
});

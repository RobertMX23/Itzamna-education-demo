const { test, expect } = require("@playwright/test");

test.describe("ECharts visual review evidence", () => {
  test("captures stable SVG and experimental ECharts at desktop and mobile sizes", async ({ page }) => {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 900 },
      { name: "mobile", width: 390, height: 844 }
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("dashboard/");
      await expect(page.locator("main.shell")).toBeVisible();
      const stableOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(stableOverflow).toBe(false);
      await page.screenshot({ path: `test-results/visual-review-stable-${viewport.name}.png`, fullPage: true });

      await page.goto("dashboard/echarts-lab.html");
      await expect(page.locator("#echarts-comparison svg")).toBeVisible();
        const experimentalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(experimentalOverflow).toBe(false);
      await page.screenshot({ path: `test-results/visual-review-echarts-${viewport.name}.png`, fullPage: true });
    }
  });
});

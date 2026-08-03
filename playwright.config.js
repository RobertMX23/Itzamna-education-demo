const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "https://robertmx23.github.io/Itzamna-education-demo/",
    trace: "on-first-retry"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});

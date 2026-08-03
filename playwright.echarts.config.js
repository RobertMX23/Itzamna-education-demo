const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  testMatch: "echarts-lab.spec.js",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:8081/",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "python -m http.server 8081",
    url: "http://127.0.0.1:8081/",
    reuseExistingServer: true,
    timeout: 30000
  }
});

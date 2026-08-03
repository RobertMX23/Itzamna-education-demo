# Browser E2E scenarios

These scenarios are intentionally documented separately from the lightweight
Python smoke suite. They can be automated with Playwright when a browser
runner is available.

1. Open `/dashboard/` and wait for the official population dataset to load.
2. Select another indicator and verify that the period options refresh.
3. Select one entity and verify that the metric and time series use only that entity.
4. Select all entities and verify that the ranking and heatmap remain comparative.
5. Verify the observation table, metadata and status message are visible.
6. Run the same checks at desktop and mobile viewport widths.

The public demo does not install browser dependencies in the Pages artifact.
The independent `.github/workflows/e2e.yml` workflow installs Chromium and
runs these scenarios against the public deployment.

Run locally after installing Node dependencies:

```powershell
npm install
npx playwright install chromium
npm run test:e2e
```

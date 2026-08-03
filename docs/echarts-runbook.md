# ECharts Lab Runbook

## Purpose

The ECharts laboratory is an isolated comparison experience for two entities.
It renders total population, men and women across the available historical
periods without replacing the stable SVG dashboard.

## Runtime boundary

The lab is a static web application:

```text
echarts-lab.html
  -> echarts-lab.js
      -> population_historical.csv
      -> local ECharts bundle
      -> browser-rendered SVG chart
```

GitHub Pages serves the HTML, CSS, JavaScript, CSV and local ECharts bundle.
No backend is required for this demo because the data is versioned and the
filters execute in the browser.

## Data and path contract

The lab loads the dataset with a document-relative URL:

```js
const DATA_URL = "../data/official/population_historical.csv";
```

This path must resolve from both the local dashboard directory and the GitHub
Pages project subdirectory. Root-relative paths such as `/data/...` must not be
introduced because they escape the repository project path on Pages.

## Visualization contract

- Two different entities are required.
- Each entity has three series: `Total`, `Hombres`, `Mujeres`.
- The primary entity uses solid lines.
- The comparison entity uses dashed lines.
- Entity names are displayed in the legend; geographic codes are internal only.
- Tooltip values are formatted as persons using `es-MX`.
- Invalid labels such as `NaN` are not acceptable.

## Acceptance gates

Run the isolated local suite:

```powershell
npm run test:e2e:echarts
```

Run the full public acceptance suite after deployment:

```powershell
npx playwright test --config=playwright.config.js
```

The release is acceptable only when the suite validates data loading, entity
comparison, same-entity rejection, mobile layout, keyboard access, semantic
labels and the absence of external CDN requests.

## GitHub Pages limitations

This demo does not provide server-side execution, authentication, secret
storage, persistent user state or live INEGI API queries. Those capabilities
belong in the private integration or a backend deployment such as Cloud Run.

The public repository must contain only approved static data, local assets and
portfolio documentation. API tokens, `.env` files and production endpoints
remain outside the publication boundary.

## Troubleshooting

For an `HTTP 404` laboratory error:

1. Open DevTools and inspect the Network request for the CSV.
2. Confirm the HTML, JavaScript and CSV each return `200`.
3. Verify that the request includes `/Itzamna-education-demo/`.
4. Refresh with `Ctrl+F5` or use a private window to rule out stale cache.
5. Re-run the public Playwright suite after the Pages deployment completes.


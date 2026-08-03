# ECharts experiment

## Purpose

This branch contains an isolated Apache ECharts comparison lab for the
population historical dataset. It compares total population, men and women
for two selected entities across the available periods.

The stable dashboard remains SVG-based. The experiment does not replace its
HTML, JavaScript, chart adapter or visual contract.

## Current boundary

- Entry point: `dashboard/echarts-lab.html`.
- Data: `data/official/population_historical.csv`.
- Renderer: ECharts SVG renderer.
- Library: Apache ECharts `6.1.0`, pinned in `package.json` and vendored as
  `dashboard/vendor/echarts.esm.min.js` for static hosting.
- Comparison: exactly two distinct entities and three population series per
  entity.
- Hosting: compatible with static GitHub Pages because the lab uses browser
  modules and does not require a backend at runtime.

## Acceptance criteria

The experiment is considered valid when:

1. The CSV loads with quoted values and UTF-8 labels intact.
2. Both selectors expose the 32 entities.
3. Changing the comparison entity updates the chart and status.
4. Selecting the same entity is rejected with an explicit message.
5. The chart has usable dimensions on desktop and remains within the mobile
   viewport.
6. Controls and status are discoverable by assistive technology.
7. Python contracts, smoke tests and ECharts browser tests pass.

## Promotion gate

Do not merge the experiment into the stable dashboard until these decisions
are approved:

- Keep the local bundle synchronized with the pinned dependency and review
  its size during releases.
- Compare bundle size and first-render time against the current SVG chart.
- Complete keyboard, screen-reader and color-contrast review.
- Confirm that the chart remains explanatory and does not imply causality.
- Update the portfolio release manifest and visual review evidence.

## Reproduction

```powershell
npm install
npm run test:e2e:echarts
python -m pytest -q
python tests/smoke_dashboard.py
```

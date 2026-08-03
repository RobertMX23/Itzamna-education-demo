# ECharts Release Decision

## Decision

Keep Apache ECharts as an approved experimental visualization engine for
Project 02. Do not replace the stable SVG dashboard in `main` yet.

## Evidence

- Public GitHub Pages deployment completed successfully.
- Local ECharts acceptance: `8/8 passed`.
- Public acceptance suite: `15/15 passed`.
- The experiment loads its data from a versioned local CSV.
- The chart bundle is local and does not depend on a CDN.
- Two-entity comparison, three sex series, responsive layout and keyboard
  access are covered by automated tests.
- The ECharts visual review is configured for Chromium, Firefox and WebKit;
  CI owns the browser lifecycle and is the authoritative cross-browser run.

## Why this is not a full production promotion

The experiment is intentionally bounded. It does not yet provide a live API
adapter, server-side data refresh, authenticated access, persistent user
state, monitoring or a formal visual baseline across all supported browsers.
Those requirements belong to a later product increment and should not be
introduced into the public Pages demo prematurely.

## Promotion criteria

ECharts may replace the stable SVG path only after all of the following are
approved:

1. A documented data refresh contract exists.
2. Official API integration is tested outside the public repository.
3. Visual regression evidence covers desktop, tablet and mobile across the
   supported browser engines.
4. Performance budgets are measured with the final dataset size.
5. Accessibility review is completed with keyboard and screen-reader checks.
6. A rollback path to the SVG dashboard is rehearsed.

## Rollback

The stable dashboard remains the fallback. Removing the experimental link or
reverting the ECharts branch does not require changing the data contract or
the SVG implementation.

## Review status

Status: approved as a public portfolio experiment.

Scope: Project 02 demo only.

Next review: after the live-data adapter and cross-browser visual baseline are
implemented.

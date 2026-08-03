# Historical Population Series Improvement

## Objective

Extend the population dashboard from a single 2020 cross-section to a
comparable historical census series using only periods present in all three
INEGI indicators: total, male and female population.

## Current Dataset

| Element | Current state |
|---|---|
| Scope | 32 federal entities |
| Periods | 2020 only |
| Indicators | Total, male, female |
| Rows | 96 observations |
| Grain | Entity + sex + period |
| Source | INEGI Banco de Indicadores API v2.0 |
| Dashboard view | 2020 ranking and selected-entity metrics |
| Main chart | 2020 comparison and current dashboard panels |
| Validation | 32 entities, 3 sex categories, total reconciliation |

## Target Dataset

| Element | Target state |
|---|---|
| Scope | 32 federal entities |
| Periods | 1910, 1921, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 1995, 2000, 2005, 2010, 2020 |
| Indicators | Total, male, female |
| Rows | 1,344 observations |
| Grain | Entity + sex + comparable census period |
| Source | INEGI Banco de Indicadores API v2.0 |
| Derived metrics | Absolute change, percentage change, female share, sex gap |
| Main chart | Three-series temporal line chart |
| Comparison chart | Stacked bars for selected periods and entities |
| Quality rule | `total = male + female` for every entity-period |

## API Coverage Decision

The total series contains an additional 2015 observation. Male and female do
not contain 2015, so 2015 is excluded from the comparable three-series target
dataset. It may be displayed only as a total-only observation in a future
explicitly labelled view.

## Fields

| Field | Current | Improvement |
|---|---|---|
| `indicator_id` | Present | Preserve |
| `indicator_name` | Present | Preserve |
| `unit` | `persons` | Preserve technical code; display `personas` |
| `geo_area` | Present | Preserve |
| `geo_name` | Present | Preserve UTF-8 accents |
| `sex` | Present | Preserve `total`, `male`, `female` |
| `time_period` | `2020` | Add 13 comparable periods |
| `value` | Present | Preserve source value |
| `status` | `official` | Preserve |
| `source` | Present | Preserve API lineage |
| `source_url` | Present | Preserve token-free endpoint |
| `extraction_date` | Present | Refresh per extraction |
| `methodology_note` | Present | Document comparable-period rule |
| Derived fields | Not stored | Calculate in transformation/view layer |

## Dashboard Changes

1. Add a period selector with the 14 comparable periods.
2. Keep the entity and indicator selectors unchanged.
3. Replace the single-period temporal panel with a multi-period series.
4. Add a line chart for total, male and female population.
5. Add a period comparison mode using stacked bars.
6. Keep the ranking control and ascending/descending behavior.
7. Show a clear note when a period is unavailable for a selected series.

## Frozen Components

- API token handling.
- Relative CSV path.
- UTF-8 encoding and accent support.
- Existing 2020 values.
- Current metric definitions.
- Existing synthetic fixture.
- Existing QA, smoke and E2E contracts unless their expected period count changes.

## Acceptance Criteria

- 1,344 rows are loaded.
- 32 entities are present for every comparable period.
- Three sex categories exist for every entity-period.
- No 2015 row is included in the three-series comparison dataset.
- Every entity-period satisfies `total = male + female`.
- Historical values are traceable to the API extraction.
- Existing 2020 dashboard behavior remains valid.
- QA, smoke and E2E tests pass.
- No token or private credential is committed.

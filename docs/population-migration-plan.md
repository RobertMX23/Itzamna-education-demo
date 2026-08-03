# Project 02: Population Dashboard Migration Plan

## Approved objective

Replace the education demonstration scope with a descriptive population
dashboard using official 2020 data for the 32 Mexican federal entities:

- total population;
- male population;
- female population.

The current synthetic education dataset remains preserved as historical QA
fixture until the population dashboard passes its contract and smoke tests.

## Task sequence

| ID | Task | Main files | Deliverable | Gate |
|---|---|---|---|---|
| POP-01 | Freeze the approved scope and data contract | `scope.yaml`, `dashboard/dashboard_spec.yaml` | Population bounded context and rules | Contract review |
| POP-02 | Create the official-data boundary | `data/official/README.md`, `data/official/population_2020.csv` | Source schema and lineage fields | Data review |
| POP-03 | Load and normalize the 32 entities | `dashboard/app.js`, optional `src/` script if added | Canonical entity and indicator catalog | 96-row validation |
| POP-04 | Replace dashboard controls | `dashboard/index.html`, `dashboard/app.js` | Indicator, entity, period and order filters | UI smoke test |
| POP-05 | Replace KPI calculations | `dashboard/app.js`, `dashboard/index.html` | Total, composition and gender gap metrics | Formula tests |
| POP-06 | Implement executive visualizations | `dashboard/app.js`, `dashboard/styles.css` | Ranking, stacked composition and table | Visual review |
| POP-07 | Add data-quality and semantic validation | `tests/test_dashboard_contract.py` | Entity, sex, totals and non-negative checks | Unit tests |
| POP-08 | Update documentation and portfolio narrative | `README.md`, `docs/population_eda.md`, `portfolio/case-study.md` | Real-data methodology and limitations | Documentation review |
| POP-09 | Run local acceptance checks | `tests/smoke_dashboard.py`, `tests/e2e/README.md` | Smoke, contract and browser checklist | Release candidate |
| POP-10 | Publish the population release | `.github/workflows/pages.yml`, `portfolio/release-manifest.json` | Versioned GitHub Pages release | Deployment check |

## Implementation order

The work is deliberately staged. POP-01 and POP-02 must pass before the
dashboard source is changed. POP-03 through POP-07 change the application.
POP-08 through POP-10 are release and evidence tasks.

## Official data contract

The canonical file will use one row per entity, indicator and period:

```text
indicator_id,indicator_name,unit,geo_area,geo_name,sex,time_period,value,status,source,source_url,extraction_date,methodology_note
```

For the first release:

```text
32 entities x 3 sex categories x 1 period = 96 observations
```

The accepted sex categories are `total`, `male` and `female`. The dashboard
must not silently infer total population by adding male and female values.
It may validate the relationship and report a warning when source totals do
not reconcile exactly.

## Dashboard design contract

### Controls

1. Indicator: `Población total`, `Población de hombres`, `Población de mujeres`.
2. Entidad: all 32 entities plus `Todas las entidades`.
3. Periodo: `2020` in the first release, extensible to future census periods.
4. Orden: `Mayor a menor` or `Menor a mayor`.

### Metrics

- selected population value;
- female share of total population;
- absolute female-minus-male gap.

### Visualizations

- horizontal ranking for executive comparison;
- stacked bars for absolute male/female composition;
- 100% stacked bars for proportional composition;
- accessible detail table with exact values and source context.

## Non-goals

- no causal interpretation;
- no fertility or mortality conclusions;
- no annual interpolation between census years;
- no municipal data in this release;
- no map until official geometry and code validation are approved.

## Rollback boundary

The synthetic education fixture and its tests must remain recoverable until
the official population release has passed all gates. A failed population
release must not delete or mutate the existing synthetic fixture.

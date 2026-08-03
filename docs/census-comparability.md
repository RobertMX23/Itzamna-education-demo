# Comparabilidad censal: 2010 y 2020

## Decision

The 2010 period is a valid candidate for Iteration 2, but it is not added to
the dashboard yet. The approved candidate is the **estimated population**
variant because it matches the official INEGI census series used to compare
2010 with 2020. The same definition must be applied across all entities and
sex categories.

## Official evidence

- INEGI's 2010 population system exposes total population, sex and geographic
  dimensions, including an estimated and a non-estimated population option.
- INEGI's 2020 materials expose total, male and female population by federal
  entity.
- The 2010 and 2020 datasets are census-year observations, not annual series;
  the dashboard must label the gap as a census-period change.

Sources:

- [INEGI population system, CPV 2010](https://www.inegi.org.mx/sistemas/olap/Proyectos/bd/censos/cpv2010/PT.asp)
- [INEGI CPV 2010 data catalog](https://www.inegi.org.mx/rnm/index.php/catalog/71)
- [INEGI census series 1990-2020](https://en.www.inegi.org.mx/app/tabulados/interactivos/?pxq=Poblacion_Poblacion_01_e60cd8cf-927f-4b94-823e-972457a12d4b)

## Required contract before integration

1. Use the `estimated` 2010 variant for the cross-census comparison.
2. Use the same entity codes and names as the 2020 extract.
3. Use the same sex categories: `total`, `male`, `female`.
4. Preserve source URL, extraction date, status and methodology note.
5. Validate `total = male + female` for every entity and period.
6. Compare national totals against the cited INEGI publication before release.

## Planned derived metrics

```text
absolute_change = population_2020 - population_2010
percent_change = absolute_change / population_2010 * 100
```

These metrics describe the difference between census observations. They must
not be labeled annual growth and must not imply fertility, mortality or
migration causality.

## Release gate

The 2010 period can enter the dashboard only after a new official CSV,
reconciliation tests, updated metadata and a visual review pass. Until then,
the published MVP remains 2020-only.

# Official Population Data Boundary

This directory contains sanitized, documented official observations.
The first release uses the INEGI Censo de Poblacion y Vivienda 2020,
with total, male and female population for the 32 federal entities.

## Required file

`population_2020.csv`

## Required columns

```text
indicator_id,indicator_name,unit,geo_area,geo_name,sex,time_period,value,status,source,source_url,extraction_date,methodology_note
```

## Validation rules

- exactly 32 unique `geo_area` values;
- exactly one period in the first release: `2020`;
- exactly three sex categories: `total`, `male`, `female`;
- values are numeric and non-negative;
- each entity has the three sex categories;
- `total` is checked against `male + female`, but source totals remain
  authoritative when a reconciliation difference is documented;
- the source URL and extraction date are mandatory;
- no API token, `.env` file or private credential may be stored here.

The official CSV is not created in this task until its values are extracted
and reviewed against the cited INEGI publication. The current CSV was
extracted from INEGI's public 2020 population widget resources and passed the
96-row reconciliation check. The existing `data/synthetic/dashboard.csv`
remains the reproducible education demo fixture.

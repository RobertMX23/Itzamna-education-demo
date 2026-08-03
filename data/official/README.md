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

The current CSV was extracted and validated through the INEGI Banco de
Indicadores API v2.0. The API smoke test confirmed HTTP 200 responses for all
three indicator series across the 32 entities, and the 96 values reconcile
with the existing official dataset. The API token is intentionally excluded
from this repository. The existing `data/synthetic/dashboard.csv` remains the
reproducible education demo fixture.

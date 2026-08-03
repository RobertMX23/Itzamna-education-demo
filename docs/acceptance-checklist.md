# PROJECT-02: checklist de aceptacion

## Resultado de cierre

Estado esperado: `accepted-for-next-iteration`.

| Area | Criterio | Evidencia | Estado |
| --- | --- | --- | --- |
| Alcance | Poblacion total, hombres y mujeres en 32 entidades | `docs/population-migration-plan.md` | [x] |
| Contrato | Indicador, sexo, geografia, periodo, unidad y estado | `dashboard/dashboard_spec.yaml` | [x] |
| Datos | 96 observaciones oficiales de 2020 | `data/official/population_2020.csv` | [x] |
| Lineage | URL, fecha de extraccion y nota metodologica | `data/official/README.md` | [x] |
| Reconciliacion | Total igual a hombres mas mujeres por entidad | `tests/test_population_official_contract.py` | [x] |
| Metricas | Poblacion, participacion femenina y brecha absoluta | `dashboard/app.js` | [x] |
| Ranking | Orden mayor-menor y menor-mayor | `dashboard/index.html` | [x] |
| Dashboard | Filtros, metricas, serie, ranking y tabla | `dashboard/index.html` | [x] |
| Calidad | Contratos de dashboard y dataset oficial | `tests/` | [x] |
| Smoke | Archivos, cobertura, categorias y estado oficial | `tests/smoke_dashboard.py` | [x] |
| Portafolio | Narrativa y EDA reproducibles | `portfolio/case-study.md` | [x] |
| Seguridad | Sin tokens, `.env`, conexion productiva ni SQLite | `README.md` | [x] |

## Validacion ejecutada

```text
python -m unittest discover -s tests -p "test_*.py" -v -> 9 passed
python tests/smoke_dashboard.py -> 96 official observations, 32 entities
node --check dashboard/app.js -> passed
git diff --check -> passed
```

## Pendientes deliberados

- Ejecutar E2E real de Chromium en un runner con navegador disponible.
- Extender la serie a otros censos solo después de revisar comparabilidad.
- Publicar un PDF únicamente después de revisión visual y de secretos.

## Decision

El proyecto se acepta como release candidate de análisis descriptivo de nivel
middle inicial. No se acepta como sistema productivo ni como base para
inferencia causal.

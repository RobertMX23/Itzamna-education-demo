# Itzamna Population Demo

Public portfolio demo of a population indicators dashboard built with
official INEGI 2020 observations. It demonstrates data preparation,
descriptive metrics, validation, responsive HTML/CSS and CI-oriented quality
controls.

## Portfolio description

Este portfolio muestra un flujo completo de analisis descriptivo para
indicadores de poblacion: desde la definicion del contrato y la extraccion
trazable de observaciones oficiales de INEGI hasta la construccion de metricas,
comparaciones territoriales y una interfaz web reproducible. El dashboard
permite explorar poblacion total, hombres y mujeres por entidad y periodo,
revisar la participacion femenina, la brecha absoluta y un ranking territorial
sin perder el contexto de unidad, cobertura y limites metodologicos.

La pieza demuestra habilidades de nivel intermedio inicial en analisis de
datos: estructuracion de datasets, validacion de calidad, calculo de metricas,
documentacion, visualizacion y automatizacion de verificaciones. La separacion
entre datos, analisis, dashboard y evidencia facilita revisar cada decision y
reutilizar el flujo en futuros proyectos.

Este repositorio es una demostracion publica y segura. Utiliza una extraccion
versionada de datos oficiales de INEGI, no contiene secretos ni depende de una
conexion productiva en tiempo de ejecucion. Las conclusiones son descriptivas
y no deben interpretarse como causalidad.

## Demo

- [Live portfolio page](https://robertmx23.github.io/Itzamna-education-demo/)
- [Live dashboard](https://robertmx23.github.io/Itzamna-education-demo/dashboard/)
- [Open dashboard](dashboard/index.html)
- [Case study](portfolio/case-study.md)
- [Release manifest](portfolio/release-manifest.json)
- [Visual review](docs/visual-review.md)
- [ECharts experiment](docs/echarts-experiment.md)
- [ECharts versus SVG evaluation](docs/echarts-vs-svg-evaluation.md)
- [ECharts runbook](docs/echarts-runbook.md)
- [ECharts release decision](docs/echarts-release-decision.md)
- [Executive review checklist](docs/executive-review-checklist.md)

## Publication flow

1. GitHub Pages is enabled with **GitHub Actions** as the publishing source.
2. The `pages.yml` workflow packages the repository as a static artifact.
3. The artifact is deployed to the `github-pages` environment.
4. The root page redirects visitors to the dashboard.
5. A reviewer can inspect the live page, the dashboard, the case study and
   the release manifest independently.

The publication boundary is intentional: this public repository contains the
portfolio presentation and an approved, versioned 2020 extract only. The
private INEGI integration, credentials, operational files and live production
access remain outside this repository.

## Safety boundary

This repository contains no API token, `.env` file, production connection or
SQLite database. The CSV contains only the approved 2020 population extract,
with source URL, extraction date and methodology note preserved for lineage.

## Local run

```powershell
python -m http.server 8080
```

Open `http://127.0.0.1:8080/dashboard/`.

## QA checks

```powershell
python -m unittest discover -s tests -p "test_*.py" -v
python tests/smoke_dashboard.py
```

The contract tests validate the official schema, 32-entity population
reconciliation, critical dashboard selectors and relative dataset paths.
Browser scenarios are documented in
`tests/e2e/README.md` and can be enabled in a runner with Playwright.

## Scope

This is a bounded portfolio artifact, not the private INEGI integration
repository and not a production service. The earlier education prototype is
preserved in the repository history and migration notes.

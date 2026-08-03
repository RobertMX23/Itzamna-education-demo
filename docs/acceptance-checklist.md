# EDU-26: checklist de aceptación

## Resultado de cierre

Estado esperado: `accepted-for-next-iteration`.

| Área | Criterio | Evidencia | Estado |
| --- | --- | --- | --- |
| Alcance | Preguntas y exclusiones documentadas | `scope.yaml` | [x] |
| Contrato | Metadata, geografía, unidad y observaciones definidas | `data/synthetic/contract.yaml` | [x] |
| Datos | Fixture sintético con 60 observaciones | `data/synthetic/catalog.json` | [x] |
| Normalización | Tabla plana reproducible | `scripts/normalize_education_dataset.py` | [x] |
| Métricas | Cambio, ranking y brecha | `scripts/compute_education_metrics.py` | [x] |
| Relaciones | Correlación descriptiva con límites | `docs/relationships.md` | [x] |
| Segmentación | Bandas relativas no oficiales | `docs/segmentation.md` | [x] |
| Consolidación | CSV único para dashboard | `data/synthetic/dashboard.csv` | [x] |
| Dashboard | Filtros, métricas, serie y ranking | `dashboard/index.html` | [x] |
| Calidad | Validador del artefacto | `scripts/validate_education_dashboard_artifact.py` | [x] |
| QA | Unit, smoke y E2E preparado | `tests/` | [x] |
| CI | Job independiente del Proyecto 02 | `.github/workflows/ci.yml` | [x] |
| Portafolio | Narrativa sanitizada | `portfolio/case-study.md` | [x] |
| Semantica | La seleccion individual no mezcla entidades | `dashboard/app.js` | [x] |
| Comparacion | El ranking usa indicador y periodo seleccionados | `dashboard/app.js` | [x] |
| Contexto | Unidad, estado y cobertura visibles | `dashboard/index.html` | [x] |
| Heatmap | Entidad x periodo con variacion porcentual | `dashboard/index.html` | [x] |
| Transparencia | Tabla accesible de observaciones | `dashboard/index.html` | [x] |

## Pendientes deliberados

- Ejecutar E2E real de Chromium en un runner con navegador disponible.
- Sustituir el fixture por datos reales solo después de revisar autorización,
  metadata, cobertura y seguridad.
- Publicar un PDF únicamente después de una revisión visual y de secretos.

## Decisión

El proyecto se acepta como MVP analítico de nivel middle inicial y queda listo
para una siguiente iteración. No se acepta como sistema productivo ni como
base para inferencia causal.

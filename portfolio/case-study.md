# Project 02: Education Dashboard

## Resumen ejecutivo

Este proyecto convierte un conjunto sintetico de indicadores educativos en un
flujo analitico reproducible y una interfaz de exploracion territorial. El
objetivo es demostrar como se pasa de un contrato de datos a una lectura clara,
validada y trazable.

## El problema

Los indicadores educativos suelen estar separados por indicador, entidad,
periodo y unidad. Para compararlos sin perder contexto se necesita normalizar
observaciones, conservar metadata, calcular cambios derivados y exponer los
limites de interpretacion.

## Que construi

1. Defini alcance, preguntas y exclusiones.
2. Seleccione cuatro indicadores de educacion.
3. Defini un contrato de datos y valide geografia, periodo, unidad y estado.
4. Normalice 60 observaciones en una tabla analitica.
5. Calcule cambio interperiodo, ranking y brecha territorial.
6. Anadi relaciones descriptivas y segmentacion relativa por entidad.
7. Consolide el dataset que consume el dashboard.
8. Automatice smoke tests, pruebas unitarias y controles de CI.

## Lectura del dashboard

El lector puede seleccionar indicador, entidad y periodo. La interfaz muestra
ultimo valor, cambio porcentual, observaciones, serie temporal y ranking
territorial. Las etiquetas `high`, `middle` y `low` son bandas internas del
analisis, no categorias oficiales.

## Resultado tecnico

| Evidencia | Resultado |
| --- | --- |
| Observaciones | 60 |
| Indicadores | 4 |
| Entidades | 3 |
| Periodos | 2016-2020 |
| Pruebas Python | 40+ |
| Smoke test | 4 rutas criticas |
| Artefacto | `data/synthetic/dashboard.csv` |

## Calidad y seguridad

- El fixture esta marcado como sintetico.
- No contiene tokens, secretos ni conexion productiva.
- El CSV se regenera desde `catalog.json`; no es una fuente manual.
- CI rechaza duplicados, valores fuera de rango y columnas faltantes.
- El analisis diferencia hechos observados de interpretaciones.

## Limites

La correlacion no demuestra causalidad. Las bandas territoriales son relativas
al rango observado. Antes de usar datos reales se deben revisar cobertura,
frecuencia, poblacion de referencia, notas metodologicas y autorizacion de
publicacion.

## Evidencia reproducible

- [Alcance](../scope.yaml)
- [Plan analitico](../docs/analysis-plan.md)
- [EDA](../docs/analysis/education_eda.md)
- [Runbook del pipeline](../docs/pipeline-runbook.md)
- [Especificacion del dashboard](../dashboard/dashboard_spec.yaml)
- [Dashboard](../dashboard/index.html)

## Competencias demostradas

Este proyecto evidencia analisis descriptivo, preparacion de datos, diseno de
metricas, validacion de calidad, visualizacion, documentacion tecnica y una
base de automatizacion CI. No pretende presentarse como sistema productivo ni
como evidencia de inferencia estadistica avanzada.

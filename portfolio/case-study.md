# Project 02: Population Dashboard

## Resumen ejecutivo

Este proyecto convierte un extracto oficial de poblacion 2020 en un flujo
analitico reproducible y una interfaz de exploracion territorial. El objetivo
es demostrar como se pasa de un contrato de datos a una lectura clara,
validada y trazable.

## El problema

Los indicadores demograficos suelen estar separados por indicador, entidad,
periodo, sexo y unidad. Para compararlos sin perder contexto se necesita
normalizar observaciones, conservar metadata, validar la reconciliacion entre
total y sexo, calcular metricas derivadas y exponer los limites de
interpretacion.

## Que construi

1. Defini alcance, preguntas y exclusiones.
2. Seleccione poblacion total, hombres y mujeres.
3. Defini un contrato de datos y valide geografia, periodo, unidad y estado.
4. Normalice 96 observaciones oficiales en una tabla analitica.
5. Valide que total sea igual a hombres mas mujeres.
6. Calcule participacion femenina, brecha absoluta y ranking territorial.
7. Consolide el dataset que consume el dashboard.
8. Automatice smoke tests, pruebas unitarias y controles de CI.

## Lectura del dashboard

El lector puede seleccionar indicador, entidad, periodo y orden. La interfaz
muestra poblacion seleccionada, participacion femenina, brecha mujeres-
hombres, serie temporal, ranking territorial y tabla de detalle.

## Resultado tecnico

| Evidencia | Resultado |
| --- | --- |
| Observaciones | 96 |
| Indicadores | 3 |
| Entidades | 32 |
| Periodos | 2020 |
| Categorias de sexo | 3 |
| Smoke test | Dataset oficial y rutas criticas |
| Artefacto | `data/official/population_2020.csv` |

## Calidad y seguridad

- No contiene tokens, secretos ni conexion productiva.
- El CSV conserva URL, fecha de extraccion y nota metodologica.
- CI rechaza columnas faltantes, categorias invalidas y totales no reconciliables.
- El analisis diferencia hechos observados de interpretaciones.

## Limites

La composicion por sexo no demuestra causalidad ni igualdad sustantiva. Antes
de extender el proyecto a otros periodos se deben revisar cobertura,
frecuencia, poblacion de referencia, notas metodologicas y autorizacion de
publicacion.

## Evidencia reproducible

- [Alcance](../scope.yaml)
- [Plan analitico](../docs/analysis-plan.md)
- [EDA](../docs/population_eda.md)
- [Runbook del pipeline](../docs/pipeline-runbook.md)
- [Especificacion del dashboard](../dashboard/dashboard_spec.yaml)
- [Dashboard](../dashboard/index.html)

## Competencias demostradas

Este proyecto evidencia analisis descriptivo, preparacion de datos, diseno de
metricas, validacion de calidad, visualizacion, documentacion tecnica y una
base de automatizacion CI. No pretende presentarse como sistema productivo ni
como evidencia de inferencia estadistica avanzada.

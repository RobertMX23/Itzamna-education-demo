# EDU-15: segmentacion descriptiva

## Objetivo

Ordenar entidades para un indicador educativo y periodo, generando una banda
relativa que facilite la lectura del dashboard.

## Regla

1. Se selecciona un indicador y el ultimo periodo disponible, salvo que se
   especifique otro.
2. Las entidades se ordenan de mayor a menor valor.
3. `gap_from_max` es `maximo - valor_entidad`.
4. `gap_from_max_percent` expresa esa brecha respecto al maximo.
5. `high`, `middle` y `low` son bandas relativas del rango observado.

Estas bandas son etiquetas analiticas del proyecto, no categorias oficiales,
niveles de desarrollo ni recomendaciones de politica publica.

## Limites

- Un solo indicador no describe toda la situacion educativa.
- Con pocos territorios, las bandas son especialmente sensibles a valores
  extremos.
- No se debe comparar directamente indicadores con unidades distintas.
- Los datos sinteticos solo validan el pipeline, no conclusiones reales.

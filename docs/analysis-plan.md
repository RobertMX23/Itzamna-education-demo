# Project 02: plan analitico

## Objetivo

Construir una lectura descriptiva de indicadores educativos por entidad y
periodo. El resultado debe permitir comparar niveles, cambios y brechas sin
presentar una explicacion causal.

## Flujo de trabajo

1. Seleccionar indicadores y documentar su metadata.
2. Validar claves, unidades, periodos, cobertura y valores faltantes.
3. Normalizar nombres de entidades y representacion de porcentajes.
4. Cargar una tabla analitica en SQLite.
5. Perfilar distribuciones, rangos y valores extremos.
6. Calcular cambios interperiodo y brechas territoriales.
7. Comparar indicadores en el mismo periodo disponible.
8. Comunicar hallazgos, incertidumbres y limites.

## Metricas derivadas

### Cambio porcentual

```text
((valor_periodo_actual - valor_periodo_anterior)
 / valor_periodo_anterior) * 100
```

Se debe omitir o marcar el cambio cuando el periodo anterior sea nulo o cero.

### Brecha territorial

```text
valor_maximo_del_periodo - valor_minimo_del_periodo
```

La brecha se reporta como diferencia descriptiva. No se interpreta como
desigualdad causal sin contexto metodologico adicional.

## Criterios de interpretacion

- Separar hechos observados de explicaciones posibles.
- Mostrar la cobertura disponible junto a cada resultado.
- No comparar porcentajes de unidades distintas.
- No mezclar periodos de referencia diferentes.
- Documentar si un indicador es estimado, censal o administrativo.

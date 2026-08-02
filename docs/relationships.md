# Relaciones descriptivas entre indicadores

## Comparacion exploratoria

EDU-14 compara asistencia y cobertura en las mismas entidades y periodos. La
unidad de observacion es `entidad-periodo`, evitando mezclar series que no
sean comparables.

La medida utilizada es la correlacion de Pearson exploratoria:

```text
r = covarianza(x, y) / (desviacion(x) * desviacion(y))
```

## Interpretacion

Una correlacion positiva indica que, dentro del fixture y sus periodos
comparables, los valores tienden a moverse en una direccion similar. No indica
que la asistencia cause la cobertura ni que una politica especifica explique
el resultado.

## Limites

- El fixture contiene pocos pares de observacion.
- Los datos son sinteticos.
- No se realizan pruebas de significancia.
- La comparabilidad real depende de las poblaciones de referencia, notas y
  metodologias de cada indicador.
- Los valores estimados se conservan, pero deben revisarse antes de una
  conclusion formal.

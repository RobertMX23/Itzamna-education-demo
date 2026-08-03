# EDA: poblacion 2020

## Pregunta analitica

Como lectura descriptiva, el dashboard responde tres preguntas:

1. Cuanta poblacion registra cada entidad en 2020?
2. Como se distribuye el total entre mujeres y hombres?
3. Que entidades ocupan las primeras posiciones cuando se ordena el total?

## Alcance del dataset

| Dimension | Resultado |
| --- | --- |
| Observaciones | 96 |
| Entidades federativas | 32 |
| Indicadores | 3 |
| Categorias de sexo | total, male, female |
| Periodo | 2020 |
| Unidad | Personas |
| Estado | official |

Cada fila representa una combinacion de entidad, indicador y periodo. La
fuente, URL, fecha de extraccion y nota metodologica se conservan para que
el resultado sea auditable.

## Validaciones exploratorias

- Cada una de las 32 entidades tiene exactamente tres categorias de sexo.
- Todos los valores son numericos y no negativos.
- El total satisface `total = male + female` en cada entidad.
- El dashboard suma los valores cuando se seleccionan todas las entidades;
  no calcula un promedio de poblacion.
- La cobertura inicial se limita al periodo 2020 y no interpola anos faltantes.

## Metricas derivadas

### Participacion femenina

```text
participacion_femenina = mujeres / total * 100
```

Se presenta como una composicion descriptiva del total seleccionado. No es
una medida de bienestar, igualdad ni causalidad.

### Brecha mujeres-hombres

```text
brecha = mujeres - hombres
```

El signo conserva la direccion de la diferencia. La unidad es personas y el
valor depende del periodo y de la entidad seleccionados.

### Ranking territorial

El ranking ordena el indicador elegido por valor, de mayor a menor por
defecto, con opcion inversa. El periodo aparece junto al titulo para evitar
comparaciones ambiguas.

## Lectura ejecutiva

La vista principal prioriza el ranking y el valor absoluto porque son las
lecturas mas directas para comparar entidades. La participacion femenina y la
brecha agregan contexto demografico sin sustituir la lectura del valor total.
La tabla conserva el detalle exacto para revisar una cifra antes de usarla.

## Limites

- El corte es censal 2020; no representa una serie anual continua.
- La comparacion es descriptiva y no prueba causas.
- No se incluyen municipios, migracion, natalidad ni mortalidad.
- La fuente publica se versiona como extracto; la consulta productiva y sus
  credenciales permanecen en el repositorio privado.

## Reproducibilidad

- Dataset: `data/official/population_2020.csv`
- Contrato: `dashboard/dashboard_spec.yaml`
- Validacion oficial: `tests/test_population_official_contract.py`
- Smoke test: `tests/smoke_dashboard.py`
- Fuente: [INEGI Widgets de Poblacion](https://www.inegi.org.mx/servicios/widgets_poblacion.html)

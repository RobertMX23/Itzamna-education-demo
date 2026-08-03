# EDU-28: revision visual y paquete demo

## Auditoria automatica

```powershell
python scripts/audit_dashboard_visuals.py
```

La auditoria verifica viewport, landmarks accesibles, paneles principales,
reglas responsive y que no se oculte artificialmente el overflow horizontal.

## Revision manual

Abrir el dashboard y comprobar en 1440 px, 1024 px y 390 px:

- El titulo no domina el espacio destinado a los datos.
- Los tres filtros permanecen alineados en escritorio y se apilan en móvil.
- Las tarjetas de métricas tienen jerarquía proporcional.
- La serie y el ranking son legibles sin scroll horizontal.
- El cambio de indicador conserva unidad y periodo.
- El estado sintético es visible.
- No aparecen tokens, rutas privadas ni datos reales.
- La tabla conserva desplazamiento horizontal sin romper el viewport movil.
- El mapa de calor muestra valores y no depende solo del color.
- Unidad, estado y cobertura permanecen visibles despues de cambiar filtros.

## Paquete demo

El demo publicable está compuesto por:

- `dashboard/index.html`
- `dashboard/styles.css`
- `dashboard/app.js`
- `data/synthetic/dashboard.csv`
- `portfolio/case-study.md`
- `portfolio/release-manifest.json`

El paquete no incluye `.env`, bases SQLite, credenciales ni conexión a INEGI.

const SERIES = [
  { sex: "total", label: "Total", color: "#17324a" },
  { sex: "male", label: "Hombres", color: "#ff8a4c" },
  { sex: "female", label: "Mujeres", color: "#70e0b1" }
];

function buildHistoricalOption(dataset, { entityLabel = "Todas las entidades" } = {}) {
  const series = SERIES.map(({ sex, label, color }) => ({
    name: label,
    type: "line",
    smooth: 0.18,
    showSymbol: true,
    symbolSize: 7,
    itemStyle: { color },
    lineStyle: { color, width: 3 },
    encode: { x: "period", y: "value", itemName: "period", tooltip: ["period", "entity", "sex", "value"] },
    datasetIndex: SERIES.findIndex((item) => item.sex === sex) + 1
  }));

  return {
    aria: { show: true, decal: { show: true } },
    animationDuration: 500,
    title: { text: "Serie histórica de población", subtext: entityLabel, left: 0 },
    color: SERIES.map((item) => item.color),
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => Number(value).toLocaleString("es-MX")
    },
    legend: { top: 32, data: SERIES.map((item) => item.label) },
    grid: { left: 58, right: 24, top: 84, bottom: 72, containLabel: true },
    xAxis: { type: "category", name: "Periodo", boundaryGap: false },
    yAxis: { type: "value", name: "Personas", axisLabel: { formatter: (value) => Number(value).toLocaleString("es-MX") } },
    dataZoom: [{ type: "inside" }, { type: "slider", height: 18, bottom: 18 }],
    dataset: [
      { id: "population-source", dimensions: dataset.dimensions, source: dataset.source },
      ...SERIES.map(({ sex }) => ({
        fromDatasetId: "population-source",
        transform: { type: "filter", config: { dimension: "sex", value: sex } }
      }))
    ],
    series
  };
}

export { buildHistoricalOption };

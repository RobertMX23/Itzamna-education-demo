const SEXES = [
  { key: "total", label: "Total", color: "#17324a" },
  { key: "male", label: "Hombres", color: "#ff8a4c" },
  { key: "female", label: "Mujeres", color: "#70e0b1" }
];

const ENTITY_COLORS = ["#17324a", "#5aa9e6"];

function buildComparisonOption(dataset, firstEntity, secondEntity) {
  const entities = [firstEntity, secondEntity];
  if (entities.some((entity) => !entity) || firstEntity === secondEntity) {
    throw new Error("Comparison requires two different entities");
  }

  const datasets = [{ id: "comparison-source", dimensions: dataset.dimensions, source: dataset.source }];
  const series = [];
  entities.forEach((entity, entityIndex) => {
    const entityId = `comparison-${entityIndex}`;
    datasets.push({
      id: entityId,
      fromDatasetId: "comparison-source",
      transform: { type: "filter", config: { dimension: "entity", value: entity } }
    });
    SEXES.forEach((sex) => {
      const datasetId = `${entityId}-${sex.key}`;
      datasets.push({
        id: datasetId,
        fromDatasetId: entityId,
        transform: { type: "filter", config: { dimension: "sex", value: sex.key } }
      });
      series.push({
        name: `${entity} - ${sex.label}`,
        type: "line",
        smooth: 0.18,
        showSymbol: true,
        symbolSize: 6,
        itemStyle: { color: entityIndex === 0 ? sex.color : ENTITY_COLORS[1] },
        lineStyle: {
          color: entityIndex === 0 ? sex.color : ENTITY_COLORS[1],
          width: sex.key === "total" ? 4 : 2,
          type: entityIndex === 0 ? "solid" : "dashed"
        },
        datasetId,
        encode: { x: "period", y: "value", tooltip: ["period", "entity", "sex", "value"] }
      });
    });
  });

  return {
    aria: { show: true, decal: { show: true } },
    title: { text: "Comparacion entre entidades", subtext: `${firstEntity} vs ${secondEntity}`, left: 0 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => Number(value).toLocaleString("es-MX")
    },
    legend: { type: "scroll", top: 32 },
    grid: { left: 58, right: 24, top: 96, bottom: 72, containLabel: true },
    xAxis: { type: "category", name: "Periodo", boundaryGap: false },
    yAxis: { type: "value", name: "Personas", axisLabel: { formatter: (value) => Number(value).toLocaleString("es-MX") } },
    dataZoom: [{ type: "inside" }, { type: "slider", height: 18, bottom: 18 }],
    dataset: datasets,
    series
  };
}

export { buildComparisonOption };

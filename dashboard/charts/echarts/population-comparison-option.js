const SEXES = [
  { key: "total", label: "Total", color: "#17324a" },
  { key: "male", label: "Hombres", color: "#ff8a4c" },
  { key: "female", label: "Mujeres", color: "#70e0b1" }
];

const ENTITY_COLORS = ["#17324a", "#5aa9e6"];
const COMPARISON_SEX_COLORS = {
  total: "#5aa9e6",
  male: "#7bc8d9",
  female: "#b59ae8"
};

function buildComparisonOption(dataset, firstEntity, secondEntity) {
  const entities = [firstEntity, secondEntity];
  if (entities.some((entity) => !entity) || firstEntity === secondEntity) {
    throw new Error("Comparison requires two different entities");
  }

  const entityNames = new Map(dataset.source.map((row) => [row[1], row[4]]));
  const entityLabel = (entity) => entityNames.get(entity) || entity;

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
        name: `${entityLabel(entity)} - ${sex.label}`,
        type: "line",
        smooth: 0.18,
        showSymbol: true,
        symbolSize: 6,
        itemStyle: { color: entityIndex === 0 ? sex.color : COMPARISON_SEX_COLORS[sex.key] },
        lineStyle: {
          color: entityIndex === 0 ? sex.color : COMPARISON_SEX_COLORS[sex.key],
          width: sex.key === "total" ? 4 : 2,
          type: entityIndex === 0 ? "solid" : "dashed"
        },
        datasetId,
        encode: { x: "period", y: "value" }
      });
    });
  });

  return {
    aria: { show: true, decal: { show: true } },
    title: { text: "Comparación entre entidades", subtext: `${entityLabel(firstEntity)} vs ${entityLabel(secondEntity)}`, left: 0 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => Number(value).toLocaleString("es-MX"),
      formatter: (params) => {
        const period = params[0]?.axisValue || "";
        const lines = params.map((item) => `${item.marker}${item.seriesName}: ${Number(item.value[3]).toLocaleString("es-MX")} personas`);
        return [`<strong>Periodo: ${period}</strong>`, ...lines].join("<br>");
      }
    },
    legend: { type: "scroll", top: 32, left: 0, right: 0, orient: "horizontal" },
    grid: { left: 58, right: 24, top: 96, bottom: 72, containLabel: true },
    xAxis: { type: "category", name: "Periodo", boundaryGap: false },
    yAxis: { type: "value", name: "Personas", axisLabel: { formatter: (value) => Number(value).toLocaleString("es-MX") } },
    dataZoom: [{ type: "inside" }, { type: "slider", height: 18, bottom: 18 }],
    dataset: datasets,
    series
  };
}

export { buildComparisonOption };

import * as echarts from "../../vendor/echarts.esm.min.js";
import { parsePopulationCsv } from "./population-lab-data.js";
import { toHistoricalDataset } from "./population-adapter.js";
import { buildComparisonOption } from "./population-comparison-option.js";

const DATA_URL = "../../../data/official/population_historical.csv";
const firstSelect = document.getElementById("echarts-first-entity");
const secondSelect = document.getElementById("echarts-second-entity");
const status = document.getElementById("echarts-status");
const chartContainer = document.getElementById("echarts-comparison");
const chart = echarts.init(chartContainer, null, { renderer: "svg" });

let rows = [];

function populateEntities() {
  const entities = [...new Map(rows.map((row) => [row.geo_area, row])).values()];
  const options = entities.map((row) => `<option value="${row.geo_area}">${row.geo_name}</option>`).join("");
  firstSelect.innerHTML = options;
  secondSelect.innerHTML = options;
  firstSelect.value = entities[0].geo_area;
  secondSelect.value = entities[1].geo_area;
}

function renderComparison() {
  const first = firstSelect.value;
  const second = secondSelect.value;
  if (first === second) {
    status.textContent = "Selecciona dos entidades distintas.";
    return;
  }
  const dataset = toHistoricalDataset(rows, { entities: [first, second] });
  chart.setOption(buildComparisonOption(dataset, first, second), true);
  chart.resize({ width: chartContainer.clientWidth, height: chartContainer.clientHeight });
  requestAnimationFrame(() => chart.resize());
  status.textContent = `${dataset.periods.length} periodos · 2 entidades · 6 series`;
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    rows = parsePopulationCsv(await response.text());
    populateEntities();
    firstSelect.addEventListener("change", renderComparison);
    secondSelect.addEventListener("change", renderComparison);
    window.addEventListener("resize", () => chart.resize());
    new ResizeObserver(() => chart.resize()).observe(chartContainer);
    renderComparison();
  } catch (error) {
    status.textContent = `No se pudo cargar el laboratorio: ${error.message}`;
  }
}

init();

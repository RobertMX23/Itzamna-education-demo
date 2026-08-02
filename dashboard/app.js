const DATA_URL = "../data/synthetic/dashboard.csv";
const state = { rows: [], indicatorId: "", entity: "all", period: "" };

const $ = (id) => document.getElementById(id);
const formatValue = (value, unit) => `${Number(value).toLocaleString("es-MX", { maximumFractionDigits: 1 })}${unit === "percent" ? "%" : ""}`;

function parseCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const fields = header.split(",");
  return lines.map((line) => Object.fromEntries(line.split(",").map((value, index) => [fields[index], value])));
}

function selectedRows() {
  return state.rows.filter((row) => row.indicator_id === state.indicatorId && (state.entity === "all" || row.geo_area === state.entity));
}

function populateControls(rows) {
  const indicators = [...new Map(rows.map((row) => [row.indicator_id, row])).values()];
  const entities = [...new Map(rows.map((row) => [row.geo_area, row])).values()];
  $("indicator-filter").innerHTML = indicators.map((row) => `<option value="${row.indicator_id}">${row.indicator_name}</option>`).join("");
  $("entity-filter").innerHTML = `<option value="all">Todas las entidades</option>${entities.map((row) => `<option value="${row.geo_area}">${row.geo_name}</option>`).join("")}`;
  state.indicatorId = indicators[0].indicator_id;
  state.period = Math.max(...rows.map((row) => Number(row.time_period))).toString();
  renderPeriodOptions();
}

function renderPeriodOptions() {
  const periods = [...new Set(state.rows.filter((row) => row.indicator_id === state.indicatorId).map((row) => row.time_period))].sort();
  $("period-filter").innerHTML = periods.map((period) => `<option value="${period}">${period}</option>`).join("");
  if (!periods.includes(state.period)) state.period = periods.at(-1);
  $("period-filter").value = state.period;
}

function render() {
  const rows = selectedRows().sort((a, b) => Number(a.time_period) - Number(b.time_period));
  const current = rows.find((row) => row.time_period === state.period) || rows.at(-1);
  const previous = rows[rows.indexOf(current) - 1];
  $("latest-value").textContent = current ? formatValue(current.value, current.unit) : "N/D";
  $("latest-period").textContent = current?.time_period || "-";
  $("period-change").textContent = current && previous ? `${((current.value - previous.value) / previous.value * 100).toFixed(2)}%` : "N/D";
  $("observation-count").textContent = rows.length;
  $("series-range").textContent = rows.length ? `${rows[0].time_period}–${rows.at(-1).time_period}` : "-";
  $("ranking-period").textContent = state.period;
  const max = Math.max(...rows.map((row) => Number(row.value)), 1);
  $("time-series").innerHTML = rows.map((row) => `<div class="bar-item"><div class="bar" style="height:${Number(row.value) / max * 88}%" title="${formatValue(row.value, row.unit)}"></div><span class="bar-label">${row.time_period}</span></div>`).join("");
  const ranking = state.rows.filter((row) => row.indicator_id === state.indicatorId && row.time_period === state.period).sort((a, b) => Number(b.value) - Number(a.value));
  $("entity-ranking").innerHTML = ranking.map((row) => `<li><span>${row.geo_name}</span><strong>${formatValue(row.value, row.unit)}</strong></li>`).join("");
  $("status-message").textContent = rows.length ? "Datos sintéticos cargados correctamente." : "No hay observaciones para los filtros seleccionados.";
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.rows = parseCsv(await response.text());
    populateControls(state.rows);
    $("indicator-filter").addEventListener("change", (event) => { state.indicatorId = event.target.value; renderPeriodOptions(); render(); });
    $("entity-filter").addEventListener("change", (event) => { state.entity = event.target.value; render(); });
    $("period-filter").addEventListener("change", (event) => { state.period = event.target.value; render(); });
    render();
  } catch (error) { $("status-message").textContent = `No se pudo cargar el dataset: ${error.message}`; }
}

init();

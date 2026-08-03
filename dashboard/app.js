const DATA_URL = "../data/official/population_historical.csv";
const state = { rows: [], indicatorId: "", entity: "all", period: "", sort: "desc", chartMode: "trend" };

const $ = (id) => document.getElementById(id);
const UNIT_LABELS = { persons: "personas", percent: "%" };
const formatUnitLabel = (unit) => UNIT_LABELS[unit] || unit || "N/D";
const formatValue = (value, unit) => `${Number(value).toLocaleString("es-MX", { maximumFractionDigits: 1 })}${unit === "percent" ? "%" : ""}`;

function parseCsv(text) {
  const records = [];
  let record = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];
    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      record.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      record.push(value);
      if (record.some((field) => field !== "")) records.push(record);
      record = [];
      value = "";
    } else {
      value += character;
    }
  }

  record.push(value);
  if (record.some((field) => field !== "")) records.push(record);
  const [fields, ...rows] = records;
  return rows.map((row) => Object.fromEntries(fields.map((field, index) => [field, row[index] || ""])));
}

function filterByIndicator(rows, indicatorId) {
  return rows.filter((row) => row.indicator_id === indicatorId);
}

function filterByEntity(rows, entity) {
  return entity === "all" ? rows : rows.filter((row) => row.geo_area === entity);
}

function filterByPeriod(rows, period) {
  return rows.filter((row) => row.time_period === period);
}

function selectedRows() {
  return filterByEntity(filterByIndicator(state.rows, state.indicatorId), state.entity);
}

function aggregateByPeriod(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    const values = grouped.get(row.time_period) || [];
    values.push(Number(row.value));
    grouped.set(row.time_period, values);
  });
  return [...grouped.entries()].map(([time_period, values]) => ({
    time_period,
    value: values.reduce((sum, value) => sum + value, 0),
    unit: rows[0]?.unit || "",
    status: values.length === 1 ? rows[0]?.status : "aggregated"
  })).sort((a, b) => Number(a.time_period) - Number(b.time_period));
}

function calculatePercentChange(rows, currentPeriod) {
  const ordered = [...rows].sort((a, b) => Number(a.time_period) - Number(b.time_period));
  const currentIndex = ordered.findIndex((row) => row.time_period === currentPeriod);
  const current = ordered[currentIndex];
  const previous = ordered[currentIndex - 1];
  if (!current || !previous || Number(previous.value) === 0) return null;
  return ((Number(current.value) - Number(previous.value)) / Number(previous.value)) * 100;
}

function aggregateSexValues(rows) {
  return rows.reduce((values, row) => {
    values[row.sex] = (values[row.sex] || 0) + Number(row.value);
    return values;
  }, {});
}

function calculatePopulationMetrics(period) {
  const rows = filterByPeriod(filterByEntity(state.rows, state.entity), period);
  const values = aggregateSexValues(rows);
  const selectedRowsForPeriod = rows.filter((row) => row.indicator_id === state.indicatorId);
  const selectedValue = selectedRowsForPeriod.length
    ? selectedRowsForPeriod.reduce((sum, row) => sum + Number(row.value), 0)
    : null;
  const femaleShare = values.total > 0 ? (values.female / values.total) * 100 : null;
  const genderGap = values.female !== undefined && values.male !== undefined
    ? values.female - values.male
    : null;

  return {
    selectedValue,
    unit: selectedRowsForPeriod[0]?.unit || "persons",
    femaleShare,
    genderGap
  };
}

function buildRanking(rows, period) {
  const direction = state.sort === "asc" ? -1 : 1;
  return filterByPeriod(filterByIndicator(state.rows, state.indicatorId), period)
    .sort((a, b) => direction * (Number(b.value) - Number(a.value)))
    .map((row, index) => ({ ...row, calculatedRank: index + 1 }));
}

function renderMetadata(rows) {
  const first = rows[0];
  const entities = new Set(rows.map((row) => row.geo_area));
  $("indicator-unit").textContent = formatUnitLabel(first?.unit);
  $("data-status").textContent = first?.status || "N/D";
  $("data-coverage").textContent = `${entities.size} entidad(es)`;
}

function renderObservationTable(rows) {
  $("table-summary").textContent = `${rows.length} observacion(es)`;
  $("observation-table").innerHTML = rows.map((row) => `<tr><td>${row.geo_name || "Agregado"}</td><td>${row.time_period}</td><td>${formatValue(row.value, row.unit)}</td><td>${row.percent_change ? `${Number(row.percent_change).toFixed(2)}%` : "N/D"}</td><td>${row.status || "N/D"}</td></tr>`).join("");
}

function renderHeatmap(rows) {
  const entities = [...new Set(rows.map((row) => row.geo_name))];
  const periods = [...new Set(rows.map((row) => row.time_period))].sort();
  const header = `<div class="heatmap-row heatmap-header"><span>Entidad</span>${periods.map((period) => `<span>${period}</span>`).join("")}</div>`;
  const body = entities.map((entity) => {
    const cells = periods.map((period) => {
      const row = rows.find((item) => item.geo_name === entity && item.time_period === period);
      const change = row?.percent_change ? Number(row.percent_change) : 0;
      const tone = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
      return `<span class="heat-cell ${tone}" title="${row ? `${entity}, ${period}: ${change.toFixed(2)}%` : "Sin dato"}">${row ? `${change.toFixed(1)}%` : "-"}</span>`;
    }).join("");
    return `<div class="heatmap-row"><strong>${entity}</strong>${cells}</div>`;
  }).join("");
  $("growth-heatmap").innerHTML = header + body;
}

function renderHistoricalChart(rows) {
  const periods = [...new Set(rows.map((row) => row.time_period))].sort((a, b) => Number(a) - Number(b));
  const series = ["total", "male", "female"].map((sex) => ({
    sex,
    values: periods.map((period) => rows.filter((row) => row.time_period === period && row.sex === sex)
      .reduce((sum, row) => sum + Number(row.value), 0))
  }));
  const max = Math.max(...series.flatMap((item) => item.values), 1);
  const width = 760;
  const height = 270;
  const left = 48;
  const top = 24;
  const chartWidth = width - left - 18;
  const chartHeight = height - top - 44;
  const colors = { total: "#17324a", male: "#c75d3e", female: "#6d9b8a" };
  const labels = { total: "Total", male: "Hombres", female: "Mujeres" };
  const x = (index) => left + (periods.length === 1 ? chartWidth / 2 : (index / (periods.length - 1)) * chartWidth);
  const y = (value) => top + chartHeight - (value / max) * chartHeight;
  const lines = series.map((item) => `<polyline points="${item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ")}" fill="none" stroke="${colors[item.sex]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  const points = series.map((item) => item.values.map((value, index) => `<circle cx="${x(index)}" cy="${y(value)}" r="4" fill="${colors[item.sex]}"/>`).join("")).join("");
  const ticks = periods.map((period, index) => `<text x="${x(index)}" y="${height - 12}" text-anchor="middle">${period}</text>`).join("");
  const legend = series.map((item, index) => `<text x="${left + index * 150}" y="14" fill="${colors[item.sex]}">${labels[item.sex]}</text>`).join("");
  $("time-series").innerHTML = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Serie historica de poblacion por sexo">${legend}<line x1="${left}" y1="${top + chartHeight}" x2="${left + chartWidth}" y2="${top + chartHeight}" stroke="#cbd9d5"/>${lines}${points}${ticks}</svg>`;
}

function renderCompositionChart(rows) {
  const values = aggregateSexValues(filterByPeriod(rows, state.period));
  const items = [{ sex: "male", label: "Hombres", value: values.male || 0 }, { sex: "female", label: "Mujeres", value: values.female || 0 }];
  const max = Math.max(...items.map((item) => item.value), 1);
  $("composition-chart").innerHTML = items.map((item) => `<div class="composition-item"><div class="composition-label"><span>${item.label}</span><strong>${formatValue(item.value, "persons")}</strong></div><div class="composition-track"><span class="composition-fill ${item.sex}" style="width:${item.value / max * 100}%"></span></div></div>`).join("");
}

function updateChartMode() {
  const trend = state.chartMode === "trend";
  $("time-series").hidden = !trend;
  $("composition-chart").hidden = trend;
  $("chart-title").textContent = trend ? "Serie historica" : "Composicion por sexo";
}

function populateControls(rows) {
  const indicators = [...new Map(rows.map((row) => [row.indicator_id, row])).values()]
    .sort((a, b) => ({ "POP-TOTAL": 0, "POP-MALE": 1, "POP-FEMALE": 2 }[a.indicator_id] ?? 99) - ({ "POP-TOTAL": 0, "POP-MALE": 1, "POP-FEMALE": 2 }[b.indicator_id] ?? 99));
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
  const filteredRows = selectedRows();
  const rows = state.entity === "all" ? aggregateByPeriod(filteredRows) : [...filteredRows].sort((a, b) => Number(a.time_period) - Number(b.time_period));
  const populationMetrics = calculatePopulationMetrics(state.period);
  $("latest-value").textContent = populationMetrics.selectedValue === null
    ? "N/D"
    : formatValue(populationMetrics.selectedValue, populationMetrics.unit);
  $("latest-period").textContent = state.period || "-";
  $("period-change").textContent = populationMetrics.femaleShare === null
    ? "N/D"
    : `${populationMetrics.femaleShare.toFixed(2)}%`;
  $("observation-count").textContent = populationMetrics.genderGap === null
    ? "N/D"
    : formatValue(populationMetrics.genderGap, populationMetrics.unit);
  $("series-range").textContent = rows.length ? `${rows[0].time_period}-${rows.at(-1).time_period}` : "-";
  $("ranking-period").textContent = state.period;
  const historicalRows = filterByEntity(state.rows, state.entity);
  renderHistoricalChart(historicalRows);
  renderCompositionChart(historicalRows);
  updateChartMode();
  const ranking = buildRanking(state.rows, state.period);
  $("entity-ranking").innerHTML = ranking.map((row) => `<li><span>${row.geo_name}</span><strong>${formatValue(row.value, row.unit)}</strong></li>`).join("");
  renderMetadata(filteredRows);
  renderObservationTable(filteredRows);
  renderHeatmap(filterByIndicator(state.rows, state.indicatorId));
  $("status-message").textContent = rows.length ? "Datos oficiales de INEGI cargados correctamente." : "No hay observaciones para los filtros seleccionados.";
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
    $("sort-filter").addEventListener("change", (event) => { state.sort = event.target.value; render(); });
    $("chart-mode").addEventListener("change", (event) => { state.chartMode = event.target.value; updateChartMode(); });
    render();
  } catch (error) { $("status-message").textContent = `No se pudo cargar el dataset: ${error.message}`; }
}

init();

/**
 * Converts normalized population rows into ECharts dataset sources.
 * The adapter does not fetch data or mutate the dashboard state.
 */

const SEX_ORDER = ["total", "male", "female"];

function numericValue(row) {
  const value = Number(row.value);
  if (!Number.isFinite(value)) {
    throw new TypeError(`Invalid population value for ${row.geo_area}/${row.time_period}`);
  }
  return value;
}

function sortPeriods(rows) {
  return [...new Set(rows.map((row) => String(row.time_period)))]
    .sort((left, right) => Number(left) - Number(right));
}

function filterRows(rows, { entity = "all", entities = [], periods = [] } = {}) {
  const selectedEntities = entities.length ? new Set(entities) : null;
  const selectedPeriods = periods.length ? new Set(periods.map(String)) : null;
  return rows.filter((row) => {
    const entityMatches = entity === "all" || row.geo_area === entity || selectedEntities?.has(row.geo_area);
    const periodMatches = !selectedPeriods || selectedPeriods.has(String(row.time_period));
    return entityMatches && periodMatches;
  });
}

function toHistoricalDataset(rows, options = {}) {
  const filteredRows = filterRows(rows, options);
  const periods = sortPeriods(filteredRows);
  const entities = [...new Set(filteredRows.map((row) => row.geo_area))].sort();
  const source = [["period", "entity", "sex", "value", "geo_name"]];

  periods.forEach((period) => {
    entities.forEach((entity) => {
      SEX_ORDER.forEach((sex) => {
        const row = filteredRows.find((candidate) => candidate.time_period === period
          && candidate.geo_area === entity
          && candidate.sex === sex);
        if (row) source.push([period, entity, sex, numericValue(row), row.geo_name]);
      });
    });
  });

  return { dimensions: source[0], source: source.slice(1), periods, entities };
}

function toComparisonDataset(rows, firstEntity, secondEntity) {
  if (!firstEntity || !secondEntity || firstEntity === secondEntity) {
    throw new Error("Comparison requires two different entities");
  }
  return toHistoricalDataset(rows, { entities: [firstEntity, secondEntity] });
}

export { filterRows, toHistoricalDataset, toComparisonDataset };

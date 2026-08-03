function parsePopulationCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const fields = header.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(fields.map((field, index) => [field, values[index] || ""]));
  });
}

export { parsePopulationCsv };

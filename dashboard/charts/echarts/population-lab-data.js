function parsePopulationCsv(text) {
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

export { parsePopulationCsv };

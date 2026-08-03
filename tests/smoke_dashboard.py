"""Fast smoke checks for the static dashboard package."""

import csv
import sys
from pathlib import Path


ROOT = Path(__file__).parents[1]
REQUIRED_FILES = (
    ROOT / "index.html",
    ROOT / "dashboard" / "index.html",
    ROOT / "dashboard" / "styles.css",
    ROOT / "dashboard" / "app.js",
    ROOT / "data" / "official" / "population_2020.csv",
)


def main() -> int:
    missing = [str(path.relative_to(ROOT)) for path in REQUIRED_FILES if not path.is_file()]
    if missing:
        print(f"FAIL missing files: {', '.join(missing)}")
        return 1

    with (ROOT / "data" / "official" / "population_2020.csv").open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        print("FAIL dataset is empty")
        return 1

    entities = {row["geo_area"] for row in rows}
    periods = {row["time_period"] for row in rows}
    sexes = {row["sex"] for row in rows}
    required_columns = {"source_url", "extraction_date", "methodology_note"}
    if len(entities) != 32 or periods != {"2020"} or sexes != {"total", "male", "female"}:
        print("FAIL official dataset does not match the population smoke contract")
        return 1
    if not required_columns.issubset(rows[0]):
        print("FAIL official dataset is missing lineage columns")
        return 1
    if not all(row["status"] == "official" for row in rows):
        print("FAIL dataset contains non-official status values")
        return 1

    print(f"PASS dashboard package: {len(rows)} official observations, {len(entities)} entities")
    return 0


if __name__ == "__main__":
    sys.exit(main())

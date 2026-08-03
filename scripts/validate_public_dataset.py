"""Validate the approved public population artifact before publication."""

import csv
import re
import sys
from pathlib import Path


ROOT = Path(__file__).parents[1]
DATASET = ROOT / "data" / "official" / "population_2020.csv"
EXPECTED_SEXES = {"total", "male", "female"}
SECRET_PATTERN = re.compile(r"(?i)(inegi_token|api[_-]?key|bearer\s+[a-z0-9._-]+)")


def load_rows() -> list[dict[str, str]]:
    with DATASET.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def validate(rows: list[dict[str, str]]) -> list[str]:
    errors: list[str] = []
    if len(rows) != 96:
        errors.append(f"expected 96 observations, found {len(rows)}")

    entities = {row["geo_area"] for row in rows}
    if len(entities) != 32:
        errors.append(f"expected 32 entities, found {len(entities)}")

    if {row["sex"] for row in rows} != EXPECTED_SEXES:
        errors.append("dataset must contain total, male and female series")

    for row in rows:
        try:
            value = int(row["value"])
        except ValueError:
            errors.append(f"non-numeric value for {row.get('geo_area')}")
            continue
        if value < 0:
            errors.append(f"negative population value for {row.get('geo_area')}")
        if row.get("status") != "official":
            errors.append(f"non-official status for {row.get('geo_area')}")
        if not row.get("geo_name") or "Ã" in row["geo_name"]:
            errors.append(f"invalid UTF-8 label for {row.get('geo_area')}")

    by_entity: dict[str, dict[str, int]] = {}
    for row in rows:
        by_entity.setdefault(row["geo_area"], {})[row["sex"]] = int(row["value"])
    for entity, values in by_entity.items():
        if values.get("total") != values.get("male", 0) + values.get("female", 0):
            errors.append(f"total reconciliation failed for {entity}")

    raw = DATASET.read_text(encoding="utf-8-sig")
    if SECRET_PATTERN.search(raw):
        errors.append("dataset contains a token-like value")
    return errors


def main() -> int:
    errors = validate(load_rows())
    if errors:
        for error in errors:
            print(f"FAIL {error}")
        return 1
    print("PASS public dataset validation: 96 rows, 32 entities, reconciled totals")
    return 0


if __name__ == "__main__":
    sys.exit(main())


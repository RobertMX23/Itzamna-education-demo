"""Enforce conservative static performance budgets for the public demo."""

import sys
from pathlib import Path


ROOT = Path(__file__).parents[1]
BUDGETS = {
    ROOT / "dashboard" / "vendor" / "echarts.esm.min.js": 1_500_000,
    ROOT / "data" / "official" / "population_historical.csv": 500_000,
    ROOT / "dashboard" / "styles.css": 100_000,
    ROOT / "dashboard" / "app.js": 100_000,
}


def main() -> int:
    errors = []
    for path, limit in BUDGETS.items():
        if not path.is_file():
            errors.append(f"missing budgeted file: {path.relative_to(ROOT)}")
            continue
        size = path.stat().st_size
        if size > limit:
            errors.append(
                f"budget exceeded: {path.relative_to(ROOT)} is {size} bytes; limit is {limit}"
            )
        else:
            print(f"PASS {path.relative_to(ROOT)}: {size} / {limit} bytes")
    if errors:
        for error in errors:
            print(f"FAIL {error}")
        return 1
    print("PASS static performance budgets")
    return 0


if __name__ == "__main__":
    sys.exit(main())


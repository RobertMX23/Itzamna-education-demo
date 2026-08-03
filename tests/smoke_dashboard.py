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
    ROOT / "data" / "synthetic" / "dashboard.csv",
)


def main() -> int:
    missing = [str(path.relative_to(ROOT)) for path in REQUIRED_FILES if not path.is_file()]
    if missing:
        print(f"FAIL missing files: {', '.join(missing)}")
        return 1

    with (ROOT / "data" / "synthetic" / "dashboard.csv").open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        print("FAIL dataset is empty")
        return 1

    print(f"PASS dashboard package: {len(rows)} synthetic observations")
    return 0


if __name__ == "__main__":
    sys.exit(main())

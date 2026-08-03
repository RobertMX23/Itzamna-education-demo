"""Check the minimum contrast of the public dashboard color tokens."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / "dashboard" / "styles.css"
REQUIRED = {
    ("ink", "paper"): 7.0,
    ("muted", "canvas"): 4.5,
    ("accent", "canvas"): 4.5,
}


def luminance(hex_color: str) -> float:
    channels = [int(hex_color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4 for value in channels]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]


def contrast(first: str, second: str) -> float:
    light, dark = sorted((luminance(first), luminance(second)), reverse=True)
    return (light + 0.05) / (dark + 0.05)


def main() -> int:
    tokens = dict(re.findall(r"--([\w-]+):\s*(#[0-9a-fA-F]{6})", CSS.read_text(encoding="utf-8")))
    failures = []
    for (foreground, background), minimum in REQUIRED.items():
        ratio = contrast(tokens[foreground], tokens[background])
        print(f"{foreground} on {background}: {ratio:.2f}:1 (minimum {minimum:.1f}:1)")
        if ratio < minimum:
            failures.append(f"{foreground} on {background} is below the required contrast")
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        return 1
    print("PASS accessibility contrast tokens")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""Fail when prohibited secrets or operational files enter the public demo."""

import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).parents[1]
FORBIDDEN_NAMES = {".env", ".env.local", ".env.production", "credentials.json"}
FORBIDDEN_SUFFIXES = {".sqlite", ".sqlite3", ".db"}
SECRET_PATTERNS = (
    re.compile(r"(?im)^\s*(?:export\s+)?INEGI_TOKEN\s*=\s*[^\s#]+"),
    re.compile(r"(?im)^\s*(?:export\s+)?(?:API_KEY|SECRET_KEY|ACCESS_TOKEN)\s*=\s*[^\s#]+"),
    re.compile(r"(?i)bearer\s+[a-z0-9._-]{24,}"),
)


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files"], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return [ROOT / line for line in result.stdout.splitlines() if line]


def validate(files: list[Path]) -> list[str]:
    errors: list[str] = []
    for path in files:
        if path.name in FORBIDDEN_NAMES or path.suffix.lower() in FORBIDDEN_SUFFIXES:
            errors.append(f"forbidden operational file: {path.relative_to(ROOT)}")
            continue
        if not path.is_file() or path.stat().st_size > 2_000_000:
            continue
        try:
            content = path.read_text(encoding="utf-8-sig")
        except UnicodeDecodeError:
            continue
        for pattern in SECRET_PATTERNS:
            if pattern.search(content):
                errors.append(f"secret-like assignment in: {path.relative_to(ROOT)}")
                break
    return errors


def main() -> int:
    errors = validate(tracked_files())
    if errors:
        for error in errors:
            print(f"FAIL {error}")
        return 1
    print("PASS publication boundary: no prohibited files or secret-like assignments")
    return 0


if __name__ == "__main__":
    sys.exit(main())


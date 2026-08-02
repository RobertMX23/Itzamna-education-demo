# Itzamna Education Demo

Public portfolio demo of an educational indicators dashboard built with
synthetic data. It demonstrates data preparation, descriptive metrics,
validation, responsive HTML/CSS and CI-oriented quality controls.

## Demo

- [Open dashboard](dashboard/index.html)
- [Case study](portfolio/case-study.md)
- [Release manifest](portfolio/release-manifest.json)
- [Visual review](docs/visual-review.md)

## Safety boundary

This repository contains no API token, `.env` file, production connection,
SQLite database or real INEGI observations. The CSV is synthetic and exists
only to make the portfolio demo reproducible.

## Local run

```powershell
python -m http.server 8080
```

Open `http://127.0.0.1:8080/dashboard/`.

## Scope

This is a sanitized portfolio artifact, not the private INEGI integration
repository and not a production service.

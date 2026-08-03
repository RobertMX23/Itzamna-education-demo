# Private INEGI API Adapter Design

## Objective

Define a secure ingestion boundary for live INEGI data without exposing API
credentials or production connectivity in this public portfolio repository.

## Boundary

```text
Private integration repository
  -> INEGI API client
  -> token from secret manager or CI secret
  -> response validation
  -> normalized population dataset
  -> approved export artifact
  -> public demo repository
  -> GitHub Pages
```

The public repository consumes only an approved, versioned artifact. It does
not call INEGI directly and must never receive the token.

## Private components

The private integration should contain:

- `client`: HTTP client with timeout, retry and rate-limit handling.
- `schemas`: response and metadata contracts.
- `normalizers`: UTF-8, geography and numeric normalization.
- `quality`: completeness, uniqueness and reconciliation checks.
- `publisher`: deterministic CSV/JSON export without credentials.
- `audit`: request timestamp, source URL, dataset hash and extraction status.

## Secret rules

- Read `INEGI_TOKEN` only from an environment variable or secret manager.
- Never write the token to logs, CSV, JSON, screenshots or artifacts.
- Never place the token in the public repository.
- Do not use a production API call from GitHub Pages.
- Fail closed when the token is missing or the response is unauthorized.

## Data contract

The adapter must export the fields required by Project 02:

```text
indicator, sex, geo_area, geo_name, time_period, unit, value, status, source
```

The public export must include lineage metadata separately:

```text
source_url, extracted_at, dataset_hash, methodology_note
```

## Validation gates

An export is publishable only when:

1. All expected entities are present.
2. Period values are valid numeric periods.
3. Population values are numeric and non-negative.
4. Total equals men plus women within the defined tolerance.
5. UTF-8 labels round-trip correctly.
6. The output contains no token-like values.
7. The output hash and extraction timestamp are recorded.
8. The public demo tests pass against the exported artifact.

## Recommended deployment sequence

1. Run the private extraction job.
2. Validate and normalize the response.
3. Generate a review artifact and hash.
4. Approve the artifact through a pull request or release gate.
5. Copy only the approved artifact to the public demo repository.
6. Run CI, Pages deployment and public E2E tests.
7. Roll back to the previous artifact if any gate fails.

## Explicit non-goals

This design does not add a backend to GitHub Pages, does not publish a live
INEGI connection and does not automate publication without human approval.
Those are separate decisions for a future private service.


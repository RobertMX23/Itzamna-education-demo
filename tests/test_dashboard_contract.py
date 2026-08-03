"""Contract tests for the public dashboard artifact."""

import csv
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).parents[1]
DATASET = ROOT / "data" / "official" / "population_2020.csv"
HTML = ROOT / "dashboard" / "index.html"
APP = ROOT / "dashboard" / "app.js"


class DashboardContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with DATASET.open(newline="", encoding="utf-8-sig") as handle:
            cls.rows = list(csv.DictReader(handle))
        cls.html = HTML.read_text(encoding="utf-8")
        cls.app = APP.read_text(encoding="utf-8")

    def test_dataset_has_expected_observation_contract(self):
        required = {
            "indicator_id",
            "indicator_name",
            "unit",
            "geo_area",
            "geo_name",
            "time_period",
            "value",
            "status",
            "sex",
            "source_url",
            "extraction_date",
        }
        self.assertTrue(required.issubset(self.rows[0]))
        self.assertGreater(len(self.rows), 0)

    def test_dataset_contains_multiple_entities_and_periods(self):
        self.assertGreater(len({row["geo_area"] for row in self.rows}), 1)
        self.assertEqual({row["time_period"] for row in self.rows}, {"2020"})

    def test_html_exposes_critical_controls_and_outputs(self):
        for element_id in (
            "indicator-filter",
            "entity-filter",
            "period-filter",
            "sort-filter",
            "latest-value",
            "period-change",
            "observation-table",
            "growth-heatmap",
        ):
            self.assertIn(f'id="{element_id}"', self.html)
        for label in ("Poblacion seleccionada", "Participacion femenina", "Brecha mujeres-hombres"):
            self.assertIn(label, self.html)
        self.assertIn("Fuente oficial: INEGI", self.html)

    def test_app_uses_relative_dataset_reference(self):
        self.assertIn('"../data/official/population_2020.csv"', self.app)
        self.assertNotRegex(self.app, r"(?:C:|/home/|https?://).*(?:csv|json)")

    def test_app_has_separate_filter_and_metric_functions(self):
        for function_name in (
            "filterByIndicator",
            "filterByEntity",
            "filterByPeriod",
            "calculatePercentChange",
            "aggregateSexValues",
            "calculatePopulationMetrics",
            "buildRanking",
        ):
            self.assertIn(f"function {function_name}", self.app)

    def test_app_parser_handles_quoted_csv_contract(self):
        self.assertIn('character === \'"\' && quoted', self.app)
        self.assertIn("Object.fromEntries(fields.map", self.app)


if __name__ == "__main__":
    unittest.main()

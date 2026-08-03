"""Contract tests for the public, synthetic dashboard artifact."""

import csv
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).parents[1]
DATASET = ROOT / "data" / "synthetic" / "dashboard.csv"
HTML = ROOT / "dashboard" / "index.html"
APP = ROOT / "dashboard" / "app.js"


class DashboardContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with DATASET.open(newline="", encoding="utf-8") as handle:
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
            "percent_change",
            "rank",
        }
        self.assertTrue(required.issubset(self.rows[0]))
        self.assertGreater(len(self.rows), 0)

    def test_dataset_contains_multiple_entities_and_periods(self):
        self.assertGreater(len({row["geo_area"] for row in self.rows}), 1)
        self.assertGreater(len({row["time_period"] for row in self.rows}), 1)

    def test_html_exposes_critical_controls_and_outputs(self):
        for element_id in (
            "indicator-filter",
            "entity-filter",
            "period-filter",
            "latest-value",
            "period-change",
            "observation-table",
            "growth-heatmap",
        ):
            self.assertIn(f'id="{element_id}"', self.html)

    def test_app_uses_relative_dataset_reference(self):
        self.assertIn('"../data/synthetic/dashboard.csv"', self.app)
        self.assertNotRegex(self.app, r"(?:C:|/home/|https?://).*(?:csv|json)")

    def test_app_has_separate_filter_and_metric_functions(self):
        for function_name in (
            "filterByIndicator",
            "filterByEntity",
            "filterByPeriod",
            "calculatePercentChange",
            "buildRanking",
        ):
            self.assertIn(f"function {function_name}", self.app)


if __name__ == "__main__":
    unittest.main()

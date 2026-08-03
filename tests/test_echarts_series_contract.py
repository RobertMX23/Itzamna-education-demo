"""Contract tests for the isolated ECharts historical series option."""

from pathlib import Path
import unittest


ROOT = Path(__file__).parents[1]
OPTION = ROOT / "dashboard" / "charts" / "echarts" / "population-series-option.js"
SPEC = ROOT / "dashboard" / "charts" / "echarts" / "population-series-option.spec.yaml"


class EChartsSeriesContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.option = OPTION.read_text(encoding="utf-8")
        cls.spec = SPEC.read_text(encoding="utf-8")

    def test_option_declares_required_series_and_interactions(self):
        self.assertIn("function buildHistoricalOption", self.option)
        for series_name in ("Total", "Hombres", "Mujeres"):
            self.assertIn(series_name, self.option)
        for interaction in ("tooltip", "legend", "dataZoom"):
            self.assertIn(interaction, self.option)

    def test_option_enables_accessibility_and_person_units(self):
        self.assertIn("aria: { show: true", self.option)
        self.assertIn('name: "Personas"', self.option)
        self.assertIn("valueFormatter", self.option)

    def test_spec_keeps_series_descriptive(self):
        self.assertIn("does not imply causality", self.spec)
        self.assertIn("same scale", self.spec)


if __name__ == "__main__":
    unittest.main()

"""Contract tests for the isolated ECharts entity comparison option."""

from pathlib import Path
import unittest


ROOT = Path(__file__).parents[1]
OPTION = ROOT / "dashboard" / "charts" / "echarts" / "population-comparison-option.js"
SPEC = ROOT / "dashboard" / "charts" / "echarts" / "population-comparison-option.spec.yaml"


class EChartsComparisonContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.option = OPTION.read_text(encoding="utf-8")
        cls.spec = SPEC.read_text(encoding="utf-8")

    def test_comparison_requires_two_entities(self):
        self.assertIn("function buildComparisonOption", self.option)
        self.assertIn("two different entities", self.option)
        self.assertIn("entities: 2", self.spec)

    def test_comparison_declares_six_series(self):
        self.assertIn("series_per_entity: 3", self.spec)
        self.assertGreaterEqual(self.option.count("series.push"), 1)
        for sex in ("total", "male", "female"):
            self.assertIn(f'key: "{sex}"', self.option)

    def test_comparison_uses_visual_distinction_without_new_scale(self):
        self.assertIn('type: entityIndex === 0 ? "solid" : "dashed"', self.option)
        self.assertIn('name: "Personas"', self.option)
        self.assertIn("does not imply causality", self.spec)


if __name__ == "__main__":
    unittest.main()

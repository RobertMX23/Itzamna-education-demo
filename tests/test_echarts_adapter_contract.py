"""Contract tests for the isolated ECharts population adapter."""

from pathlib import Path
import unittest


ROOT = Path(__file__).parents[1]
ADAPTER = ROOT / "dashboard" / "charts" / "echarts" / "population-adapter.js"
SPEC = ROOT / "dashboard" / "charts" / "echarts" / "population-adapter.spec.yaml"


class EChartsAdapterContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.adapter = ADAPTER.read_text(encoding="utf-8")
        cls.spec = SPEC.read_text(encoding="utf-8")

    def test_adapter_exports_dataset_functions(self):
        for function_name in ("filterRows", "toHistoricalDataset", "toComparisonDataset"):
            self.assertIn(f"function {function_name}", self.adapter)
            self.assertIn(function_name, self.adapter.split("export")[1])

    def test_adapter_contract_is_explicit(self):
        for field in ("period", "entity", "sex", "value", "geo_name"):
            self.assertIn(field, self.spec)
        self.assertIn("two distinct entities", self.spec)

    def test_adapter_isolated_from_current_dashboard(self):
        self.assertNotIn("app.js", self.adapter)
        self.assertNotIn("fetch(", self.adapter)
        self.assertNotIn("DATA_URL", self.adapter)


if __name__ == "__main__":
    unittest.main()

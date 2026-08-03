"""Contract tests for the isolated ECharts comparison lab."""

from pathlib import Path
import unittest


ROOT = Path(__file__).parents[1]
HTML = ROOT / "dashboard" / "echarts-lab.html"
SCRIPT = ROOT / "dashboard" / "charts" / "echarts" / "echarts-lab.js"
CSS = ROOT / "dashboard" / "charts" / "echarts" / "echarts-lab.css"


class EChartsLabContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = HTML.read_text(encoding="utf-8")
        cls.script = SCRIPT.read_text(encoding="utf-8")
        cls.css = CSS.read_text(encoding="utf-8")

    def test_lab_exposes_two_entity_selectors(self):
        self.assertIn('id="echarts-first-entity"', self.html)
        self.assertIn('id="echarts-second-entity"', self.html)
        self.assertIn('id="echarts-comparison"', self.html)

    def test_lab_isolated_from_stable_dashboard(self):
        self.assertNotIn("dashboard/app.js", self.script)
        self.assertIn("population_historical.csv", self.script)
        self.assertIn("buildComparisonOption", self.script)

    def test_lab_uses_local_pinned_echarts_bundle(self):
        self.assertIn('from "../../vendor/echarts.esm.min.js"', self.script)
        self.assertTrue((ROOT / "dashboard" / "vendor" / "echarts.esm.min.js").exists())
        self.assertIn('renderer: "svg"', self.script)

    def test_lab_defines_visible_keyboard_focus(self):
        self.assertIn("select:focus-visible", self.css)
        self.assertIn("outline-offset: 2px", self.css)


if __name__ == "__main__":
    unittest.main()

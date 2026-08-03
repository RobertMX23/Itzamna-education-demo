import csv
import unittest
from collections import defaultdict
from pathlib import Path


DATASET = Path(__file__).parents[1] / "data" / "official" / "population_historical.csv"
PERIODS = {"1995", "2000", "2005", "2010", "2020"}
SEXES = {"total", "male", "female"}


class HistoricalPopulationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with DATASET.open(encoding="utf-8-sig", newline="") as handle:
            cls.rows = list(csv.DictReader(handle))

    def test_dataset_has_480_rows_and_complete_coverage(self):
        self.assertEqual(len(self.rows), 480)
        self.assertEqual(len({row["geo_area"] for row in self.rows}), 32)
        self.assertEqual({row["time_period"] for row in self.rows}, PERIODS)
        self.assertEqual({row["sex"] for row in self.rows}, SEXES)

    def test_each_entity_period_reconciles(self):
        values = defaultdict(dict)
        for row in self.rows:
            values[(row["geo_area"], row["time_period"])][row["sex"]] = int(row["value"])

        self.assertEqual(len(values), 160)
        for key, entity_values in values.items():
            self.assertEqual(set(entity_values), SEXES, key)
            self.assertEqual(entity_values["total"], entity_values["male"] + entity_values["female"], key)

    def test_lineage_is_present_and_2015_is_excluded(self):
        self.assertNotIn("2015", {row["time_period"] for row in self.rows})
        self.assertTrue(all(row["source_url"].startswith("https://") for row in self.rows))
        self.assertTrue(all(row["status"] == "official" for row in self.rows))
        self.assertTrue(all(row["geo_name"] for row in self.rows))


if __name__ == "__main__":
    unittest.main()

import csv
import unittest
from collections import defaultdict
from pathlib import Path


DATASET = Path(__file__).parents[1] / "data" / "official" / "population_2020.csv"
EXPECTED_SEX = {"total", "male", "female"}


class OfficialPopulationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with DATASET.open(encoding="utf-8-sig", newline="") as handle:
            cls.rows = list(csv.DictReader(handle))

    def test_dataset_has_96_rows_and_32_entities(self):
        self.assertEqual(len(self.rows), 96)
        self.assertEqual(len({row["geo_area"] for row in self.rows}), 32)

    def test_dataset_has_one_official_period_and_three_sexes(self):
        self.assertEqual({row["time_period"] for row in self.rows}, {"2020"})
        self.assertEqual({row["sex"] for row in self.rows}, EXPECTED_SEX)
        self.assertTrue(all(row["status"] == "official" for row in self.rows))

    def test_each_entity_has_reconcilable_population(self):
        values = defaultdict(dict)
        for row in self.rows:
            values[row["geo_area"]][row["sex"]] = int(row["value"])

        for entity, entity_values in values.items():
            self.assertEqual(set(entity_values), EXPECTED_SEX, entity)
            self.assertEqual(
                entity_values["total"],
                entity_values["male"] + entity_values["female"],
                entity,
            )
            self.assertTrue(all(value >= 0 for value in entity_values.values()))

    def test_source_lineage_is_present(self):
        self.assertTrue(all(row["source_url"].startswith("https://") for row in self.rows))
        self.assertTrue(all(row["extraction_date"] for row in self.rows))
        self.assertTrue(all(row["methodology_note"] for row in self.rows))

    def test_utf8_labels_are_not_mojibake(self):
        labels = " ".join(row["geo_name"] for row in self.rows)
        self.assertNotRegex(labels, r"Ã|Â|â")


if __name__ == "__main__":
    unittest.main()

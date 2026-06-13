from __future__ import annotations

import unittest

from app.main import normalize_search_draft


class AiDraftTests(unittest.TestCase):
    def test_normalize_search_draft_accepts_json_block(self) -> None:
        draft = normalize_search_draft(
            """
            ```json
            {
              "name": "Defekte Elektronik bis 100 Euro",
              "source_type": "kleinanzeigen",
              "query": "defekte elektronik",
              "category_hint": "Elektronik",
              "location": "21629",
              "radius_km": 50,
              "max_price": 100,
              "max_listing_age_days": 14,
              "required_keywords": ["defekt"],
              "exclude_keywords": ["gesuch"]
            }
            ```
            """
        )

        self.assertEqual(draft["source_type"], "kleinanzeigen")
        self.assertEqual(draft["query"], "defekte elektronik")
        self.assertEqual(draft["radius_km"], 50)
        self.assertEqual(draft["max_price"], 100.0)
        self.assertEqual(draft["required_keywords"], ["defekt"])

    def test_normalize_search_draft_defaults_unknown_source(self) -> None:
        draft = normalize_search_draft('{"source_type":"unknown","query":"stuhl"}')

        self.assertEqual(draft["source_type"], "kleinanzeigen")
        self.assertEqual(draft["max_listing_age_days"], 365)


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import sqlite3
import unittest

from app.connectors import ListingCandidate
from app.main import refresh_existing_listing_fields, should_auto_assess_new_listing


def candidate() -> ListingCandidate:
    return ListingCandidate(
        source_type="kleinanzeigen",
        source_listing_id="1",
        title="Stuhl",
        price_text="25 EUR VB",
        price_value=25.0,
        location_text="10115 Mitte",
        category_text="Haus & Garten",
        posted_at_text="Heute",
        description_snippet="Massiver Stuhl.",
        listing_url="https://www.kleinanzeigen.de/s-anzeige/stuhl/1",
        thumbnail_url="https://example.test/stuhl.jpg",
        content_hash="hash-with-price",
    )


class ListingRefreshTests(unittest.TestCase):
    def test_duplicate_listing_refreshes_missing_marketplace_fields(self) -> None:
        db = sqlite3.connect(":memory:")
        db.row_factory = sqlite3.Row
        db.execute(
            """
            CREATE TABLE listings(
              price_text TEXT, price_value REAL, location_text TEXT, category_text TEXT,
              posted_at_text TEXT, description_snippet TEXT, thumbnail_url TEXT, content_hash TEXT
            )
            """
        )
        db.execute("INSERT INTO listings VALUES ('', NULL, '', '', '', '', '', 'hash-without-price')")
        existing = db.execute("SELECT * FROM listings").fetchone()
        updates: list[str] = []
        values: list[object] = []

        refresh_existing_listing_fields(existing, candidate(), updates, values)

        self.assertEqual(
            updates,
            [
                "price_text = ?",
                "location_text = ?",
                "category_text = ?",
                "posted_at_text = ?",
                "description_snippet = ?",
                "thumbnail_url = ?",
                "price_value = ?",
                "content_hash = ?",
            ],
        )
        self.assertEqual(values[0], "25 EUR VB")
        self.assertEqual(values[6], 25.0)
        self.assertEqual(values[7], "hash-with-price")
        db.close()

    def test_new_listing_auto_assessment_requires_all_ai_switches(self) -> None:
        self.assertTrue(
            should_auto_assess_new_listing(
                {
                    "ai_enabled": "1",
                    "ai_listing_assessments_enabled": "1",
                    "ai_listing_assessments_new_enabled": "1",
                }
            )
        )
        self.assertFalse(
            should_auto_assess_new_listing(
                {
                    "ai_enabled": "1",
                    "ai_listing_assessments_enabled": "1",
                    "ai_listing_assessments_new_enabled": "0",
                }
            )
        )

    def test_duplicate_listing_keeps_existing_marketplace_fields(self) -> None:
        db = sqlite3.connect(":memory:")
        db.row_factory = sqlite3.Row
        db.execute(
            """
            CREATE TABLE listings(
              price_text TEXT, price_value REAL, location_text TEXT, category_text TEXT,
              posted_at_text TEXT, description_snippet TEXT, thumbnail_url TEXT, content_hash TEXT
            )
            """
        )
        db.execute(
            "INSERT INTO listings VALUES ('10 EUR', 10, 'Hamburg', 'Alt', 'Gestern', 'Alt', 'old.jpg', 'hash-with-price')"
        )
        existing = db.execute("SELECT * FROM listings").fetchone()
        updates: list[str] = []
        values: list[object] = []

        refresh_existing_listing_fields(existing, candidate(), updates, values)

        self.assertEqual(updates, [])
        self.assertEqual(values, [])
        db.close()


if __name__ == "__main__":
    unittest.main()

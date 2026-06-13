from __future__ import annotations

import unittest

from app.connectors import ListingCandidate
from app.filters import apply_filters, location_filter_terms


def candidate(location: str) -> ListingCandidate:
    return ListingCandidate(
        source_type="kleinanzeigen",
        source_listing_id="1",
        title="Stuhl",
        price_text="10 EUR",
        price_value=10,
        location_text=location,
        category_text="",
        posted_at_text="Heute",
        description_snippet="",
        listing_url="https://www.kleinanzeigen.de/s-anzeige/stuhl/1",
        thumbnail_url="",
        content_hash="hash",
    )


class FilterTests(unittest.TestCase):
    def test_radius_location_hint_does_not_require_exact_zip_text(self) -> None:
        result = apply_filters(candidate("20539 Hamburg Rothenburgsort (18 km)"), {"location_hint": "21629 · +50 km"})

        self.assertEqual(result.status, "new")
        self.assertEqual(result.reason, "")
        self.assertEqual(location_filter_terms("21629 · +50 km"), [])

    def test_exact_location_hint_still_filters_by_text(self) -> None:
        result = apply_filters(candidate("20539 Hamburg Rothenburgsort"), {"location_hint": "21629"})

        self.assertEqual(result.status, "hidden")
        self.assertEqual(result.reason, "location_mismatch")
        self.assertEqual(location_filter_terms("21629"), ["21629"])


if __name__ == "__main__":
    unittest.main()

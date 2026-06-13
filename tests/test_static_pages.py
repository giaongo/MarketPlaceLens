from __future__ import annotations

import unittest

from app.main import static_page_response


class StaticPageTests(unittest.TestCase):
    def test_index_assets_are_versioned(self) -> None:
        response = static_page_response("index.html")
        html = response.body.decode("utf-8")

        self.assertNotIn("__ASSET_VERSION__", html)
        self.assertIn("/static/app.js?v=", html)
        self.assertIn("/static/styles.css?v=", html)
        self.assertEqual(response.headers["cache-control"], "no-store")


if __name__ == "__main__":
    unittest.main()

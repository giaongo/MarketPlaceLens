from __future__ import annotations

import asyncio
import unittest

from app.connectors import HtmlListingConnector, facebook_requires_login


class FakeResponse:
    def __init__(self, html: str, url: str) -> None:
        self.text = html
        self.url = url

    def raise_for_status(self) -> None:
        return None


class FakeClient:
    def __init__(self, pages: dict[str, str]) -> None:
        self.pages = pages
        self.requested: list[str] = []

    async def get(self, url: str) -> FakeResponse:
        self.requested.append(url)
        return FakeResponse(self.pages[url], url)


def article(title: str, href: str, price: str = "10 EUR") -> str:
    return f"""
    <article class="aditem" data-adid="{href.rsplit('/', 1)[-1]}">
      <a href="{href}"><h2>{title}</h2></a>
      <p class="aditem-main--middle--price-shipping--price">{price}</p>
    </article>
    """


class ConnectorTests(unittest.TestCase):
    def test_kleinanzeigen_dedicated_parser_reads_aditem_fields(self) -> None:
        html = """
        <ul id="srchrslt-adtable">
          <li class="ad-listitem">
            <article class="aditem" data-adid="12345" data-href="/s-anzeige/eiche-stuhl/12345-86-1">
              <div class="aditem-main--top--left">10115 Mitte</div>
              <div class="aditem-main--top--right">Heute</div>
              <div class="aditem-main">
                <a class="text-module-begin" href="/s-anzeige/eiche-stuhl/12345-86-1">Eiche Stuhl</a>
                <p class="aditem-main--middle--price-shipping--price">25 EUR VB</p>
                <p class="aditem-main--middle--tags">Haus & Garten</p>
                <p class="aditem-main--middle--description">Massiver Stuhl.</p>
              </div>
              <img src="/image.jpg">
            </article>
          </li>
        </ul>
        """

        listings = HtmlListingConnector("kleinanzeigen").parse_kleinanzeigen_listings(
            html,
            {"search_url": "https://www.kleinanzeigen.de/s-suchanfrage.html?keywords=stuhl"},
        )

        self.assertEqual(len(listings), 1)
        listing = listings[0]
        self.assertEqual(listing.source_listing_id, "12345")
        self.assertEqual(listing.title, "Eiche Stuhl")
        self.assertEqual(listing.price_text, "25 EUR VB")
        self.assertEqual(listing.price_value, 25.0)
        self.assertEqual(listing.location_text, "10115 Mitte")
        self.assertEqual(listing.category_text, "Haus & Garten")
        self.assertEqual(listing.posted_at_text, "Heute")
        self.assertEqual(listing.listing_url, "https://www.kleinanzeigen.de/s-anzeige/eiche-stuhl/12345-86-1")

    def test_kleinanzeigen_pagination_keeps_client_available(self) -> None:
        first_url = "https://www.kleinanzeigen.de/s-suchanfrage.html?keywords=stuhl"
        second_url = "https://www.kleinanzeigen.de/s-suchanfrage.html?keywords=stuhl&pageNum=2"
        first_html = f"""
        {article("Erster Stuhl", "/s-anzeige/erster-stuhl/1")}
        <a rel="next" href="{second_url}">Weiter</a>
        """
        second_html = article("Zweiter Stuhl", "/s-anzeige/zweiter-stuhl/2", "20 EUR")
        client = FakeClient({second_url: second_html})

        listings = asyncio.run(
            HtmlListingConnector("kleinanzeigen").fetch_paginated_kleinanzeigen(
                client,
                {"search_url": first_url},
                first_html,
                first_url,
            )
        )

        self.assertEqual([item.title for item in listings], ["Erster Stuhl", "Zweiter Stuhl"])
        self.assertEqual(client.requested, [second_url])

    def test_facebook_login_and_upsell_pages_are_detected(self) -> None:
        self.assertTrue(facebook_requires_login("<form id='login_form'></form>", "https://www.facebook.com/login.php"))
        self.assertTrue(
            facebook_requires_login(
                "<html>LoggedInLandingUpsellEligible marketplace_logged_out_content</html>",
                "https://www.facebook.com/marketplace/search/?query=stuhl",
            )
        )
        self.assertFalse(
            facebook_requires_login(
                '<a href="/marketplace/item/123456789/">Stuhl</a>',
                "https://www.facebook.com/marketplace/search/?query=stuhl",
            )
        )


if __name__ == "__main__":
    unittest.main()

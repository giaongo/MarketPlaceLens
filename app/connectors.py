from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup, Tag

from .config import settings


@dataclass
class ListingCandidate:
    source_type: str
    source_listing_id: str
    title: str
    price_text: str
    price_value: float | None
    location_text: str
    category_text: str
    posted_at_text: str
    description_snippet: str
    listing_url: str
    thumbnail_url: str
    content_hash: str


class MarketplaceConnector:
    source_type = "base"

    def validate_search_url(self, url: str) -> None:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("Search URL must be an absolute http(s) URL.")

    async def fetch_listings(self, profile: dict) -> list[ListingCandidate]:
        raise NotImplementedError


class HtmlListingConnector(MarketplaceConnector):
    source_type = "html"

    def __init__(self, source_type: str = "html") -> None:
        self.source_type = source_type

    async def fetch_listings(self, profile: dict) -> list[ListingCandidate]:
        self.validate_search_url(profile["search_url"])
        async with httpx.AsyncClient(
            headers={"User-Agent": settings.user_agent},
            follow_redirects=True,
            timeout=20.0,
        ) as client:
            response = await client.get(profile["search_url"])
            response.raise_for_status()
        return self.parse_listings(response.text, profile)

    def parse_listings(self, html: str, profile: dict) -> list[ListingCandidate]:
        soup = BeautifulSoup(html, "html.parser")
        selectors = [
            "article",
            "[data-adid]",
            "[data-listing-id]",
            ".aditem",
            ".listing",
            ".result",
            "li",
        ]
        cards: list[Tag] = []
        for selector in selectors:
            cards = [node for node in soup.select(selector) if isinstance(node, Tag) and node.find("a", href=True)]
            if len(cards) >= 2:
                break
        if not cards:
            cards = [a.parent for a in soup.select("a[href]") if isinstance(a.parent, Tag)]

        candidates: list[ListingCandidate] = []
        seen: set[str] = set()
        for card in cards[:80]:
            candidate = self.normalize_listing(card, profile["search_url"])
            if not candidate or candidate.content_hash in seen:
                continue
            seen.add(candidate.content_hash)
            candidates.append(candidate)
        return candidates

    def normalize_listing(self, card: Tag, base_url: str) -> ListingCandidate | None:
        anchor = card.find("a", href=True)
        if not isinstance(anchor, Tag):
            return None
        listing_url = urljoin(base_url, str(anchor.get("href", "")))
        title = clean_text(
            first_text(
                card,
                [
                    "[data-testid*=title]",
                    ".title",
                    ".aditem-main--middle--title",
                    "h1",
                    "h2",
                    "h3",
                    "a",
                ],
            )
        )
        if not title or len(title) < 3:
            return None
        price_text = clean_text(first_text(card, ["[class*=price]", "[data-testid*=price]", ".aditem-main--middle--price-shipping--price"]))
        location_text = clean_text(first_text(card, ["[class*=location]", "[data-testid*=location]", ".aditem-main--top--left"]))
        category_text = clean_text(first_text(card, ["[class*=category]", "[data-testid*=category]"]))
        posted_at_text = clean_text(first_text(card, ["time", "[class*=date]", "[data-testid*=date]"]))
        snippet = clean_text(first_text(card, ["[class*=description]", "[class*=snippet]", "p"]))
        image = card.find("img")
        thumbnail_url = ""
        if isinstance(image, Tag):
            thumbnail_url = urljoin(base_url, str(image.get("src") or image.get("data-src") or ""))
        source_listing_id = str(
            card.get("data-adid")
            or card.get("data-listing-id")
            or extract_listing_id(listing_url)
        )
        hash_input = "|".join([title, price_text, location_text, listing_url])
        content_hash = hashlib.sha256(hash_input.encode("utf-8")).hexdigest()
        return ListingCandidate(
            source_type=self.source_type,
            source_listing_id=source_listing_id,
            title=title,
            price_text=price_text,
            price_value=parse_price(price_text),
            location_text=location_text,
            category_text=category_text,
            posted_at_text=posted_at_text,
            description_snippet=snippet[:400],
            listing_url=listing_url,
            thumbnail_url=thumbnail_url,
            content_hash=content_hash,
        )


def clean_text(value: str | None) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def first_text(card: Tag, selectors: list[str]) -> str:
    for selector in selectors:
        node = card.select_one(selector)
        if node:
            return node.get_text(" ", strip=True)
    return ""


def extract_listing_id(url: str) -> str:
    parsed = urlparse(url)
    tail = parsed.path.rstrip("/").split("/")[-1]
    return tail or hashlib.sha1(url.encode("utf-8")).hexdigest()


def parse_price(value: str) -> float | None:
    lowered = value.lower()
    if "kostenlos" in lowered or "free" in lowered or "zu verschenken" in lowered:
        return 0.0
    match = re.search(r"(\d+(?:[.,]\d{1,2})?)", lowered.replace(".", ""))
    if not match:
        return None
    return float(match.group(1).replace(",", "."))


def get_connector(source_type: str) -> MarketplaceConnector:
    if source_type in {"html", "kleinanzeigen", "facebook"}:
        return HtmlListingConnector(source_type)
    raise ValueError(f"Unsupported source type: {source_type}")

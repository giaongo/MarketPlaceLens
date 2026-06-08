from __future__ import annotations

import html
from typing import Any
from urllib.parse import urlparse

import httpx


class TelegramNotifier:
    def __init__(self, token: str, chat_id: str) -> None:
        self.token = token.strip()
        self.chat_id = chat_id.strip()

    @property
    def configured(self) -> bool:
        return bool(self.token and self.chat_id)

    async def send_listing(self, listing: dict, profile: dict, matched_reason: str) -> None:
        title = html.escape(listing["title"])
        price = html.escape(listing.get("price_text") or "n/a")
        location = html.escape(listing.get("location_text") or "n/a")
        source = html.escape(listing.get("source_type") or profile.get("source_type") or "html")
        reason = html.escape(matched_reason or "matched profile")
        url = html.escape(listing["listing_url"])
        text = (
            f"<b>Neuer Treffer:</b> {title}\n"
            f"Preis: {price}\n"
            f"Ort: {location}\n"
            f"Quelle: {source}\n"
            f"Warum: {reason}\n"
            f"{url}"
        )
        await self.send_text(text)

    async def send_text(self, text: str) -> None:
        if not self.configured:
            raise RuntimeError("Telegram is not configured.")
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"https://api.telegram.org/bot{self.token}/sendMessage",
                json={"chat_id": self.chat_id, "text": text, "parse_mode": "HTML", "disable_web_page_preview": False},
            )
            response.raise_for_status()


class WebhookNotifier:
    def __init__(self, url: str) -> None:
        self.url = url.strip()

    @property
    def configured(self) -> bool:
        if not self.url:
            return False
        parsed = urlparse(self.url)
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)

    async def send_listing(self, listing: dict[str, Any], profile: dict[str, Any], matched_reason: str) -> None:
        await self.send_payload(
            {
                "event": "marketplacelens.listing.created",
                "matched_reason": matched_reason or "matched profile",
                "profile": {
                    "id": profile.get("id"),
                    "name": profile.get("name"),
                    "source_type": profile.get("source_type"),
                    "search_url": profile.get("search_url"),
                },
                "listing": {
                    "id": listing.get("id"),
                    "source_type": listing.get("source_type"),
                    "source_listing_id": listing.get("source_listing_id"),
                    "title": listing.get("title"),
                    "price_text": listing.get("price_text"),
                    "price_value": listing.get("price_value"),
                    "location_text": listing.get("location_text"),
                    "category_text": listing.get("category_text"),
                    "description_snippet": listing.get("description_snippet"),
                    "listing_url": listing.get("listing_url"),
                    "thumbnail_url": listing.get("thumbnail_url"),
                    "score": listing.get("score"),
                    "filter_reason": listing.get("filter_reason"),
                    "first_seen_at": listing.get("first_seen_at"),
                },
            }
        )

    async def send_test(self) -> None:
        await self.send_payload({"event": "marketplacelens.test", "message": "MarketPlaceLens webhook test successful."})

    async def send_payload(self, payload: dict[str, Any]) -> None:
        if not self.configured:
            raise RuntimeError("Webhook is not configured.")
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(self.url, json=payload)
            response.raise_for_status()

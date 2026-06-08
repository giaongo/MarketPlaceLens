from __future__ import annotations

import html

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


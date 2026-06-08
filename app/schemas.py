from __future__ import annotations

from pydantic import BaseModel, Field, HttpUrl


class ProfilePayload(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    enabled: bool = True
    source_type: str = "html"
    search_url: HttpUrl
    poll_interval_minutes: int = Field(default=60, ge=30, le=10080)
    include_keywords: list[str] = []
    exclude_keywords: list[str] = []
    required_keywords: list[str] = []
    excluded_categories: list[str] = []
    min_price: float | None = None
    max_price: float | None = None
    location_hint: str = ""
    notify_telegram: bool = True


class ListingStatusPayload(BaseModel):
    status: str = Field(pattern="^(new|seen|hidden|notified)$")


class SettingsPayload(BaseModel):
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    global_rate_limit_seconds: int = Field(default=20, ge=5, le=3600)


class LoginPayload(BaseModel):
    username: str
    password: str


class PasswordPayload(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=200)

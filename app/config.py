from __future__ import annotations

import os
import secrets
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    db_path: str = os.getenv("MARKETPLACELENS_DB_PATH", "./data/marketplacelens.db")
    poll_enabled: bool = os.getenv("MARKETPLACELENS_POLL_ENABLED", "true").lower() == "true"
    min_poll_minutes: int = int(os.getenv("MARKETPLACELENS_MIN_POLL_MINUTES", "30"))
    default_poll_minutes: int = int(os.getenv("MARKETPLACELENS_DEFAULT_POLL_MINUTES", "60"))
    user_agent: str = os.getenv(
        "MARKETPLACELENS_USER_AGENT",
        "MarketPlaceLens/0.1 (+self-hosted listing watcher)",
    )
    telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    telegram_chat_id: str = os.getenv("TELEGRAM_CHAT_ID", "")
    admin_username: str = os.getenv("MARKETPLACELENS_ADMIN_USERNAME", "admin")
    admin_password: str = os.getenv("MARKETPLACELENS_ADMIN_PASSWORD", "admin")
    session_secret: str = os.getenv("MARKETPLACELENS_SESSION_SECRET", secrets.token_urlsafe(32))


settings = Settings()

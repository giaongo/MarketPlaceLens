from __future__ import annotations

import json
import os
import sqlite3
from contextlib import contextmanager
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Iterator

from .config import settings


def utc_now() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat()


def encode_list(value: list[str] | None) -> str:
    return json.dumps(value or [])


def decode_list(value: str | None) -> list[str]:
    if not value:
        return []
    try:
        loaded = json.loads(value)
    except json.JSONDecodeError:
        return []
    return [str(item) for item in loaded if str(item).strip()]


@contextmanager
def connect() -> Iterator[sqlite3.Connection]:
    Path(os.path.dirname(settings.db_path) or ".").mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(settings.db_path)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    try:
        yield db
        db.commit()
    finally:
        db.close()


def init_db() -> None:
    with connect() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS watch_profiles (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              enabled INTEGER NOT NULL DEFAULT 1,
              source_type TEXT NOT NULL DEFAULT 'html',
              search_url TEXT NOT NULL,
              poll_interval_minutes INTEGER NOT NULL DEFAULT 60,
              include_keywords TEXT NOT NULL DEFAULT '[]',
              exclude_keywords TEXT NOT NULL DEFAULT '[]',
              required_keywords TEXT NOT NULL DEFAULT '[]',
              excluded_categories TEXT NOT NULL DEFAULT '[]',
              min_price REAL,
              max_price REAL,
              location_hint TEXT NOT NULL DEFAULT '',
              notify_telegram INTEGER NOT NULL DEFAULT 1,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              last_run_at TEXT
            );

            CREATE TABLE IF NOT EXISTS listings (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              source_type TEXT NOT NULL,
              source_listing_id TEXT NOT NULL,
              profile_id INTEGER NOT NULL REFERENCES watch_profiles(id) ON DELETE CASCADE,
              title TEXT NOT NULL,
              price_text TEXT NOT NULL DEFAULT '',
              price_value REAL,
              location_text TEXT NOT NULL DEFAULT '',
              category_text TEXT NOT NULL DEFAULT '',
              posted_at_text TEXT NOT NULL DEFAULT '',
              description_snippet TEXT NOT NULL DEFAULT '',
              listing_url TEXT NOT NULL,
              thumbnail_url TEXT NOT NULL DEFAULT '',
              content_hash TEXT NOT NULL,
              first_seen_at TEXT NOT NULL,
              last_seen_at TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'new',
              score INTEGER NOT NULL DEFAULT 0,
              filter_reason TEXT NOT NULL DEFAULT '',
              notified_at TEXT,
              UNIQUE(profile_id, source_listing_id),
              UNIQUE(profile_id, content_hash)
            );

            CREATE TABLE IF NOT EXISTS app_settings (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL DEFAULT ''
            );
            """
        )
        defaults = {
            "telegram_bot_token": settings.telegram_bot_token,
            "telegram_chat_id": settings.telegram_chat_id,
            "global_rate_limit_seconds": "20",
        }
        for key, value in defaults.items():
            db.execute(
                "INSERT OR IGNORE INTO app_settings(key, value) VALUES (?, ?)",
                (key, value),
            )


def row_to_profile(row: sqlite3.Row) -> dict[str, Any]:
    data = dict(row)
    for key in ["include_keywords", "exclude_keywords", "required_keywords", "excluded_categories"]:
        data[key] = decode_list(data.get(key))
    data["enabled"] = bool(data["enabled"])
    data["notify_telegram"] = bool(data["notify_telegram"])
    return data


def row_to_listing(row: sqlite3.Row) -> dict[str, Any]:
    return dict(row)


from __future__ import annotations

import asyncio
import ipaddress
import random
import sqlite3
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from .auth import COOKIE_NAME, create_session, valid_credentials, valid_session
from .config import settings
from .connectors import ListingCandidate, get_connector
from .database import connect, encode_list, init_db, row_to_listing, row_to_profile, utc_now
from .filters import apply_filters
from .notifier import TelegramNotifier
from .schemas import ListingStatusPayload, LoginPayload, ProfilePayload, SettingsPayload

app = FastAPI(title="MarketPlaceLens", version="0.1.0")
static_dir = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.middleware("http")
async def require_session(request: Request, call_next):
    path = request.url.path
    public = path.startswith("/static/") or path in {"/login", "/api/auth/login", "/api/auth/status"}
    if public or valid_session(request.cookies.get(COOKIE_NAME)):
        return await call_next(request)
    if path.startswith("/api/"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    return RedirectResponse("/login", status_code=303)


@app.on_event("startup")
async def startup() -> None:
    init_db()
    if settings.poll_enabled:
        asyncio.create_task(poll_loop())


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(static_dir / "index.html")


@app.get("/login")
async def login_page() -> FileResponse:
    return FileResponse(static_dir / "login.html")


@app.post("/api/auth/login")
async def login(payload: LoginPayload, response: Response) -> dict[str, bool]:
    if not valid_credentials(payload.username, payload.password):
        raise HTTPException(401, "Invalid login")
    response.set_cookie(
        COOKIE_NAME,
        create_session(payload.username),
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 14,
    )
    return {"ok": True}


@app.post("/api/auth/logout")
async def logout(response: Response) -> dict[str, bool]:
    response.delete_cookie(COOKIE_NAME)
    return {"ok": True}


@app.get("/api/auth/status")
async def auth_status(request: Request) -> dict[str, bool]:
    return {"authenticated": valid_session(request.cookies.get(COOKIE_NAME))}


@app.get("/api/summary")
async def summary() -> dict[str, Any]:
    with connect() as db:
        profiles = db.execute("SELECT COUNT(*) total, SUM(enabled) enabled FROM watch_profiles").fetchone()
        listings = db.execute(
            """
            SELECT
              COUNT(*) total,
              SUM(status = 'new') new_count,
              SUM(status = 'hidden') hidden_count,
              SUM(status = 'notified') notified_count
            FROM listings
            """
        ).fetchone()
        recent_runs = db.execute(
            """
            SELECT run_logs.*, watch_profiles.enabled
            FROM run_logs
            LEFT JOIN watch_profiles ON watch_profiles.id = run_logs.profile_id
            ORDER BY finished_at DESC
            LIMIT 5
            """
        ).fetchall()
        errors = db.execute("SELECT COUNT(*) count FROM run_logs WHERE status = 'error'").fetchone()
    return {
        "profiles_total": profiles["total"] or 0,
        "profiles_enabled": profiles["enabled"] or 0,
        "listings_total": listings["total"] or 0,
        "listings_new": listings["new_count"] or 0,
        "listings_hidden": listings["hidden_count"] or 0,
        "listings_notified": listings["notified_count"] or 0,
        "run_errors": errors["count"] or 0,
        "recent_runs": [dict(row) for row in recent_runs],
    }


@app.get("/api/profiles")
async def list_profiles() -> list[dict[str, Any]]:
    with connect() as db:
        rows = db.execute("SELECT * FROM watch_profiles ORDER BY updated_at DESC").fetchall()
    return [row_to_profile(row) for row in rows]


@app.post("/api/profiles")
async def create_profile(payload: ProfilePayload) -> dict[str, Any]:
    now = utc_now()
    profile = payload.model_dump()
    profile["search_url"] = str(profile["search_url"])
    profile["poll_interval_minutes"] = max(settings.min_poll_minutes, profile["poll_interval_minutes"])
    get_connector(profile["source_type"]).validate_search_url(profile["search_url"])
    with connect() as db:
        cursor = db.execute(
            """
            INSERT INTO watch_profiles(
              name, enabled, source_type, search_url, poll_interval_minutes,
              include_keywords, exclude_keywords, required_keywords, excluded_categories,
              min_price, max_price, location_hint, notify_telegram, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            profile_values(profile, now),
        )
        row = db.execute("SELECT * FROM watch_profiles WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return row_to_profile(row)


@app.put("/api/profiles/{profile_id}")
async def update_profile(profile_id: int, payload: ProfilePayload) -> dict[str, Any]:
    now = utc_now()
    profile = payload.model_dump()
    profile["search_url"] = str(profile["search_url"])
    profile["poll_interval_minutes"] = max(settings.min_poll_minutes, profile["poll_interval_minutes"])
    get_connector(profile["source_type"]).validate_search_url(profile["search_url"])
    with connect() as db:
        db.execute(
            """
            UPDATE watch_profiles SET
              name = ?, enabled = ?, source_type = ?, search_url = ?, poll_interval_minutes = ?,
              include_keywords = ?, exclude_keywords = ?, required_keywords = ?, excluded_categories = ?,
              min_price = ?, max_price = ?, location_hint = ?, notify_telegram = ?, updated_at = ?
            WHERE id = ?
            """,
            profile_values(profile, now, include_created=False) + (profile_id,),
        )
        row = db.execute("SELECT * FROM watch_profiles WHERE id = ?", (profile_id,)).fetchone()
    if not row:
        raise HTTPException(404, "Profile not found")
    return row_to_profile(row)


@app.delete("/api/profiles/{profile_id}")
async def delete_profile(profile_id: int) -> dict[str, bool]:
    with connect() as db:
        cursor = db.execute("DELETE FROM watch_profiles WHERE id = ?", (profile_id,))
    if cursor.rowcount == 0:
        raise HTTPException(404, "Profile not found")
    return {"ok": True}


@app.post("/api/profiles/{profile_id}/run")
async def run_profile_endpoint(profile_id: int) -> dict[str, Any]:
    return await run_profile(profile_id)


@app.get("/api/listings")
async def list_listings(
    profile_id: int | None = None,
    status: str | None = None,
    include_hidden: bool = True,
    q: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
) -> list[dict[str, Any]]:
    clauses: list[str] = []
    values: list[Any] = []
    if profile_id:
        clauses.append("profile_id = ?")
        values.append(profile_id)
    if status:
        clauses.append("status = ?")
        values.append(status)
    elif not include_hidden:
        clauses.append("status != 'hidden'")
    if q:
        clauses.append("(listings.title LIKE ? OR listings.description_snippet LIKE ? OR listings.location_text LIKE ? OR listings.category_text LIKE ?)")
        like = f"%{q}%"
        values.extend([like, like, like, like])
    if min_price is not None:
        clauses.append("(price_value IS NULL OR price_value >= ?)")
        values.append(min_price)
    if max_price is not None:
        clauses.append("(price_value IS NULL OR price_value <= ?)")
        values.append(max_price)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    with connect() as db:
        rows = db.execute(
            f"""
            SELECT listings.*, watch_profiles.name profile_name
            FROM listings
            JOIN watch_profiles ON watch_profiles.id = listings.profile_id
            {where}
            ORDER BY first_seen_at DESC
            LIMIT 300
            """,
            values,
        ).fetchall()
    return [row_to_listing(row) for row in rows]


@app.patch("/api/listings/{listing_id}")
async def update_listing_status(listing_id: int, payload: ListingStatusPayload) -> dict[str, Any]:
    with connect() as db:
        db.execute("UPDATE listings SET status = ? WHERE id = ?", (payload.status, listing_id))
        row = db.execute("SELECT * FROM listings WHERE id = ?", (listing_id,)).fetchone()
    if not row:
        raise HTTPException(404, "Listing not found")
    return row_to_listing(row)


@app.get("/api/listings/{listing_id}/image")
async def listing_image(listing_id: int) -> Response:
    with connect() as db:
        row = db.execute("SELECT thumbnail_url FROM listings WHERE id = ?", (listing_id,)).fetchone()
    if not row:
        raise HTTPException(404, "Listing not found")
    image_url = row["thumbnail_url"]
    if not image_url:
        raise HTTPException(404, "Listing has no image")
    validate_remote_image_url(image_url)
    parsed = urlparse(image_url)
    async with httpx.AsyncClient(
        headers={
            "User-Agent": settings.user_agent,
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Referer": f"{parsed.scheme}://{parsed.netloc}/",
        },
        follow_redirects=True,
        timeout=20.0,
    ) as client:
        response = await client.get(image_url)
        response.raise_for_status()
    content_type = response.headers.get("content-type", "").split(";")[0].strip().lower()
    if not content_type.startswith("image/"):
        raise HTTPException(502, "Remote URL did not return an image")
    if len(response.content) > 5 * 1024 * 1024:
        raise HTTPException(502, "Remote image is too large")
    return Response(content=response.content, media_type=content_type)


@app.get("/api/settings")
async def get_settings() -> dict[str, Any]:
    with connect() as db:
        rows = db.execute("SELECT key, value FROM app_settings").fetchall()
    values = {row["key"]: row["value"] for row in rows}
    return {
        "telegram_bot_token": mask_secret(values.get("telegram_bot_token", "")),
        "telegram_bot_token_set": bool(values.get("telegram_bot_token")),
        "telegram_chat_id": values.get("telegram_chat_id", ""),
        "global_rate_limit_seconds": int(values.get("global_rate_limit_seconds", "20") or 20),
    }


@app.put("/api/settings")
async def update_settings(payload: SettingsPayload) -> dict[str, Any]:
    with connect() as db:
        current_token = get_setting(db, "telegram_bot_token")
        values = {
            "telegram_bot_token": current_token if payload.telegram_bot_token == "********" else payload.telegram_bot_token,
            "telegram_chat_id": payload.telegram_chat_id,
            "global_rate_limit_seconds": str(payload.global_rate_limit_seconds),
        }
        for key, value in values.items():
            db.execute(
                "INSERT INTO app_settings(key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                (key, value),
            )
    return await get_settings()


@app.post("/api/settings/telegram/test")
async def test_telegram() -> dict[str, bool]:
    with connect() as db:
        notifier = TelegramNotifier(get_setting(db, "telegram_bot_token"), get_setting(db, "telegram_chat_id"))
    await notifier.send_text("MarketPlaceLens Telegram test successful.")
    return {"ok": True}


async def run_profile(profile_id: int) -> dict[str, Any]:
    started_at = utc_now()
    with connect() as db:
        row = db.execute("SELECT * FROM watch_profiles WHERE id = ?", (profile_id,)).fetchone()
        settings_rows = db.execute("SELECT key, value FROM app_settings").fetchall()
    if not row:
        raise HTTPException(404, "Profile not found")
    profile = row_to_profile(row)
    connector = get_connector(profile["source_type"])
    try:
        candidates = await connector.fetch_listings(profile)
    except Exception as exc:  # surfacing connector failures in manual runs is useful for MVP operations.
        with connect() as db:
            record_run(
                db,
                profile,
                "error",
                {"fetched": 0, "new": 0, "hidden": 0, "duplicates": 0, "notified": 0},
                started_at,
                str(exc),
            )
        raise HTTPException(502, f"Connector failed: {exc}") from exc

    app_settings = {item["key"]: item["value"] for item in settings_rows}
    notifier = TelegramNotifier(app_settings.get("telegram_bot_token", ""), app_settings.get("telegram_chat_id", ""))
    stats = {"fetched": len(candidates), "new": 0, "hidden": 0, "duplicates": 0, "notified": 0}
    now = utc_now()
    with connect() as db:
        for candidate in candidates:
            existing = find_existing_listing(db, profile["id"], candidate)
            if existing:
                db.execute("UPDATE listings SET last_seen_at = ? WHERE id = ?", (now, existing["id"]))
                stats["duplicates"] += 1
                continue
            result = apply_filters(candidate, profile)
            status = result.status
            listing_id = insert_listing(db, profile["id"], candidate, status, result.score, result.reason, now)
            listing = db.execute("SELECT * FROM listings WHERE id = ?", (listing_id,)).fetchone()
            if status == "hidden":
                stats["hidden"] += 1
                continue
            stats["new"] += 1
            if profile["notify_telegram"] and notifier.configured:
                try:
                    await notifier.send_listing(row_to_listing(listing), profile, result.matched_reason)
                    db.execute("UPDATE listings SET status = 'notified', notified_at = ? WHERE id = ?", (utc_now(), listing_id))
                    stats["notified"] += 1
                except Exception:
                    pass
        db.execute("UPDATE watch_profiles SET last_run_at = ?, updated_at = ? WHERE id = ?", (now, now, profile_id))
        record_run(db, profile, "success", stats, started_at, "")
    return {"profile_id": profile_id, **stats}


async def poll_loop() -> None:
    await asyncio.sleep(3)
    while True:
        try:
            due_profiles = get_due_profiles()
            for profile in due_profiles:
                await run_profile(profile["id"])
                await asyncio.sleep(max(get_global_rate_limit(), random.randint(8, 18)))
        except Exception:
            pass
        await asyncio.sleep(60)


def get_due_profiles() -> list[dict[str, Any]]:
    with connect() as db:
        rows = db.execute(
            """
            SELECT * FROM watch_profiles
            WHERE enabled = 1
              AND (
                last_run_at IS NULL OR
                datetime(last_run_at) <= datetime('now', '-' || poll_interval_minutes || ' minutes')
              )
            ORDER BY COALESCE(last_run_at, created_at) ASC
            LIMIT 3
            """
        ).fetchall()
    return [row_to_profile(row) for row in rows]


def get_global_rate_limit() -> int:
    with connect() as db:
        value = get_setting(db, "global_rate_limit_seconds")
    try:
        return max(5, int(value or "20"))
    except ValueError:
        return 20


def profile_values(profile: dict[str, Any], now: str, include_created: bool = True) -> tuple[Any, ...]:
    values = (
        profile["name"],
        int(profile["enabled"]),
        profile["source_type"],
        profile["search_url"],
        profile["poll_interval_minutes"],
        encode_list(clean_words(profile["include_keywords"])),
        encode_list(clean_words(profile["exclude_keywords"])),
        encode_list(clean_words(profile["required_keywords"])),
        encode_list(clean_words(profile["excluded_categories"])),
        profile["min_price"],
        profile["max_price"],
        profile["location_hint"],
        int(profile["notify_telegram"]),
    )
    if include_created:
        return values + (now, now)
    return values + (now,)


def clean_words(values: list[str]) -> list[str]:
    return [item.strip() for item in values if item.strip()]


def get_setting(db, key: str) -> str:
    row = db.execute("SELECT value FROM app_settings WHERE key = ?", (key,)).fetchone()
    return row["value"] if row else ""


def mask_secret(value: str) -> str:
    return "********" if value else ""


def validate_remote_image_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise HTTPException(400, "Unsupported image URL")
    host = parsed.hostname.lower()
    if host in {"localhost", "localhost.localdomain"} or host.endswith(".local"):
        raise HTTPException(400, "Local image URLs are not allowed")
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return
    if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_reserved:
        raise HTTPException(400, "Private image URLs are not allowed")


def find_existing_listing(db: sqlite3.Connection, profile_id: int, candidate: ListingCandidate) -> sqlite3.Row | None:
    return db.execute(
        """
        SELECT * FROM listings
        WHERE profile_id = ? AND (source_listing_id = ? OR content_hash = ?)
        """,
        (profile_id, candidate.source_listing_id, candidate.content_hash),
    ).fetchone()


def insert_listing(
    db: sqlite3.Connection,
    profile_id: int,
    candidate: ListingCandidate,
    status: str,
    score: int,
    reason: str,
    now: str,
) -> int:
    cursor = db.execute(
        """
        INSERT INTO listings(
          source_type, source_listing_id, profile_id, title, price_text, price_value,
          location_text, category_text, posted_at_text, description_snippet, listing_url,
          thumbnail_url, content_hash, first_seen_at, last_seen_at, status, score, filter_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            candidate.source_type,
            candidate.source_listing_id,
            profile_id,
            candidate.title,
            candidate.price_text,
            candidate.price_value,
            candidate.location_text,
            candidate.category_text,
            candidate.posted_at_text,
            candidate.description_snippet,
            candidate.listing_url,
            candidate.thumbnail_url,
            candidate.content_hash,
            now,
            now,
            status,
            score,
            reason,
        ),
    )
    return int(cursor.lastrowid)


def record_run(
    db: sqlite3.Connection,
    profile: dict[str, Any],
    status: str,
    stats: dict[str, int],
    started_at: str,
    error_message: str,
) -> None:
    db.execute(
        """
        INSERT INTO run_logs(
          profile_id, profile_name, status, fetched, new_count, hidden_count,
          duplicate_count, notified_count, error_message, started_at, finished_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            profile["id"],
            profile["name"],
            status,
            stats.get("fetched", 0),
            stats.get("new", 0),
            stats.get("hidden", 0),
            stats.get("duplicates", 0),
            stats.get("notified", 0),
            error_message[:500],
            started_at,
            utc_now(),
        ),
    )

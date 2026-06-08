# MarketPlaceLens

Self-hosted marketplace/listing watcher for saved search URLs. MarketPlaceLens periodically checks configured listing pages, normalizes candidates through source connectors, applies local filters, stores listing history in SQLite, and can notify Telegram when new relevant matches appear.

## MVP Scope

- Docker Compose deployment
- Local SQLite database
- LanLens-inspired web UI
- Single-user login for the local web UI
- Search profiles with enable/disable, polling interval, source URL, price limits, keyword filters, category filters, and Telegram toggle
- Generic HTML listing connector for user-supplied search result URLs
- Filter engine with explainable hidden reasons
- Manual run per profile
- Background polling with conservative minimum interval
- Scrollable listing history with adjustable filters, hidden/new/notified/seen states, and click-to-load thumbnails
- Telegram settings and test message

## Compliance Boundaries

MarketPlaceLens is designed for conservative, user-supplied search result monitoring.

- No login automation
- No messages, favorites, or private user data extraction
- No CAPTCHA bypass
- No proxy rotation
- No aggressive polling intervals; profiles enforce a 30 minute minimum
- No full archival of third-party content
- No local image mirroring; only source thumbnail URLs are referenced
- Search results pages are checked by default; detail pages are not polled
- Use only for sources where you have access and permission to process the listing data

## Quick Start

```bash
cp .env.example .env
docker compose up -d --build
```

Open:

```text
http://localhost:8091
```

Default local login:

```text
admin / admin
```

Set `MARKETPLACELENS_ADMIN_USERNAME`, `MARKETPLACELENS_ADMIN_PASSWORD`, and `MARKETPLACELENS_SESSION_SECRET` in `.env` for real use.

## Configuration

The UI can store Telegram settings in SQLite. Environment variables can seed first-run defaults:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
MARKETPLACELENS_MIN_POLL_MINUTES=30
MARKETPLACELENS_DEFAULT_POLL_MINUTES=60
MARKETPLACELENS_ADMIN_USERNAME=admin
MARKETPLACELENS_ADMIN_PASSWORD=admin
MARKETPLACELENS_SESSION_SECRET=change-this-long-random-value
```

## Architecture

```text
app/
  main.py          FastAPI app, API routes, scheduler, run orchestration
  database.py      SQLite schema and row helpers
  connectors.py    MarketplaceConnector interface and generic HTML connector
  filters.py       include/exclude/required/category/price filter engine
  notifier.py      Telegram notifier
  static/          no-build frontend
```

## API Highlights

- `GET /api/summary`
- `GET /api/profiles`
- `POST /api/profiles`
- `PUT /api/profiles/{id}`
- `POST /api/profiles/{id}/run`
- `GET /api/listings`
- `PATCH /api/listings/{id}`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/settings/telegram/test`

## Dependency License Notes

Runtime dependencies are commonly used permissive packages:

- FastAPI: MIT
- Uvicorn: BSD-3-Clause
- Pydantic: MIT
- HTTPX: BSD-3-Clause
- Beautiful Soup 4: MIT

No scraping, browser automation, proxy, CAPTCHA, or paid third-party SDK dependency is included in this MVP.

Listing images are not mirrored locally. If a connector finds a thumbnail URL, the UI shows a "Load image" button and only requests the remote image after the user clicks it.

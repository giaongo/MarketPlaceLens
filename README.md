<p align="center">
  <img src="app/static/assets/marketplacelens-logo.png" alt="MarketPlaceLens logo" width="112" height="112">
</p>

<h1 align="center">MarketPlaceLens</h1>

<p align="center">
  <strong>Self-hosted marketplace monitoring with guided search jobs, review queues, watchlists, and AI-assisted inquiry texts.</strong>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-0.2.1-24745a">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-24745a">
  <img alt="Docker Compose" src="https://img.shields.io/badge/deploy-Docker%20Compose-24745a">
  <img alt="Python" src="https://img.shields.io/badge/python-3.12-24745a">
</p>

MarketPlaceLens watches marketplace search result pages, normalizes listings from different sources, applies local filters, and gives every user a focused place to review, save, hide, or act on found items. It is designed for small self-hosted deployments where the data stays local and the operator controls every source URL.

Useful links:

- [Documentation](docs/documentation.md)
- [Changelog](CHANGELOG.md)
- [Security policy](SECURITY.md)
- [Issue templates](.github/ISSUE_TEMPLATE)

## Screenshots

Screenshots below use demo data.

| Dashboard | Listings |
| --- | --- |
| ![MarketPlaceLens dashboard](docs/screenshots/marketplacelens-dashboard.png) | ![MarketPlaceLens listings](docs/screenshots/marketplacelens-listings.png) |

| Mobile wizard | Mobile review |
| --- | --- |
| ![Mobile quick-job wizard](docs/screenshots/marketplacelens-mobile-wizard.png) | ![Mobile listing review](docs/screenshots/marketplacelens-mobile-review.png) |

## What It Does

- Guided search-job wizard for Kleinanzeigen, Facebook Marketplace, mobile.de, and generic HTML result pages
- Manual job editor with provider URL detection, keyword rules, price limits, location criteria, and map-assisted radius selection
- Background polling with conservative interval limits and manual run controls
- Listing inbox with list/tile views, filters, pagination, lazy thumbnails, and clear seen/hidden/watchlist states
- Tinder-style review mode with large images, double-click watchlisting, swipe-to-seen, and desktop button fallbacks
- Multiple watchlists, default watchlist selection, and per-listing watchlist dropdowns
- Optional AI inquiry text generation through OpenAI API, Ollama, or LM Studio compatible chat completions
- Per-user buyer details for AI inquiry text personalization
- Multi-user roles: admins manage global settings and users; normal users manage their own jobs and listings
- Telegram and webhook notification settings
- English/German UI, light/dark theme, and mobile-friendly layouts

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

Set a real admin password and session secret before using the app beyond a local preview:

```env
MARKETPLACELENS_ADMIN_USERNAME=admin
MARKETPLACELENS_ADMIN_PASSWORD=change-me
MARKETPLACELENS_SESSION_SECRET=change-this-long-random-value
```

On first start, MarketPlaceLens bootstraps the first admin account from the environment. After that, admins manage users from Settings.

## Roles

Admins can manage every job, all users, notification settings, AI settings, watchlists, and global app configuration.

Normal users can create, edit, delete, and manually run their own search jobs. They can review their own listings, mark items seen or hidden, use watchlists, and change their own password. They cannot change global settings, provider configuration, AI configuration, notification secrets, or other users.

## AI Inquiry Texts

AI text generation is disabled by default. When an admin enables and configures it, listings show a `KI-Text` / `AI text` button. The generated text is shown in a copyable dialog only; MarketPlaceLens does not send messages to sellers.

Supported compatible providers:

- OpenAI API: `https://api.openai.com/v1`
- Ollama: `http://host.docker.internal:11434/v1`
- LM Studio: `http://host.docker.internal:1234/v1`

Available tones are very polite, normal, and cheeky.

Each user can save personal buyer details in Settings: name, location, contact note, and preferred signature. These details are included when that user generates an AI inquiry text.

## Sources

MarketPlaceLens works best with concrete search result URLs that are publicly reachable by the server.

- Kleinanzeigen: public search and category URLs
- Facebook Marketplace: concrete marketplace search/category URLs when Facebook returns public listing links
- mobile.de: public `mobile.de` / `suchen.mobile.de` search result URLs when embedded vehicle data is present
- Generic HTML: user-supplied search result pages with ordinary link cards

Some platforms return login, consent, protection, or JavaScript shell pages to anonymous server requests. MarketPlaceLens does not bypass login, CAPTCHA, bot protection, private APIs, or platform access controls. In those cases runs are recorded as connector errors with a clear message.

The official mobile.de Search API requires Basic Auth access, so the built-in connector uses public search pages rather than a private API.

## Configuration

Environment variables can seed first-run defaults:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
MARKETPLACELENS_WEBHOOK_URL=
MARKETPLACELENS_MIN_POLL_MINUTES=30
MARKETPLACELENS_DEFAULT_POLL_MINUTES=60
MARKETPLACELENS_POLL_ENABLED=true
MARKETPLACELENS_ADMIN_USERNAME=admin
MARKETPLACELENS_ADMIN_PASSWORD=admin
MARKETPLACELENS_SESSION_SECRET=change-this-long-random-value
MARKETPLACELENS_BUILD_CODE=0.2.1
MARKETPLACELENS_BUILD_COMMIT=dev
MARKETPLACELENS_BUILD_BRANCH=main
MARKETPLACELENS_BUILD_CREATED=
```

Runtime settings are stored in SQLite and can be managed from the Settings screen.

## Versioning

The current app version lives in:

- `VERSION`
- `app/version.py`
- Docker build args in `docker-compose.yml`
- the visible app version badge in the sidebar

`GET /api/version` returns version, build code, commit, branch, and build timestamp metadata. Release notes are tracked in [CHANGELOG.md](CHANGELOG.md).

## Development

Local Python validation:

```bash
python3 -m py_compile app/*.py
node --check app/static/app.js
git diff --check
```

Run locally:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8091
```

Build with Docker Compose:

```bash
docker compose up -d --build
```

## Architecture

```text
app/
  main.py          FastAPI app, API routes, scheduler, run orchestration
  database.py      SQLite schema and migrations
  connectors.py    Source connectors for Kleinanzeigen, Facebook, mobile.de, and generic HTML
  filters.py       Keyword/category/price filter engine
  notifier.py      Telegram and webhook delivery
  static/          no-build frontend
  version.py       Runtime version/build metadata
```

## Compliance Boundaries

MarketPlaceLens is a conservative monitoring tool for user-supplied search result pages.

- No login automation
- No CAPTCHA bypass
- No proxy rotation
- No aggressive polling
- No automatic seller messaging
- No full archival of third-party content
- No local thumbnail mirroring; images are proxied on demand

Use it only where you are allowed to access and process the listing data.

## License

MarketPlaceLens is released under the [MIT License](LICENSE).

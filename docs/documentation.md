# MarketPlaceLens Documentation

MarketPlaceLens is a self-hosted marketplace watcher. It helps users turn search result URLs into recurring jobs, review found listings, save interesting items to watchlists, and optionally draft buyer messages with a configured LLM provider.

## Setup

1. Install with Docker Compose.

   ```bash
   mkdir -p marketplacelens && cd marketplacelens && curl -fsSL https://raw.githubusercontent.com/AlexRosbach/MarketPlaceLens/main/docker-compose.install.yml -o docker-compose.yml && docker compose up -d
   ```

   For local development from a checkout, copy the environment template first.

   ```bash
   cp .env.example .env
   ```

2. Optionally adjust `.env` or compose environment values.

   ```env
   MARKETPLACELENS_ADMIN_USERNAME=admin
   ```

3. Start the app.

   ```bash
   docker compose up -d --build
   ```

4. Open `http://localhost:8091` and complete the setup screen. The first admin password is created there. MarketPlaceLens creates a persistent session secret automatically at startup.

## Search Jobs

Jobs are saved searches. A job stores the source, search URL, local filters, polling interval, and notification settings.

Use the quick-job wizard when creating a new search from a simple idea. It guides through source, search terms, optional price/location limits, keyword rules, and final review.

Use the manual job editor when you already have a precise search URL or need more control over filters. If a search URL already contains query parameters, MarketPlaceLens shows them as editable rows so they can be adjusted without hand-editing the full URL.

Every job has an oldest-listing limit. The default is 365 days.

Normal users can create and manage their own jobs. Admins can see and manage all jobs.

## Listings

The listing browser starts collapsed by default. Open it when you want to filter, sort, paginate, or switch between list and tile views.

Default listing views show active items. Listings marked `seen` or `hidden` disappear from the active list and stay available through explicit status filters.

## Review Mode

Review mode shows one listing at a time with image, price, location, source, and key details.

- Double-click or use `Watchlist` to save the listing.
- Use the arrow menu next to Watchlist to choose or create a specific watchlist.
- Swipe horizontally or use `Seen, next` to mark the item seen and move on.
- Use `Open original` to inspect the marketplace page.

## Watchlists

Users can create watchlists and choose their own default watchlist in Settings. The normal Watch action saves to that user's default list. The dropdown on listing cards and review cards lets users choose another list or create a new one directly.

## AI Features

Admins can enable AI inquiry texts in Settings.

Supported providers:

- OpenAI API
- Ollama
- LM Studio

The configured tone controls how the buyer message is written: very polite, normal, or cheeky. Generated text is displayed for copying only. MarketPlaceLens does not send seller messages.

Each user can store personal buyer details in Settings, including display name, location, contact note, and preferred signature. When AI inquiry texts are generated, those details are included in the prompt so the draft can sound like the user and include the right context.

The quick-job wizard can also use the configured AI provider to turn one sentence into a search draft. It fills source, query, category hint, price, location, radius, and keyword filters before the user saves the job. Admins can use the `Test AI` button in Settings to verify provider connectivity from the running container.

Admins can enable AI listing assessments separately from the base AI switch. When this is active, listing and review cards offer a `KI-Einschätzung` action. The generated note is stored with the listing and shown inline so the user can quickly judge fit, price/location relevance, and visible caution signs. Admins can also enable automatic assessments for visible listing batches; the settings panel includes a warning because every assessment sends listing text to the configured AI provider and can consume many tokens.

## Users and Roles

Admin:

- manage all jobs and listings
- manage users and roles
- edit notification, webhook, AI, and watchlist settings
- see all run logs and dashboard counts

The Settings page uses separate tabs for Notifications, Facebook, AI, Watchlists, Users, Recent runs, and Account. Notification settings are grouped into Telegram, webhook, and delivery-rule cards, matching the LanLens-style settings layout while keeping per-job notification delivery on the job cards. The Watchlists tab is available to every user and stores a per-user default watchlist.

User:

- create, edit, delete, and run their own jobs
- review and mark listings from their own jobs
- use watchlists and choose their own default watchlist
- change their own password
- cannot access global settings or other users' jobs

## Source Notes

MarketPlaceLens expects user-supplied Marketplace URLs. It does not bypass CAPTCHA, bot protection, private APIs, or platform access controls.

Facebook Marketplace and mobile.de may return login, consent, protection, or JavaScript-only pages to anonymous server requests. When that happens, MarketPlaceLens records a connector error with a direct explanation. For Facebook URLs that only work in the admin's own browser session, admins can paste their Facebook `Cookie` header in Settings. The value is stored locally in SQLite, masked in the UI/API, and only sent to `facebook.com`; no password is stored.

The official mobile.de Search API requires Basic Auth access. The built-in mobile.de connector therefore reads public search pages when mobile.de makes embedded vehicle data available to the server.

The marketplace connectors are intended only for private, self-hosted use with URLs you are allowed to access. Depending on source, frequency, and local law, automated checks may violate platform terms of service. The maintainer accepts no responsibility for misuse, blocked accounts, denied access, data processing, or third-party policy violations.

## Updating

Pull the latest code, rebuild the container, and restart:

```bash
git pull
docker compose up -d --build
```

SQLite schema migrations run during app startup.

## Version Metadata

`GET /api/version` returns:

- `version`
- `build_code`
- `commit`
- `branch`
- `created`

The same build code appears as a small badge in the sidebar.
The app also appends that build code to local CSS and JavaScript URLs, which keeps browser caches from mixing old UI scripts with newly deployed HTML.

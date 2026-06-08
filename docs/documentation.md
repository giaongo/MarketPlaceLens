# MarketPlaceLens Documentation

MarketPlaceLens is a self-hosted marketplace watcher. It helps users turn search result URLs into recurring jobs, review found listings, save interesting items to watchlists, and optionally draft buyer messages with a configured LLM provider.

## Setup

1. Copy the environment template.

   ```bash
   cp .env.example .env
   ```

2. Set at least these values in `.env`.

   ```env
   MARKETPLACELENS_ADMIN_USERNAME=admin
   MARKETPLACELENS_ADMIN_PASSWORD=change-me
   MARKETPLACELENS_SESSION_SECRET=change-this-long-random-value
   ```

3. Start the app.

   ```bash
   docker compose up -d --build
   ```

4. Open `http://localhost:8091`.

## Search Jobs

Jobs are saved searches. A job stores the source, search URL, local filters, polling interval, and notification settings.

Use the quick-job wizard when creating a new search from a simple idea. It guides through source, search terms, optional price/location limits, keyword rules, and final review.

Use the manual job editor when you already have a precise search URL or need more control over filters.

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

Admins can create watchlists and choose the default watchlist in Settings. The normal Watch action saves to that default list. The dropdown on listing cards and review cards lets users choose another list or create a new one directly.

## AI Inquiry Texts

Admins can enable AI inquiry texts in Settings.

Supported providers:

- OpenAI API
- Ollama
- LM Studio

The configured tone controls how the buyer message is written: very polite, normal, or cheeky. Generated text is displayed for copying only. MarketPlaceLens does not send seller messages.

## Users and Roles

Admin:

- manage all jobs and listings
- manage users and roles
- edit notification, webhook, AI, and watchlist settings
- see all run logs and dashboard counts

User:

- create, edit, delete, and run their own jobs
- review and mark listings from their own jobs
- use watchlists
- change their own password
- cannot access global settings or other users' jobs

## Source Notes

MarketPlaceLens expects user-supplied search result URLs. It does not automate private sessions or bypass access controls.

Facebook Marketplace and mobile.de may return login, consent, protection, or JavaScript-only pages to anonymous server requests. When that happens, MarketPlaceLens records a connector error with a direct explanation.

The official mobile.de Search API requires Basic Auth access. The built-in mobile.de connector therefore reads public search pages when mobile.de makes embedded vehicle data available to the server.

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

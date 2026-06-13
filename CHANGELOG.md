# Changelog

All notable changes to MarketPlaceLens are documented here.

## Unreleased

### Fixed

- Kleinanzeigen paginated scans now keep the HTTP client open while following result pages.
- Listing page-size controls now honor 50 and 100 item options, with 100 as the default.
- Facebook connector errors now distinguish anonymous access/login blocks from empty result pages.
- Responsive controls, listing cards, pagination, and headers wrap more defensively to avoid UI overlaps.

## [0.3.0] - 2026-06-08

### Added

- First-run setup screen for creating the initial admin password.
- Persistent session secret generation at startup when no secret is supplied.
- Editable URL-parameter rows for existing search URLs.
- Per-job oldest-listing limit, defaulting to 365 days.
- Dashboard source summary and recent-run widgets.
- Docker Hub image documentation for `alexrosbach/marketplacelens`.
- One-line Docker Compose install file using the published image.
- Public/private-use source compliance note for marketplace connectors.

### Changed

- Listing controls are collapsed by default while the listing page itself remains visible.
- Kleinanzeigen fetching follows public pagination links to import more available listings.
- Settings use a tabbed admin/account layout.
- UI shadows, cards, and mobile wrapping were tuned to reduce overlap and improve depth.
- Docker/image version advanced to `0.3.0`.

## [0.2.1] - 2026-06-08

### Added

- Per-user buyer profile fields for AI inquiry generation.
- Account settings for display name, location, contact note, and preferred message signature.
- AI inquiry prompts now include the current user's profile data when configured.

## [0.2.0] - 2026-06-08

### Added

- Guided quick-job wizard with step validation and mobile-friendly flow.
- mobile.de as a dedicated source option and connector.
- Multi-user roles with admin-only global settings and user-owned jobs for normal users.
- Multiple watchlists with default watchlist selection and per-listing watchlist menus.
- Optional AI-generated inquiry texts through OpenAI API, Ollama, or LM Studio.
- Tinder-style listing review mode with swipe-to-seen and double-click watchlisting.
- Version metadata endpoint, Docker build args, and visible app version badge.
- Normal project documentation, screenshots, security policy, license, and issue templates.

### Changed

- README now describes the product as a normal self-hosted application.
- Standard listing views hide `seen` and `hidden` listings unless explicitly filtered.
- The listing browser starts collapsed by default.
- UI styling was refreshed with a clearer MarketPlaceLens visual identity.

### Notes

- Facebook Marketplace and mobile.de can block anonymous server requests. MarketPlaceLens now reports those cases as explicit connector errors instead of silent empty runs.

## [0.1.0] - 2026-06-08

### Added

- Initial self-hosted FastAPI/SQLite marketplace watcher.
- Docker Compose deployment.
- Local web UI with jobs, listings, settings, and notifications.
- Kleinanzeigen, Facebook Marketplace, and generic HTML source handling.
- Telegram and webhook notification support.

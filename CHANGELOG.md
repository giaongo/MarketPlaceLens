# Changelog

All notable changes to MarketPlaceLens are documented here.

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

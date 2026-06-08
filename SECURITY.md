# Security Policy

MarketPlaceLens is intended for small self-hosted deployments. Keep it behind a trusted network or reverse proxy and use a strong `MARKETPLACELENS_SESSION_SECRET`.

## Reporting a Vulnerability

Please report sensitive security issues privately through GitHub Security Advisories:

https://github.com/AlexRosbach/MarketPlaceLens/security/advisories/new

Avoid posting secrets, tokens, database files, or private marketplace data in public issues.

## Operational Notes

- Change the default `admin / admin` credentials before real use.
- Store Telegram tokens, webhook URLs, and AI API keys as secrets.
- Do not expose the app directly to the public internet without authentication, TLS, and a reverse proxy.
- The app does not intentionally automate logins, bypass CAPTCHA, rotate proxies, or send messages to sellers.

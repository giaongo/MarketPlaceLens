from __future__ import annotations

import base64
import hmac
from hashlib import sha256

from .config import settings


COOKIE_NAME = "marketplacelens_session"


def create_session(username: str) -> str:
    payload = base64.urlsafe_b64encode(username.encode("utf-8")).decode("ascii")
    signature = hmac.new(settings.session_secret.encode("utf-8"), payload.encode("ascii"), sha256).hexdigest()
    return f"{payload}.{signature}"


def valid_session(value: str | None) -> bool:
    if not value or "." not in value:
        return False
    payload, signature = value.split(".", 1)
    expected = hmac.new(settings.session_secret.encode("utf-8"), payload.encode("ascii"), sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return False
    try:
        username = base64.urlsafe_b64decode(payload.encode("ascii")).decode("utf-8")
    except Exception:
        return False
    return username == settings.admin_username


def valid_credentials(username: str, password: str) -> bool:
    return hmac.compare_digest(username, settings.admin_username) and hmac.compare_digest(password, settings.admin_password)


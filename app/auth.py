from __future__ import annotations

import base64
import os
import hmac
from hashlib import sha256
import hashlib

from .config import settings
from .database import connect


COOKIE_NAME = "marketplacelens_session"
PASSWORD_ITERATIONS = 260000


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
    if not hmac.compare_digest(username, settings.admin_username):
        return False
    stored_hash = get_stored_password_hash()
    if stored_hash:
        return verify_password(password, stored_hash)
    return hmac.compare_digest(password, settings.admin_password)


def get_stored_password_hash() -> str:
    try:
        with connect() as db:
            row = db.execute("SELECT value FROM app_settings WHERE key = 'admin_password_hash'").fetchone()
    except Exception:
        return ""
    return row["value"] if row else ""


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS)
    return ".".join(
        [
            "pbkdf2_sha256",
            str(PASSWORD_ITERATIONS),
            base64.urlsafe_b64encode(salt).decode("ascii"),
            base64.urlsafe_b64encode(digest).decode("ascii"),
        ]
    )


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations, salt, digest = stored_hash.split(".", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        expected = base64.urlsafe_b64decode(digest.encode("ascii"))
        actual = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            base64.urlsafe_b64decode(salt.encode("ascii")),
            int(iterations),
        )
    except Exception:
        return False
    return hmac.compare_digest(actual, expected)

"""Small local authentication boundary for the hackathon demonstration.

Replace the demo credentials and fixed demo code with an identity provider and a
real TOTP/WebAuthn implementation before any non-demo deployment.
"""
from __future__ import annotations

import hmac
import os
import secrets
import threading
import time
from dataclasses import dataclass
from http.cookies import SimpleCookie


SESSION_COOKIE = "amin_session"
SESSION_TTL_SECONDS = 30 * 60
CHALLENGE_TTL_SECONDS = 5 * 60


@dataclass
class Challenge:
    username: str
    expires_at: float
    attempts: int = 0


class DemoAuthenticator:
    def __init__(self) -> None:
        self.username = os.environ.get("AMIN_DEMO_USER", "analyst@amin.local")
        self.password = os.environ.get("AMIN_DEMO_PASSWORD", "AMIN-2026!")
        self.otp_code = os.environ.get("AMIN_DEMO_2FA_CODE", "483921")
        self._challenges: dict[str, Challenge] = {}
        self._sessions: dict[str, tuple[str, float]] = {}
        self._lock = threading.RLock()

    def begin(self, username: object, password: object) -> tuple[dict, int]:
        if not isinstance(username, str) or not isinstance(password, str):
            return {"error": "Enter your access ID and passphrase."}, 400
        if not (hmac.compare_digest(username.strip().lower(), self.username.lower())
                and hmac.compare_digest(password, self.password)):
            return {"error": "Access ID or passphrase could not be verified."}, 401
        with self._lock:
            self._purge()
            challenge_id = secrets.token_urlsafe(24)
            self._challenges[challenge_id] = Challenge(self.username, time.time() + CHALLENGE_TTL_SECONDS)
        return {
            "challengeId": challenge_id,
            "expiresInSeconds": CHALLENGE_TTL_SECONDS,
            "delivery": "secure authenticator",
            "demoCode": self.otp_code if self.is_demo_mode else None,
        }, 200

    def verify(self, challenge_id: object, code: object) -> tuple[dict, int, str | None]:
        if not isinstance(challenge_id, str) or not isinstance(code, str):
            return {"error": "Enter the six-digit verification code."}, 400, None
        with self._lock:
            self._purge()
            challenge = self._challenges.get(challenge_id)
            if not challenge:
                return {"error": "This verification request has expired. Sign in again."}, 401, None
            challenge.attempts += 1
            if challenge.attempts > 5:
                del self._challenges[challenge_id]
                return {"error": "Too many verification attempts. Sign in again."}, 429, None
            if not hmac.compare_digest(code.replace(" ", ""), self.otp_code):
                return {"error": "That verification code was not accepted."}, 401, None
            del self._challenges[challenge_id]
            session_id = secrets.token_urlsafe(32)
            self._sessions[session_id] = (challenge.username, time.time() + SESSION_TTL_SECONDS)
        return {
            "authenticated": True,
            "user": {"name": "Aarav Mehta", "role": "Fraud Operations Analyst", "accessTier": "Restricted"},
            "expiresInSeconds": SESSION_TTL_SECONDS,
        }, 200, session_id

    def session(self, cookie_header: str | None) -> dict | None:
        session_id = self._read_cookie(cookie_header)
        if not session_id:
            return None
        with self._lock:
            self._purge()
            session = self._sessions.get(session_id)
            if not session:
                return None
            username, expires_at = session
            return {"authenticated": True, "username": username, "expiresInSeconds": int(expires_at - time.time())}

    def logout(self, cookie_header: str | None) -> None:
        session_id = self._read_cookie(cookie_header)
        if session_id:
            with self._lock:
                self._sessions.pop(session_id, None)

    @property
    def is_demo_mode(self) -> bool:
        return "AMIN_DEMO_2FA_CODE" not in os.environ

    @staticmethod
    def cookie_value(session_id: str | None, clear: bool = False) -> str:
        if clear:
            return f"{SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
        return f"{SESSION_COOKIE}={session_id}; Path=/; HttpOnly; SameSite=Strict; Max-Age={SESSION_TTL_SECONDS}"

    def _read_cookie(self, cookie_header: str | None) -> str | None:
        if not cookie_header:
            return None
        cookie = SimpleCookie()
        try:
            cookie.load(cookie_header)
        except (TypeError, ValueError):
            return None
        item = cookie.get(SESSION_COOKIE)
        return item.value if item else None

    def _purge(self) -> None:
        now = time.time()
        self._challenges = {key: item for key, item in self._challenges.items() if item.expires_at > now}
        self._sessions = {key: item for key, item in self._sessions.items() if item[1] > now}


AUTH = DemoAuthenticator()

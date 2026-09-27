from __future__ import annotations

import json
import mimetypes
from http.server import BaseHTTPRequestHandler
from urllib.parse import unquote, urlparse

from config import FRONTEND_ROOT
from auth import AUTH
from routes.router import NOT_FOUND, route_get, route_post


class Handler(BaseHTTPRequestHandler):
    server_version = "AMIN/2.0"

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/auth/session":
            self.json_response(AUTH.session(self.headers.get("Cookie")) or {"authenticated": False})
            return
        if path.startswith("/api/") and path not in {"/api/health"} and not self.is_authenticated():
            self.json_response({"error": "Authentication is required for this resource."}, 401)
            return
        payload, status = route_get(self.path)
        if payload is NOT_FOUND:
            self.serve_static(urlparse(self.path).path)
            return
        self.json_response(payload, status)

    def do_POST(self) -> None:
        try:
            body = self.read_json()
        except ValueError as error:
            self.json_response({"error": str(error)}, 400)
            return
        path = urlparse(self.path).path
        if path == "/api/auth/login":
            payload, status = AUTH.begin(body.get("username"), body.get("password"))
        elif path == "/api/auth/verify":
            payload, status, session_id = AUTH.verify(body.get("challengeId"), body.get("code"))
            if session_id:
                self.json_response(payload, status, AUTH.cookie_value(session_id))
                return
        elif path == "/api/auth/logout":
            AUTH.logout(self.headers.get("Cookie"))
            self.json_response({"authenticated": False}, 200, AUTH.cookie_value(None, clear=True))
            return
        elif path.startswith("/api/") and path != "/api/identity-checks" and not self.is_authenticated():
            payload, status = {"error": "Authentication is required for this resource."}, 401
        else:
            payload, status = route_post(self.path, body)
        self.json_response(payload, status)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_common_headers("application/json")
        self.end_headers()

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length < 0 or length > 65536:
            raise ValueError("Request body must be at most 64 KiB")
        if not length:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"),
                              parse_constant=lambda value: self.reject_constant(value))
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise ValueError("Request body must contain valid JSON") from None

    @staticmethod
    def reject_constant(value):
        raise ValueError(f"Non-finite JSON number is not allowed: {value}")

    def json_response(self, payload: dict, status: int = 200, cookie: str | None = None) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_common_headers("application/json")
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_common_headers(self, content_type: str) -> None:
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")

    def serve_static(self, path: str) -> None:
        if path in {"/", "/index.html", "/auth.html"}:
            path = "/auth.html"
        elif path in {"/dashboard", "/dashboard.html"}:
            if not self.is_authenticated():
                self.redirect("/")
                return
            path = "/index.html"
        file_path = (FRONTEND_ROOT / unquote(path).lstrip("/")).resolve()
        if not str(file_path).startswith(str(FRONTEND_ROOT)) or not file_path.exists() or not file_path.is_file():
            self.json_response({"error": "not found"}, 404)
            return
        content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_common_headers(content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def is_authenticated(self) -> bool:
        return AUTH.session(self.headers.get("Cookie")) is not None

    def redirect(self, location: str) -> None:
        self.send_response(302)
        self.send_header("Location", location)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def log_message(self, format: str, *args) -> None:
        return

"""Vercel serverless entrypoint for Adaptive Mule Intelligence Network.

The local development server uses ``ThreadingHTTPServer``.  Vercel invokes a
``BaseHTTPRequestHandler`` subclass per serverless request instead, so this
module exposes that handler from the repository root deployment.
"""
from __future__ import annotations

import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND_ROOT = PROJECT_ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from models.risk_model import ENGINE  # noqa: E402
from server.http_handler import Handler  # noqa: E402


def seed_demo_feed() -> None:
    """Populate a useful initial dashboard view on a fresh serverless instance."""
    if ENGINE.events:
        return
    seed_events = [
        {"device": "DEV-71A", "phone": "+91-98XXXX2310", "amount": 96000, "channel": "UPI"},
        {"device": "DEV-42X", "amount": 188000, "channel": "IMPS", "caseId": "CERT-FIN-4821"},
        {"account": "AC88420", "beneficiary": "AC44771", "amount": 51000, "channel": "UPI"},
    ]
    for event in seed_events:
        ENGINE.ingest_transaction(ENGINE.generate_transaction(event))
    for _ in range(18):
        ENGINE.ingest_transaction(ENGINE.generate_transaction())


seed_demo_feed()


class handler(Handler):
    """Vercel-recognized request handler."""


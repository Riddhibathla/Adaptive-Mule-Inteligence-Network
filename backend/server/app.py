from __future__ import annotations

import threading
import time
from http.server import ThreadingHTTPServer

from config import HOST, PORT
from models.risk_model import ENGINE
from server.http_handler import Handler


def stream_transactions() -> None:
    seed_events = [
        {"device": "DEV-71A", "phone": "+91-98XXXX2310", "amount": 96000, "channel": "UPI"},
        {"device": "DEV-42X", "amount": 188000, "channel": "IMPS", "caseId": "CERT-FIN-4821"},
        {"account": "AC88420", "beneficiary": "AC44771", "amount": 51000, "channel": "UPI"},
    ]
    for forced in seed_events:
        ENGINE.ingest_transaction(ENGINE.generate_transaction(forced))
    # Start with a sufficiently rich live-feed window so the investigator stream
    # is useful immediately, before the periodic generator adds more events.
    for _ in range(18):
        ENGINE.ingest_transaction(ENGINE.generate_transaction())
    while ENGINE.running:
        time.sleep(2.2)
        ENGINE.ingest_transaction(ENGINE.generate_transaction())


def main() -> None:
    threading.Thread(target=stream_transactions, daemon=True).start()
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Adaptive Mule Intelligence Network running at http://{HOST}:{PORT}")
    try:
        httpd.serve_forever()
    finally:
        ENGINE.running = False
        httpd.server_close()

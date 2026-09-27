from __future__ import annotations

import csv
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from http.cookiejar import CookieJar
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import HTTPCookieProcessor, Request, build_opener, urlopen

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
from config import DATASET_PATH
from models.ml_model import AdaptiveRiskModel, FEATURE_NAMES, record_features
from models.risk_model import ENGINE, FeatureStore
from server.http_handler import Handler


class MLTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.model = ENGINE.model

    def test_split_is_chronological_and_sender_disjoint(self):
        splits = list(self.model.splits.values())
        for earlier, later in zip(splits, splits[1:]):
            self.assertLess(max(row["timestamp"] for row in earlier), min(row["timestamp"] for row in later))
        account_sets = [{row["sender_account"] for row in rows} for rows in splits]
        for i in range(3):
            for j in range(i + 1, 3):
                self.assertFalse(account_sets[i] & account_sets[j])
        self.assertEqual(self.model.model_card()["excludedReviewRows"], 5)

    def test_outcome_fields_cannot_change_features(self):
        row = self.model.splits["train"][0]
        changed = row | {"label": "fraud", "risk_score": "100", "investigator_feedback": "confirmed_mule",
                         "is_cyber_alert_match": "1", "is_watchlisted_account": "1"}
        self.assertEqual(record_features(row), record_features(changed))

    def test_test_set_cannot_affect_fit_or_threshold(self):
        with DATASET_PATH.open(newline="", encoding="utf-8-sig") as handle:
            reader = csv.DictReader(handle)
            fields, rows = reader.fieldnames, list(reader)
        test_ids = {row["transaction_id"] for row in self.model.splits["test"]}
        for row in rows:
            if row["transaction_id"] in test_ids:
                row["amount"] = str(float(row["amount"]) * 100)
                row["amount_to_avg_ratio"] = "99"
                row["label"] = "safe" if row["label"] in {"fraud", "mule"} else "fraud"
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "test.csv"
            with path.open("w", newline="", encoding="utf-8") as handle:
                writer = csv.DictWriter(handle, fieldnames=fields)
                writer.writeheader()
                writer.writerows(rows)
            changed_model = AdaptiveRiskModel(path)
        matrix, _ = self.model.matrix(self.model.splits["train"])
        np.testing.assert_array_equal(self.model.probabilities(matrix), changed_model.probabilities(matrix))
        np.testing.assert_array_equal(self.model.anomaly.score_samples(matrix), changed_model.anomaly.score_samples(matrix))
        self.assertEqual(self.model.threshold, changed_model.threshold)

    def test_offline_online_feature_parity(self):
        store = FeatureStore()
        for row in self.model.splits["test"]:
            event = {
                "amount": float(row["amount"]), "channel": row["channel"],
                "account": row["sender_account"], "beneficiary": row["receiver_account"],
                "device": row["device_id"], "phone": row["phone_number"],
                "timestamp": row["timestamp"], "caseId": None,
                "context": {"averageAmount": float(row["amount"]) / float(row["amount_to_avg_ratio"]),
                            "hourlyTxnCount": float(row["hourly_txn_count"]),
                            "dailyTxnCount": float(row["daily_txn_count"]),
                            "sharedDeviceAccountCount": float(row["shared_device_account_count"]),
                            "isNewBeneficiary": bool(int(row["is_new_beneficiary"]))},
            }
            online = store.features_for(event, 0, 0)
            offline = record_features(row)
            for name in FEATURE_NAMES:
                self.assertAlmostEqual(online[name], offline[name])

    def test_prediction_is_finite_explained_and_policy_separate(self):
        features = record_features(self.model.splits["test"][0])
        prediction = self.model.predict(features)
        boosted = self.model.predict(features | {"watchlist_hit": 1, "graph_score": 90, "feedback_boost": 30})
        self.assertEqual(prediction["supervisedProbability"], boosted["supervisedProbability"])
        self.assertGreater(boosted["ensembleScore"], prediction["ensembleScore"])
        self.assertEqual(len(prediction["explanations"]), 4)
        self.assertFalse(prediction["probabilityCalibrated"])
        json.dumps(prediction, allow_nan=False)

    def test_online_velocity_uses_preceding_time_windows(self):
        store = FeatureStore()
        now = datetime.now(timezone.utc)
        event = {"amount": 1000, "channel": "UPI", "account": "A", "beneficiary": "B",
                 "device": "D", "phone": "P", "caseId": None, "timestamp": now.isoformat()}
        for hours in (26, 2, .5):
            store.update(event | {"timestamp": (now - timedelta(hours=hours)).isoformat()})
        features = store.features_for(event, 0, 0)
        self.assertEqual(features["account_velocity"], 1)
        self.assertEqual(features["daily_txn_count"], 2)
        self.assertEqual(features["amount_to_average"], 1)
        self.assertEqual(features["is_new_beneficiary"], 0)
        self.assertEqual(len(store.account_events["A"]), 3)


class APITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f"http://127.0.0.1:{cls.server.server_port}"
        cls.cookies = CookieJar()
        cls.opener = build_opener(HTTPCookieProcessor(cls.cookies))
        status, challenge = cls.request("/api/auth/login", json.dumps({
            "username": "analyst@amin.local", "password": "AMIN-2026!",
        }).encode())
        assert status == 200
        status, _ = cls.request("/api/auth/verify", json.dumps({
            "challengeId": challenge["challengeId"], "code": "483921",
        }).encode())
        assert status == 200

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    @classmethod
    def request(cls, path, body=None):
        request = Request(cls.base + path, data=body, headers={"Content-Type": "application/json"})
        try:
            with cls.opener.open(request, timeout=10) as response:
                return response.status, json.load(response)
        except HTTPError as response:
            with response:
                return response.code, json.load(response)

    def test_authentication_boundary_and_two_factor_flow(self):
        with self.assertRaises(HTTPError) as error:
            urlopen(self.base + "/api/state")
        self.assertEqual(error.exception.code, 401)
        error.exception.close()
        status, failure = self.request("/api/auth/login", json.dumps({
            "username": "wrong@example.com", "password": "wrong",
        }).encode())
        self.assertEqual(status, 401)
        self.assertIn("error", failure)
        status, challenge = self.request("/api/auth/login", json.dumps({
            "username": "analyst@amin.local", "password": "AMIN-2026!",
        }).encode())
        self.assertEqual(status, 200)
        status, failure = self.request("/api/auth/verify", json.dumps({
            "challengeId": challenge["challengeId"], "code": "000000",
        }).encode())
        self.assertEqual(status, 401)
        self.assertIn("error", failure)

    def test_report(self):
        status, report = self.request("/api/model/report")
        self.assertEqual(status, 200)
        self.assertEqual(report["test"]["samples"], 7)
        self.assertIn("baseline", report["test"])

    def test_transaction_uses_ml_and_creates_review_alert(self):
        payload = {"account": "TEST-SENDER", "beneficiary": "TEST-RECEIVER", "device": "TEST-DEVICE",
                   "phone": "TEST-PHONE", "amount": 185000, "channel": "UPI", "caseId": None,
                   "context": {"averageAmount": 18000, "hourlyTxnCount": 8, "dailyTxnCount": 20,
                               "sharedDeviceAccountCount": 6, "isNewBeneficiary": True}}
        status, result = self.request("/api/transactions", json.dumps(payload).encode())
        self.assertEqual(status, 201)
        self.assertEqual(result["modelBreakdown"]["modelVersion"], ENGINE.model.version)
        self.assertGreater(result["modelBreakdown"]["supervisedProbability"], ENGINE.model.threshold)
        self.assertIn(result["action"], {"Hold transaction for review", "Debit freeze and case escalation"})
        _, state = self.request("/api/state")
        self.assertTrue(any(alert["id"] == result["id"] for alert in state["alerts"]))

    def test_invalid_requests_do_not_create_transactions(self):
        initial = len(ENGINE.events)
        for body in [b'{bad', b'[]', b'{"amount":NaN}', b'{"amount":0}', b'{"amount":-1}',
                     b'{"amount":"bad"}', b'{"context":{"label":1}}',
                     b'{"context":{"averageAmount":0}}', b'{"channel":"INVALID"}', b'{"caseId":[]}']:
            with self.subTest(body=body):
                status, result = self.request("/api/transactions", body)
                self.assertEqual(status, 400)
                self.assertIn("error", result)
        self.assertEqual(len(ENGINE.events), initial)

    def test_identity_is_explicitly_separate_demo(self):
        status, result = self.request("/api/identity-checks", json.dumps({
            "identifierType": "pan", "identifier": "ABCDE1234F", "consent": True,
        }).encode())
        self.assertEqual(status, 201)
        self.assertEqual(result["dataMode"], "synthetic-demo")
        self.assertFalse(result["mlApplied"])

    def test_feedback_does_not_claim_or_perform_online_retraining(self):
        payload = {"account": "FEEDBACK-A", "beneficiary": "FEEDBACK-B", "device": "FEEDBACK-D",
                   "phone": "FEEDBACK-P", "amount": 1000, "channel": "NEFT", "caseId": None}
        _, result = self.request("/api/transactions", json.dumps(payload).encode())
        before = ENGINE.model.logistic[-1].coef_.copy()
        threshold = ENGINE.model.threshold
        status, _ = self.request("/api/feedback", json.dumps({"eventId": result["id"], "label": "confirmed_mule"}).encode())
        self.assertEqual(status, 201)
        np.testing.assert_array_equal(before, ENGINE.model.logistic[-1].coef_)
        self.assertEqual(threshold, ENGINE.model.threshold)
        self.assertEqual(ENGINE.feedback_risk["account:FEEDBACK-A"], 35)


if __name__ == "__main__":
    unittest.main()

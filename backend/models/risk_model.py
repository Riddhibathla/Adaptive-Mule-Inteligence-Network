from __future__ import annotations

import hashlib
import math
import random
import statistics
import threading
import time
import uuid
from collections import Counter, defaultdict, deque
from datetime import datetime, timezone

from config import (
    CHANNELS,
    CITIES,
    CYBER_CASES,
    WATCHLISTED_ACCOUNTS,
    WATCHLISTED_DEVICES,
    WATCHLISTED_PHONES,
)
from models.ml_model import AdaptiveRiskModel, behavior_features


def clamp(value: float, low: float = 0, high: float = 100) -> float:
    return max(low, min(high, value))


def number_or_text(value: str | None):
    if value is None or value == "":
        return None
    try:
        if "." in value:
            return float(value)
        return int(value)
    except ValueError:
        return value


class FeatureStore:
    """Maintains online entity history used by the model layer."""

    def __init__(self) -> None:
        self.amounts: deque[int] = deque(maxlen=500)
        self.account_events: dict[str, deque[dict]] = defaultdict(lambda: deque(maxlen=50))
        self.beneficiary_events: dict[str, deque[dict]] = defaultdict(lambda: deque(maxlen=50))
        self.device_events: dict[str, deque[dict]] = defaultdict(lambda: deque(maxlen=80))
        self.phone_events: dict[str, deque[dict]] = defaultdict(lambda: deque(maxlen=80))
        self.account_counter: Counter[str] = Counter()
        self.device_counter: Counter[str] = Counter()
        self.beneficiary_counter: Counter[str] = Counter()

    def features_for(self, event: dict, graph_score: float, feedback_boost: float) -> dict:
        amount = event["amount"]
        median_amount = statistics.median(self.amounts) if self.amounts else 12500
        mean_amount = statistics.mean(self.amounts) if self.amounts else 18000
        stdev_amount = statistics.pstdev(self.amounts) if len(self.amounts) > 2 else 25000
        amount_z = (amount - mean_amount) / max(stdev_amount, 1)

        account_history = list(self.account_events[event["account"]])
        beneficiary_history = list(self.beneficiary_events[event["beneficiary"]])
        device_history = list(self.device_events[event["device"]])
        phone_history = list(self.phone_events[event["phone"]])

        unique_accounts_on_device = len({item["account"] for item in device_history} | {event["account"]})
        unique_beneficiaries_from_account = len({item["beneficiary"] for item in account_history} | {event["beneficiary"]})
        channel_switches = len({item["channel"] for item in account_history[-8:]} | {event["channel"]})
        now = datetime.fromisoformat(event["timestamp"])
        ages = [(now - datetime.fromisoformat(item["timestamp"])).total_seconds() for item in account_history]
        context = event.get("context", {})
        average = statistics.mean(item["amount"] for item in account_history) if account_history else 18000
        behavioral = behavior_features(
            amount, event["channel"], context.get("averageAmount", average),
            context.get("hourlyTxnCount", sum(0 <= age < 3600 for age in ages)),
            context.get("dailyTxnCount", sum(0 <= age < 86400 for age in ages)),
            context.get("sharedDeviceAccountCount", unique_accounts_on_device),
            context.get("isNewBeneficiary", not any(item["beneficiary"] == event["beneficiary"] for item in account_history)),
        )

        return {
            "amount": amount,
            "amount_to_median": amount / max(median_amount, 1),
            "amount_z": amount_z,
            "account_velocity": len(account_history),
            "beneficiary_reuse": len(beneficiary_history),
            "device_velocity": len(device_history),
            "phone_velocity": len(phone_history),
            "unique_accounts_on_device": unique_accounts_on_device,
            "unique_beneficiaries_from_account": unique_beneficiaries_from_account,
            "channel_switches": channel_switches,
            "is_upi_high_value": int(event["channel"] == "UPI" and amount > 45000),
            "has_regulatory_case": int(bool(event.get("caseId"))),
            "watchlist_hit": int(
                event["device"] in WATCHLISTED_DEVICES
                or event["phone"] in WATCHLISTED_PHONES
                or event["account"] in WATCHLISTED_ACCOUNTS
            ),
            "graph_score": graph_score,
            "feedback_boost": feedback_boost,
            **behavioral,
        }

    def update(self, event: dict) -> None:
        self.amounts.append(event["amount"])
        self.account_events[event["account"]].append(event)
        self.beneficiary_events[event["beneficiary"]].append(event)
        self.device_events[event["device"]].append(event)
        self.phone_events[event["phone"]].append(event)
        self.account_counter[event["account"]] += 1
        self.device_counter[event["device"]] += 1
        self.beneficiary_counter[event["beneficiary"]] += 1


class GraphIntelligence:
    """Scores mule-network proximity from account, beneficiary, device and phone links."""

    def __init__(self) -> None:
        self.edges: deque[dict] = deque(maxlen=120)
        self.entity_risk: dict[str, float] = defaultdict(float)
        self.entity_neighbors: dict[str, set[str]] = defaultdict(set)

    def score(self, event: dict) -> float:
        entities = self.entities(event)
        direct = max((self.entity_risk[item] for item in entities), default=0)
        neighbors = set()
        for entity in entities:
            neighbors |= self.entity_neighbors[entity]
        neighbor_risk = max((self.entity_risk[item] for item in neighbors), default=0)
        shared_device = len(self.entity_neighbors[f"device:{event['device']}"])
        shared_phone = len(self.entity_neighbors[f"phone:{event['phone']}"])
        score = direct * 0.55 + neighbor_risk * 0.25 + min(shared_device * 4, 12) + min(shared_phone * 3, 9)
        return clamp(score)

    def update(self, event: dict) -> None:
        account = f"account:{event['account']}"
        beneficiary = f"account:{event['beneficiary']}"
        device = f"device:{event['device']}"
        phone = f"phone:{event['phone']}"
        case = f"case:{event['caseId']}" if event.get("caseId") else None
        entities = [account, beneficiary, device, phone] + ([case] if case else [])

        for left in entities:
            for right in entities:
                if left != right:
                    self.entity_neighbors[left].add(right)

        score = event["score"]
        for entity in entities:
            self.entity_risk[entity] = max(self.entity_risk[entity] * 0.96, score)

        self.edges.appendleft(
            {
                "from": event["account"],
                "to": event["beneficiary"],
                "score": score,
                "device": event["device"],
                "phone": event["phone"],
            }
        )

    @staticmethod
    def entities(event: dict) -> list[str]:
        entities = [
            f"account:{event['account']}",
            f"account:{event['beneficiary']}",
            f"device:{event['device']}",
            f"phone:{event['phone']}",
        ]
        if event.get("caseId"):
            entities.append(f"case:{event['caseId']}")
        return entities


class MuleRiskEngine:
    def __init__(self) -> None:
        self.lock = threading.RLock()
        self.events: list[dict] = []
        self.alerts: list[dict] = []
        self.feedback: list[dict] = []
        self.feedback_risk: dict[str, float] = defaultdict(float)
        self.learning_events: list[dict] = []
        self.learned_patterns = 0
        self.feature_store = FeatureStore()
        self.graph = GraphIntelligence()
        self.model = AdaptiveRiskModel()
        self.account_risk: dict[str, int] = {}
        self.identity_checks: list[dict] = []
        self.total_held = 0
        self.regulatory_hits = 0
        self.latest_decision: dict | None = None
        self.running = True

    def generate_transaction(self, forced: dict | None = None) -> dict:
        forced = forced or {}
        return {
            "id": str(uuid.uuid4()),
            "account": forced.get("account") or f"AC{random.randint(10000, 99999)}",
            "beneficiary": forced.get("beneficiary") or f"AC{random.randint(10000, 99999)}",
            "device": forced.get("device") or f"DEV-{random.randint(10, 99)}{random.choice(['A', 'M', 'X', 'K'])}",
            "phone": forced.get("phone") or random.choice(["+91-98XXXX2310", "+91-91XXXX4208", "+91-77XXXX8142", "+91-86XXXX1186"]),
            "channel": forced.get("channel") or random.choice(CHANNELS),
            "amount": int(forced.get("amount") or random.choice([1800, 4500, 9800, 15000, 27000, 51000, 94000, 185000]) + random.randint(0, 2200)),
            "location": forced.get("location") or random.choice(CITIES),
            "caseId": forced.get("caseId") or (random.choice(CYBER_CASES) if random.random() > 0.88 else None),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": forced.get("source") or "bank-stream",
        }

    def normalize_transaction(self, payload: dict) -> dict:
        if not isinstance(payload, dict):
            raise ValueError("Transaction must be a JSON object")
        for name in ("account", "beneficiary", "device", "phone", "channel", "location", "source", "caseId"):
            if name not in payload or (name == "caseId" and payload[name] is None):
                continue
            if not isinstance(payload[name], str) or not payload[name].strip() or len(payload[name]) > 200:
                raise ValueError(f"{name} must be a non-empty string of at most 200 characters")
        if "amount" in payload:
            if isinstance(payload["amount"], bool):
                raise ValueError("amount must be a positive finite number")
            try:
                amount = float(payload["amount"])
            except (TypeError, ValueError):
                raise ValueError("amount must be a positive finite number") from None
            if not math.isfinite(amount) or amount < 1 or amount > 1e12:
                raise ValueError("amount must be between 1 and 1000000000000")
        context = payload.get("context", {})
        if not isinstance(context, dict):
            raise ValueError("context must be an object of pre-transaction historical observations")
        limits = {"averageAmount": (1, 1e12), "hourlyTxnCount": (0, 1e6),
                  "dailyTxnCount": (0, 1e7), "sharedDeviceAccountCount": (1, 1e6)}
        for name, value in context.items():
            if name == "isNewBeneficiary":
                if not isinstance(value, bool):
                    raise ValueError("context.isNewBeneficiary must be a boolean")
            elif name not in limits:
                raise ValueError(f"Unknown context field: {name}")
            elif isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not limits[name][0] <= value <= limits[name][1]:
                raise ValueError(f"Invalid context.{name}")
        data = self.generate_transaction(payload | ({"amount": amount} if "amount" in payload else {}))
        data["context"] = context
        if "amount" in payload:
            data["amount"] = float(payload["amount"])
        # Preserve an explicitly absent case instead of randomly inventing one.
        if "caseId" in payload:
            data["caseId"] = payload["caseId"]
        data["account"] = str(data["account"]).strip().upper()
        data["beneficiary"] = str(data["beneficiary"]).strip().upper()
        data["device"] = str(data["device"]).strip().upper()
        data["phone"] = str(data["phone"]).strip()
        data["channel"] = str(data["channel"]).strip().upper()
        if data["channel"] not in CHANNELS:
            raise ValueError("Unsupported payment channel")
        return data

    def ingest_transaction(self, payload: dict) -> dict:
        transaction = self.normalize_transaction(payload)
        with self.lock:
            scored = transaction | self.score(transaction)
            self.events.insert(0, scored)
            self.events = self.events[:250]
            self.feature_store.update(scored)
            self.graph.update(scored)
            self.account_risk[scored["account"]] = max(scored["score"], self.account_risk.get(scored["account"], 0))
            if scored.get("caseId"):
                self.regulatory_hits += 1
            if scored["action"] in {"Hold transaction for review", "Debit freeze and case escalation"}:
                self.total_held += scored["amount"]
                self.alerts.insert(0, self.make_alert(scored))
                self.alerts = self.alerts[:80]
            self.latest_decision = scored
            return scored

    def ingest_cyber_alert(self, payload: dict | None = None) -> dict:
        payload = payload or {}
        incident = {
            "account": payload.get("account") or random.choice(tuple(WATCHLISTED_ACCOUNTS)),
            "device": payload.get("device") or random.choice(tuple(WATCHLISTED_DEVICES)),
            "phone": payload.get("phone") or random.choice(tuple(WATCHLISTED_PHONES)),
            "amount": payload.get("amount", 186000),
            "channel": payload.get("channel") or "UPI",
            "caseId": payload.get("caseId") or random.choice(CYBER_CASES),
            "source": "government-cyber-alert",
        }
        scored = self.ingest_transaction(incident)
        self.add_learning_event("Demo cyber alert ingested", "Graph and policy signals updated; trained model weights unchanged", 0)
        return scored

    def score(self, event: dict) -> dict:
        started = time.perf_counter()
        graph_score = self.graph.score(event)
        feedback_boost = self.feedback_boost(event)
        features = self.feature_store.features_for(event, graph_score, feedback_boost)
        model = self.model.predict(features)
        score = int(round(model["ensembleScore"]))
        reasons = self.reason_codes(event, features, model)
        probability = model["supervisedProbability"]
        uncertainty = abs(probability - self.model.threshold)

        if features["has_regulatory_case"] and features["watchlist_hit"] and event["amount"] >= 90000:
            score = max(score, 88)
            reasons.append("Policy floor applied for cyber feed, watchlist and high-value transfer convergence")
        elif features["has_regulatory_case"] and features["watchlist_hit"]:
            score = max(score, 76)
            reasons.append("Policy floor applied for cyber feed and watchlist convergence")
        elif features["watchlist_hit"] and features["graph_score"] >= 55:
            score = max(score, 72)
            reasons.append("Policy floor applied for watchlist entity near risky graph cluster")

        if score >= 82:
            action = "Debit freeze and case escalation"
        elif score >= 66 or probability >= self.model.threshold or model["requiresReview"]:
            action = "Hold transaction for review"
            if uncertainty < 0.08:
                reasons.append("Prediction is near the validation-selected threshold; routed for human review")
        elif score >= 48:
            action = "Step-up authentication"
        else:
            action = "Allow with monitoring"

        return {
            "score": score,
            "action": action,
            "reasons": reasons,
            "features": {key: round(value, 3) if isinstance(value, float) else value for key, value in features.items()},
            "modelBreakdown": model | {
                "modelVersion": self.model.version,
                "datasetSha256": self.model.dataset_hash,
                "inferenceMs": round((time.perf_counter() - started) * 1000, 2),
                "finalPolicyScore": score,
            },
            "executionMode": "demo recommendations; no bank action executed",
        }

    def feedback_boost(self, event: dict) -> float:
        entities = GraphIntelligence.entities(event)
        return clamp(max((self.feedback_risk[entity] for entity in entities), default=0))

    def reason_codes(self, event: dict, features: dict, model: dict) -> list[str]:
        reasons: list[str] = []
        for explanation in model["explanations"][:3]:
            delta = explanation["probabilityDelta"]
            if delta > .01:
                reasons.append(f"ML: {explanation['feature'].replace('_', ' ')} raises model output by {delta * 100:.1f} percentage points versus the safe training median")
        if model["outOfTrainingRange"]:
            reasons.append("Limited training coverage: " + ", ".join(model["outOfTrainingRange"]))
        if model["modelDisagreement"] > .25:
            reasons.append("Random Forest and Logistic Regression disagree; human review requested")
        if features["watchlist_hit"]:
            reasons.append("Entity matched an explicit watchlist policy")
        if features["has_regulatory_case"]:
            reasons.append(f"Transaction linked to regulatory/cyber case {event['caseId']}")
        if model["graphScore"] >= 35:
            reasons.append("Graph model found proximity to risky accounts, devices or cases")
        if model["anomalyScore"] >= 60:
            reasons.append("Isolation Forest found behavior unusual relative to safe training examples")
        if features["unique_accounts_on_device"] >= 3:
            reasons.append("Device fingerprint is shared across multiple accounts")
        if features["account_velocity"] >= 3:
            reasons.append("Account velocity is elevated in the monitoring window")
        if features["is_upi_high_value"]:
            reasons.append("High-value UPI transfer matches pass-through mule typology")
        if model["feedbackBoost"] >= 20:
            reasons.append("Investigator feedback increased risk for linked entities")
        return reasons or ["Low model probability with no significant anomaly, graph or watchlist signal"]

    def make_alert(self, event: dict) -> dict:
        return {
            "id": event["id"],
            "title": "Potential mule account containment" if event["score"] >= 82 else "Suspicious fund-flow hold",
            "account": event["account"],
            "score": event["score"],
            "action": event["action"],
            "caseId": event.get("caseId"),
            "amount": event["amount"],
            "timestamp": event["timestamp"],
            "status": "OPEN",
            "modelBreakdown": event["modelBreakdown"],
        }

    def resolve_alert(self, alert_id: str) -> dict | None:
        with self.lock:
            for alert in self.alerts:
                if alert["id"] == alert_id:
                    alert["status"] = "RESOLVED"
                    return alert
        return None

    def record_feedback(self, payload: dict) -> dict:
        with self.lock:
            event = next((item for item in self.events if item["id"] == payload.get("eventId")), None)
            label = payload.get("label", "reviewed")
            feedback = {
                "id": str(uuid.uuid4()),
                "eventId": payload.get("eventId"),
                "label": label,
                "notes": payload.get("notes", ""),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            self.feedback.insert(0, feedback)
            self.feedback = self.feedback[:200]
            if event and label in {"confirmed_fraud", "confirmed_mule"}:
                for entity in GraphIntelligence.entities(event):
                    self.feedback_risk[entity] = clamp(self.feedback_risk[entity] + 35)
                self.add_learning_event("Investigator confirmed mule pattern", "Linked-entity policy risk increased; ML retraining requires offline evaluation", 0)
            elif event and label == "false_positive":
                for entity in GraphIntelligence.entities(event):
                    self.feedback_risk[entity] = clamp(self.feedback_risk[entity] - 20)
                self.add_learning_event("False positive feedback received", "Linked-entity feedback risk reduced; trained model and threshold unchanged", 0)
            return feedback

    def check_identity_misuse(self, payload: dict) -> dict:
        identifier_type = str(payload.get("identifierType") or "pan").strip().lower()
        identifier = "".join(str(payload.get("identifier") or "").upper().split())
        consent = bool(payload.get("consent"))
        if identifier_type not in {"pan", "phone"}:
            return {"error": "identifierType must be pan or phone", "status": "invalid"}
        if not consent:
            return {"error": "Consumer consent is required before running an identity check", "status": "invalid"}
        if identifier_type == "pan" and (len(identifier) != 10 or not identifier[:5].isalpha() or not identifier[5:9].isdigit() or not identifier[-1].isalpha()):
            return {"error": "Enter a valid 10-character PAN format", "status": "invalid"}
        if identifier_type == "phone":
            identifier = "".join(ch for ch in identifier if ch.isdigit())
            if identifier.startswith("91") and len(identifier) == 12:
                identifier = identifier[2:]
            if len(identifier) != 10:
                return {"error": "Enter a valid 10-digit phone number", "status": "invalid"}

        digest = hashlib.sha256(identifier.encode("utf-8")).hexdigest()
        seed = int(digest[:8], 16)
        risk_score = 24 + seed % 68
        match_count = 0
        if identifier.endswith(("420", "786", "999", "2310")) or risk_score >= 78:
            match_count = 2 if risk_score >= 84 else 1
        status = "clear"
        if match_count and risk_score >= 82:
            status = "urgent"
        elif match_count:
            status = "review"

        account_openings = []
        partner_names = ["Axis Partner Bank", "Bharat Payments Bank", "UPI Wallet KYC", "Micro-credit NBFC"]
        cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad"]
        for index in range(match_count):
            account_openings.append(
                {
                    "institution": partner_names[(seed + index) % len(partner_names)],
                    "account": f"AC{str(seed + index * 7919)[-5:]}",
                    "opened": f"2026-0{(seed + index) % 4 + 1}-{(seed >> (index + 3)) % 21 + 7:02d}",
                    "city": cities[(seed + index) % len(cities)],
                    "risk": min(96, risk_score + index * 5),
                }
            )

        result = {
            "id": str(uuid.uuid4()),
            "dataMode": "synthetic-demo",
            "mlApplied": False,
            "dataNotice": "Simulated identity matches; not connected to bank account records or the transaction ML model.",
            "status": status,
            "identifierType": identifier_type,
            "identifierMask": self.mask_identifier(identifier, identifier_type),
            "riskScore": risk_score if match_count else max(8, risk_score // 3),
            "matches": account_openings,
            "recommendation": self.identity_recommendation(status),
            "reportContacts": self.identity_report_contacts(status),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        with self.lock:
            self.identity_checks.insert(0, result)
            self.identity_checks = self.identity_checks[:40]
            if status in {"review", "urgent"}:
                self.add_learning_event(
                    "Consumer identity misuse signal received",
                    "PAN/phone self-check matched suspicious account-opening records",
                    2,
                )
        return result

    @staticmethod
    def mask_identifier(identifier: str, identifier_type: str) -> str:
        if identifier_type == "phone":
            return f"XXXXXX{identifier[-4:]}"
        return f"{identifier[:3]}XXXX{identifier[-3:]}"

    @staticmethod
    def identity_recommendation(status: str) -> str:
        if status == "urgent":
            return "Potential identity misuse found. Raise a consumer dispute, freeze linked onboarding, and route to bank/cyber support."
        if status == "review":
            return "Possible match found. Ask the consumer to verify ownership before any account or wallet is allowed to transact."
        return "No linked account-opening match in the current partner and fraud-intelligence window."

    @staticmethod
    def identity_report_contacts(status: str) -> list[dict]:
        contacts = [
            {
                "name": "National Cyber Crime Portal",
                "detail": "Report identity misuse at cybercrime.gov.in or call 1930 for cyber fraud assistance.",
            },
            {
                "name": "Your bank or wallet provider",
                "detail": "Ask for KYC dispute review and temporary restrictions on any account you did not open.",
            },
            {
                "name": "Nearest police cyber cell",
                "detail": "Share the masked SelfCheck result, account reference, and any SMS or email evidence.",
            },
        ]
        if status == "clear":
            return contacts[:1]
        return contacts

    def add_learning_event(self, title: str, detail: str, patterns: int) -> None:
        self.learned_patterns += patterns
        self.learning_events.insert(
            0,
            {
                "id": str(uuid.uuid4()),
                "title": title,
                "detail": detail,
                "patternsLearned": patterns,
                "totalPatterns": self.learned_patterns,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )
        self.learning_events = self.learning_events[:20]

    def state(self) -> dict:
        with self.lock:
            open_alerts = [alert for alert in self.alerts if alert["status"] == "OPEN"]
            return {
                "events": self.events[:60],
                "alerts": open_alerts[:30],
                "links": list(self.graph.edges)[:60],
                "latestDecision": self.latest_decision,
                "model": {
                    "version": self.model.version,
                    "trainingSource": self.model.training_source,
                    "trainingSources": self.model.training_sources,
                    "datasetRows": self.model.dataset_rows,
                    "labelDistribution": self.model.label_distribution,
                    "featuresTracked": len(self.feature_store.amounts),
                    "feedbackLabels": len(self.feedback),
                    "graphEntities": len(self.graph.entity_risk),
                    "learnedPatterns": self.learned_patterns,
                    "validation": self.model.metrics,
                    "threshold": self.model.threshold,
                },
                "learningEvents": self.learning_events[:8],
                "identityChecks": self.identity_checks[:8],
                "metrics": {
                    "events": len(self.events),
                    "highRiskAccounts": sum(1 for score in self.account_risk.values() if score >= 66),
                    "fundsHeld": self.total_held,
                    "regulatoryHits": self.regulatory_hits,
                    "openAlerts": len(open_alerts),
                    "feedback": len(self.feedback),
                    "consumerChecks": len(self.identity_checks),
                },
            }

ENGINE = MuleRiskEngine()

"""Reproducible demo ML, with an untouched test set and inspectable evidence."""
from __future__ import annotations

import csv
import hashlib
import math
from collections import Counter
from pathlib import Path

import numpy as np
import sklearn
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score, brier_score_loss, confusion_matrix,
    precision_recall_fscore_support, roc_auc_score,
)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from config import DATASET_PATH


FEATURE_NAMES = (
    "amount", "amount_to_average", "account_velocity", "daily_txn_count",
    "unique_accounts_on_device", "is_new_beneficiary", "is_upi_high_value",
)
LABELS = {"safe": 0, "false_positive": 0, "mule": 1, "fraud": 1}
SEED = 42


def behavior_features(amount, channel, average_amount, hourly_count, daily_count,
                      shared_accounts, new_beneficiary) -> dict:
    """Shared offline/online feature definition; only pre-decision observations."""
    return {
        "amount": float(amount),
        "amount_to_average": float(amount) / max(float(average_amount), 1),
        "account_velocity": float(hourly_count),
        "daily_txn_count": float(daily_count),
        "unique_accounts_on_device": float(shared_accounts),
        "is_new_beneficiary": int(bool(new_beneficiary)),
        "is_upi_high_value": int(channel == "UPI" and float(amount) > 45000),
    }


def record_features(record: dict) -> dict:
    amount = float(record["amount"])
    ratio = float(record["amount_to_avg_ratio"])
    return behavior_features(
        amount, record["channel"].upper(), amount / max(ratio, 0.001),
        float(record["hourly_txn_count"]), float(record["daily_txn_count"]),
        float(record["shared_device_account_count"]), int(record["is_new_beneficiary"]),
    )


def vectorize(features: dict) -> list[float]:
    values = [float(features[name]) for name in FEATURE_NAMES]
    if any(not math.isfinite(value) or value < 0 for value in values):
        raise ValueError("ML features must be finite, non-negative numbers")
    # Fixed transforms, not fitted to validation/test data.
    return [math.log1p(value) if index < 5 else value for index, value in enumerate(values)]


def evaluate(labels, probabilities, threshold: float) -> dict:
    labels = np.asarray(labels)
    probabilities = np.asarray(probabilities)
    predictions = probabilities >= threshold
    tn, fp, fn, tp = confusion_matrix(labels, predictions, labels=[0, 1]).ravel()
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, predictions, average="binary", zero_division=0,
    )
    both_classes = len(set(labels)) == 2
    return {
        "accuracy": round(float(np.mean(predictions == labels)), 4),
        "precision": round(float(precision), 4), "recall": round(float(recall), 4),
        "f1": round(float(f1), 4),
        "rocAuc": round(float(roc_auc_score(labels, probabilities)), 4) if both_classes else None,
        "averagePrecision": round(float(average_precision_score(labels, probabilities)), 4) if both_classes else None,
        "brierScore": round(float(brier_score_loss(labels, probabilities)), 4),
        "falsePositiveRate": round(float(fp / max(tn + fp, 1)), 4),
        "tp": int(tp), "fp": int(fp), "tn": int(tn), "fn": int(fn),
        "samples": len(labels), "threshold": threshold,
    }


class AdaptiveRiskModel:
    """Learned behavior models; graph, policy, and feedback remain explicit rules."""

    def __init__(self, dataset_path: Path = DATASET_PATH) -> None:
        self.version = "behavior-forest-logistic-v5"
        self.feature_names = list(FEATURE_NAMES)
        self.training_source = dataset_path.name
        self.dataset_hash = hashlib.sha256(dataset_path.read_bytes()).hexdigest()
        with dataset_path.open(encoding="utf-8-sig", newline="") as handle:
            records = list(csv.DictReader(handle))
        self.dataset_rows = len(records)
        self.training_sources = {dataset_path.name: len(records)}
        self.label_distribution = dict(Counter(row["label"] for row in records))
        records = sorted((row for row in records if row["label"] in LABELS),
                         key=lambda row: (row["timestamp"], row["transaction_id"]))
        if len(records) < 15:
            raise ValueError("At least 15 labeled records are required for three-way evaluation")
        # Chronological 60/20/20. Purge earlier rows whose sender appears later.
        # Shared counterparties/devices can still cross splits: documented in the card.
        train_end, validation_end = int(len(records) * .6), int(len(records) * .8)
        test = records[validation_end:]
        test_accounts = {row["sender_account"] for row in test}
        validation = [row for row in records[train_end:validation_end]
                      if row["sender_account"] not in test_accounts]
        later_accounts = test_accounts | {row["sender_account"] for row in validation}
        train = [row for row in records[:train_end] if row["sender_account"] not in later_accounts]
        self.splits = {"train": train, "validation": validation, "test": test}
        for name, split in self.splits.items():
            if {LABELS[row["label"]] for row in split} != {0, 1}:
                raise ValueError(f"{name} split must contain safe and positive examples")
        x_train, y_train = self.matrix(train)
        x_validation, y_validation = self.matrix(validation)
        x_test, y_test = self.matrix(test)
        self.logistic = make_pipeline(StandardScaler(), LogisticRegression(
            class_weight="balanced", C=1.0, max_iter=1000, random_state=SEED,
        ))
        self.forest = RandomForestClassifier(
            n_estimators=128, max_depth=4, min_samples_leaf=2,
            class_weight="balanced", random_state=SEED, n_jobs=1,
        )
        self.logistic.fit(x_train, y_train)
        self.forest.fit(x_train, y_train)
        self.normal_reference = np.median(x_train[y_train == 0], axis=0)
        self.training_min = x_train.min(axis=0)
        self.training_max = x_train.max(axis=0)
        self.anomaly = IsolationForest(n_estimators=100, contamination="auto",
                                       random_state=SEED, n_jobs=1)
        self.anomaly.fit(x_train[y_train == 0])
        # Raw Isolation Forest score is independent of validation/test labels.
        validation_probabilities = self.probabilities(x_validation)
        candidates = [round(float(value), 2) for value in np.arange(.20, .81, .01)]
        self.threshold = max(candidates, key=lambda value: (
            evaluate(y_validation, validation_probabilities, value)["f1"], -abs(value - .5),
        ))
        self.metrics = evaluate(y_test, self.probabilities(x_test), self.threshold)
        baseline_validation = self.logistic.predict_proba(x_validation)[:, 1]
        baseline_threshold = max(candidates, key=lambda value: (
            evaluate(y_validation, baseline_validation, value)["f1"], -abs(value - .5),
        ))
        self.metrics.update({
            "evaluationSet": "untouched chronological demo test set",
            "validationSamples": len(validation), "testSamples": len(test),
            "trainingSamples": len(train), "datasetRows": self.dataset_rows,
            "trainingSource": self.training_source, "trainingSources": self.training_sources,
            "baseline": evaluate(y_test, self.logistic.predict_proba(x_test)[:, 1], baseline_threshold),
            "baselineName": "balanced logistic regression",
        })
        self.validation_metrics = evaluate(y_validation, validation_probabilities, self.threshold)

    @staticmethod
    def matrix(records):
        return (np.asarray([vectorize(record_features(row)) for row in records]),
                np.asarray([LABELS[row["label"]] for row in records]))

    def probabilities(self, matrix):
        return .6 * self.forest.predict_proba(matrix)[:, 1] + .4 * self.logistic.predict_proba(matrix)[:, 1]

    def predict(self, features: dict) -> dict:
        vector = np.asarray(vectorize(features))
        # Batch perturbations: compare each feature with the safe training median.
        probes = np.tile(vector, (len(FEATURE_NAMES) + 1, 1))
        for index in range(len(FEATURE_NAMES)):
            probes[index + 1, index] = self.normal_reference[index]
        probabilities = self.probabilities(probes)
        probability = float(probabilities[0])
        contributions = [{
            "feature": name, "value": float(features[name]),
            "probabilityDelta": round(float(probability - probabilities[index + 1]), 4),
        } for index, name in enumerate(FEATURE_NAMES)]
        contributions.sort(key=lambda item: abs(item["probabilityDelta"]), reverse=True)
        anomaly_score = float(np.clip(-self.anomaly.score_samples([vector])[0] * 100, 0, 100))
        rules = min(100, features.get("watchlist_hit", 0) * 32
                    + features.get("has_regulatory_case", 0) * 27
                    + features.get("is_upi_high_value", 0) * 13)
        graph = float(features.get("graph_score", 0))
        feedback = float(features.get("feedback_boost", 0))
        # A documented policy blend, not a trained or calibrated probability.
        score = min(100, probability * 65 + anomaly_score * .10
                    + rules * .10 + graph * .10 + feedback * .05)
        forest_probability = float(self.forest.predict_proba([vector])[0, 1])
        logistic_probability = float(self.logistic.predict_proba([vector])[0, 1])
        out_of_range = [name for index, name in enumerate(FEATURE_NAMES)
                        if vector[index] < self.training_min[index] or vector[index] > self.training_max[index]]
        return {
            "supervisedProbability": round(probability, 4),
            "probabilityCalibrated": False,
            "componentProbabilities": {"randomForest": round(forest_probability, 4),
                                       "logisticRegression": round(logistic_probability, 4)},
            "modelDisagreement": round(abs(forest_probability - logistic_probability), 4),
            "anomalyScore": round(anomaly_score, 1), "anomalyMethod": "Isolation Forest raw score x 100",
            "rulesScore": round(rules, 1), "graphScore": round(graph, 1),
            "feedbackBoost": round(feedback, 1), "ensembleScore": round(score, 1),
            "calibratedThreshold": self.threshold,  # Existing UI/API compatibility.
            "decisionThreshold": self.threshold,
            "thresholdPurpose": "supervised screening; final actions also use policy signals",
            "requiresReview": abs(probability - self.threshold) < .08 or abs(forest_probability - logistic_probability) > .25,
            "explanations": contributions[:4],
            "explanationMethod": "one-feature replacement with safe training median; not causal or additive",
            "outOfTrainingRange": out_of_range,
            "validation": self.metrics,
        }

    def model_card(self) -> dict:
        return {
            "version": self.version, "datasetSha256": self.dataset_hash,
            "seed": SEED, "library": f"scikit-learn {sklearn.__version__}",
            "dataProvenance": "bundled demonstration CSV; independently verified bank labels unavailable",
            "algorithms": {
                "supervised": "60% Random Forest + 40% scaled Logistic Regression",
                "anomaly": "Isolation Forest fitted only on safe training rows",
                "policy": "65% supervised + 10% anomaly + 10% rules + 10% graph + 5% feedback; explicit floors apply",
            },
            "features": self.feature_names,
            "excludedInputs": ["label", "risk_score", "investigator_feedback", "account identifiers",
                               "watchlists", "cyber cases", "graph risk", "feedback risk"],
            "splitStrategy": "chronological 60/20/20, earlier rows purged for later sender accounts; no augmentation",
            "splitCounts": {name: len(rows) for name, rows in self.splits.items()},
            "excludedReviewRows": self.label_distribution.get("review", 0),
            "purgedRows": sum(self.label_distribution.get(name, 0) for name in LABELS)
                          - sum(len(rows) for rows in self.splits.values()),
            "thresholdSelection": "highest validation F1; ties prefer 0.5; test set never tunes threshold",
            "threshold": self.threshold, "validation": self.validation_metrics, "test": self.metrics,
            "featureImportances": dict(zip(FEATURE_NAMES, [round(float(v), 4) for v in self.forest.feature_importances_])),
            "limitations": [
                "Only 40 bundled demo records; scores and test metrics do not establish real-world fraud detection quality.",
                "Probabilities are not calibrated; anomaly scores are not fraud probabilities.",
                "Shared devices and counterparties may cross splits; evaluation is not fully network-disjoint.",
                "CSV historical summaries cannot be independently verified; online history is bounded and cold starts use defaults.",
                "Graph proximity and feedback are policy signals, not a trained graph neural network or online retraining.",
                "Kaggle datasets are excluded: their schemas lack the behavioral features required by this model.",
                "Test metrics evaluate the supervised ensemble, not the final policy blend or identity lookup.",
            ],
        }

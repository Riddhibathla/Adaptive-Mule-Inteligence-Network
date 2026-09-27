"""Run offline evaluation and export a JSON report for the hackathon demo."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from statistics import median
from time import perf_counter

from config import DATASET_PATH
from models.ml_model import AdaptiveRiskModel, record_features


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=DATASET_PATH)
    parser.add_argument("--output", type=Path, default=Path("artifacts/model_report.json"))
    args = parser.parse_args()
    started = perf_counter()
    model = AdaptiveRiskModel(args.dataset)
    training_ms = (perf_counter() - started) * 1000
    report = model.model_card()
    timings = []
    examples = []
    for row in model.splits["test"]:
        features = record_features(row)
        start = perf_counter()
        prediction = model.predict(features)
        timings.append((perf_counter() - start) * 1000)
        examples.append({"exampleId": row["transaction_id"], "label": row["label"],
                         "modelEstimate": prediction["supervisedProbability"],
                         "anomalyScore": prediction["anomalyScore"],
                         "explanations": prediction["explanations"]})
    report["runtime"] = {"trainingMs": round(training_ms, 2),
                         "medianInferenceMs": round(median(timings), 2),
                         "inferenceSamples": len(timings)}
    report["heldOutExamples"] = examples
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps({"report": str(args.output.resolve()), "splits": report["splitCounts"],
                      "test": report["test"], "runtime": report["runtime"]}, indent=2))


if __name__ == "__main__":
    main()

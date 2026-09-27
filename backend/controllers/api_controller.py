from __future__ import annotations

from config import (
    ADAPT_API_BASE_URL,
    ADAPT_API_KEY,
    ADAPT_BASE_URL,
    ADAPT_INSTRUCTION_PATH,
    DATASET_PATH,
    KAGGLE_CREDITCARD_PATH,
    KAGGLE_PAYSIM_PATH,
)
from controllers.adapt_controller import (
    ADAPT_CLIENT,
    build_adapt_instruction_dataset,
    download_adapt_dataset,
    upload_adapt_dataset,
)
from models.risk_model import ENGINE


def health() -> dict:
    return {
        "status": "ok",
        "service": "Adaptive Mule Intelligence Network",
        "model": ENGINE.model.version,
        "adaptConfigured": bool(ADAPT_API_KEY),
    }


def adapt_status() -> dict:
    return {
        "configured": bool(ADAPT_API_KEY),
        "baseUrl": ADAPT_BASE_URL,
        "apiBaseUrl": ADAPT_API_BASE_URL,
        "keyPreview": f"{ADAPT_API_KEY[:4]}...{ADAPT_API_KEY[-4:]}" if ADAPT_API_KEY else None,
        "datasetPath": str(DATASET_PATH),
        "datasetExists": DATASET_PATH.exists(),
        "kaggleCreditcardPath": str(KAGGLE_CREDITCARD_PATH),
        "kaggleCreditcardExists": KAGGLE_CREDITCARD_PATH.exists(),
        "kagglePaysimPath": str(KAGGLE_PAYSIM_PATH),
        "kagglePaysimExists": KAGGLE_PAYSIM_PATH.exists(),
        "instructionDatasetPath": str(ADAPT_INSTRUCTION_PATH),
        "instructionDatasetExists": ADAPT_INSTRUCTION_PATH.exists(),
    }


def model_metadata() -> dict:
    return {
        "version": ENGINE.model.version,
        "trainingSource": ENGINE.model.training_source,
        "trainingSources": ENGINE.model.training_sources,
        "datasetRows": ENGINE.model.dataset_rows,
        "labelDistribution": ENGINE.model.label_distribution,
        "threshold": ENGINE.model.threshold,
        "validation": ENGINE.model.metrics,
        "modelCard": ENGINE.model.model_card(),
    }


def state() -> dict:
    return ENGINE.state()


def ingest_transaction(payload: dict) -> dict:
    return ENGINE.ingest_transaction(payload)


def ingest_cyber_alert(payload: dict) -> dict:
    return ENGINE.ingest_cyber_alert(payload)


def record_feedback(payload: dict) -> dict:
    return ENGINE.record_feedback(payload)


def check_identity(payload: dict) -> tuple[dict, int]:
    result = ENGINE.check_identity_misuse(payload)
    return result, 400 if result.get("status") == "invalid" else 201


def resolve_alert(alert_id: str) -> tuple[dict, int]:
    alert = ENGINE.resolve_alert(alert_id)
    return (alert, 200) if alert else ({"error": "alert not found"}, 404)


def estimate_adapt_run(payload: dict) -> dict:
    return ADAPT_CLIENT.run_dataset(payload["dataset_id"], estimate=True, max_rows=payload.get("max_rows"))


def run_adapt_job(payload: dict) -> dict:
    return ADAPT_CLIENT.run_dataset(payload["dataset_id"], estimate=False, max_rows=payload.get("max_rows"))

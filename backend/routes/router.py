from __future__ import annotations

from urllib.parse import parse_qs, urlparse

from controllers import api_controller as api
from controllers.adapt_controller import (
    ADAPT_CLIENT,
    AdaptApiError,
    build_adapt_instruction_dataset,
    download_adapt_dataset,
    upload_adapt_dataset,
)

NOT_FOUND = object()


def route_get(raw_path: str):
    parsed = urlparse(raw_path)
    path = parsed.path
    query = parse_qs(parsed.query)

    if path == "/api/health":
        return api.health(), 200
    if path == "/api/adapt/status":
        return api.adapt_status(), 200
    if path == "/api/adapt/datasets":
        return safe_adapt_response(lambda: ADAPT_CLIENT.list_datasets())
    if path == "/api/adapt/build-instruction-dataset":
        return safe_adapt_response(build_adapt_instruction_dataset)
    if path == "/api/adapt/dataset-status":
        dataset_id = first(query, "dataset_id")
        if not dataset_id:
            return {"error": "dataset_id is required"}, 400
        return safe_adapt_response(lambda: ADAPT_CLIENT.status(dataset_id))
    if path == "/api/model":
        return api.model_metadata(), 200
    if path == "/api/model/report":
        return api.ENGINE.model.model_card(), 200
    if path == "/api/state":
        return api.state(), 200
    return NOT_FOUND, 404


def route_post(raw_path: str, payload: dict):
    if not isinstance(payload, dict):
        return {"error": "Request body must be a JSON object"}, 400
    path = urlparse(raw_path).path

    if path == "/api/transactions":
        try:
            return api.ingest_transaction(payload), 201
        except ValueError as error:
            return {"error": str(error)}, 400
    if path == "/api/cyber-alerts":
        try:
            return api.ingest_cyber_alert(payload), 201
        except ValueError as error:
            return {"error": str(error)}, 400
    if path == "/api/feedback":
        return api.record_feedback(payload), 201
    if path == "/api/identity-checks":
        return api.check_identity(payload)
    if path == "/api/adapt/upload":
        return safe_adapt_response(upload_adapt_dataset, 201)
    if path == "/api/adapt/estimate":
        validation = require_dataset_id(payload)
        if validation:
            return validation
        return safe_adapt_response(lambda: api.estimate_adapt_run(payload))
    if path == "/api/adapt/run":
        validation = require_dataset_id(payload)
        if validation:
            return validation
        if payload.get("confirm") is not True:
            return {"error": "Set confirm=true to start a paid/credit-consuming Adapt run"}, 400
        return safe_adapt_response(lambda: api.run_adapt_job(payload))
    if path == "/api/adapt/download":
        validation = require_dataset_id(payload)
        if validation:
            return validation
        return safe_adapt_response(lambda: download_adapt_dataset(payload["dataset_id"]))
    if path.startswith("/api/alerts/") and path.endswith("/resolve"):
        return api.resolve_alert(path.split("/")[3])
    return {"error": "not found"}, 404


def first(query: dict[str, list[str]], name: str) -> str | None:
    values = query.get(name)
    return values[0] if values else None


def require_dataset_id(payload: dict):
    if not payload.get("dataset_id"):
        return {"error": "dataset_id is required"}, 400
    return None


def safe_adapt_response(operation, status: int = 200):
    try:
        return operation(), status
    except AdaptApiError as error:
        return {"error": str(error)}, 502
    except Exception as error:
        return {"error": str(error)}, 500

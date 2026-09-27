from __future__ import annotations

import os
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_ROOT.parent
FRONTEND_ROOT = PROJECT_ROOT / "frontend"
DATASET_PATH = PROJECT_ROOT / "data" / "adaptive_mule_training_dataset.csv"
KAGGLE_ROOT = PROJECT_ROOT / "data" / "kaggle"
KAGGLE_CREDITCARD_PATH = KAGGLE_ROOT / "creditcard.csv"
KAGGLE_PAYSIM_PATH = KAGGLE_ROOT / "PS_20174392719_1491204439457_log.csv"
ADAPT_INSTRUCTION_PATH = PROJECT_ROOT / "data" / "adapt_instruction_dataset.csv"
ADAPT_DOWNLOAD_PATH = PROJECT_ROOT / "data" / "adapt_processed_dataset.csv"
ENV_PATH = BACKEND_ROOT / ".env"
HOST = "127.0.0.1"
PORT = 5173
#HOST = os.environ.get("HOST", "0.0.0.0")
#PORT = int(os.environ.get("PORT", 5173))

CHANNELS = ["UPI", "IMPS", "NEFT", "RTGS", "CARD", "WALLET"]
CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Kolkata", "Pune", "Jaipur", "Lucknow"]
CYBER_CASES = ["NCRP-26-11820", "CERT-FIN-4821", "RBI-FEED-9017", "STATE-CYBER-7305"]
WATCHLISTED_DEVICES = {"DEV-71A", "DEV-42X", "DEV-99M"}
WATCHLISTED_PHONES = {"+91-98XXXX2310", "+91-77XXXX8142"}
WATCHLISTED_ACCOUNTS = {"AC88420", "AC44771"}


def load_env_file(path: Path = ENV_PATH) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()
ADAPT_API_KEY = os.environ.get("ADAPT_API_KEY") or os.environ.get("ADAPTION_API_KEY", "")
ADAPT_BASE_URL = os.environ.get("ADAPT_BASE_URL", "https://adaptionlabs.ai")
ADAPT_API_BASE_URL = os.environ.get("ADAPT_API_BASE_URL", "https://api.adaptionlabs.ai/api/v1")

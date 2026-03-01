# app/ml/model_utils.py
from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

import joblib

ARTIFACTS_DIR = Path("app/ml/artifacts")
DEFAULT_MODEL_PATH = ARTIFACTS_DIR / "baseline_model.joblib"


def save_model(model: Any, path: Path = DEFAULT_MODEL_PATH) -> Path:
    """
    Save a trained model (joblib).
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)
    return path


def load_model(path: Path = DEFAULT_MODEL_PATH) -> Optional[Any]:
    """
    Load a trained model (joblib). Returns None if missing.
    """
    if not path.exists():
        return None
    return joblib.load(path)
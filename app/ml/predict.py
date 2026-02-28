from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd

from app.ml.model_utils import load_model


def predict_shortage(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predict shortage risk using the trained baseline model.

    Expected features:
      quantity
      usage_rate_per_day
      days_until_zero
      last_change_days_ago
      pharmacy_id
      medication_id
    """

    model = load_model()

    if model is None:
        return {
            "available": False,
            "message": "Model not trained yet"
        }

    df = pd.DataFrame([features])

    pred = int(model.predict(df)[0])

    proba: List[float] = [None, None]
    if hasattr(model, "predict_proba"):
        p = model.predict_proba(df)[0]
        proba = [float(p[0]), float(p[1])]

    return {
        "available": True,
        "shortage_pred": pred,            # 1 = shortage soon, 0 = safe
        "shortage_proba": proba[1]        # probability of shortage
    }
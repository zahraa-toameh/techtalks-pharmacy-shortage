# app/ml/train_baseline_model.py
from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.ml.model_utils import save_model
from app.models.db_models import Inventory, StockHistory


@dataclass(frozen=True)
class TrainConfig:
    test_size: float = 0.2
    random_state: int = 42

    # Labeling / baseline business rules:
    critical_threshold: int = 5          # qty <= 5 => shortage_soon = 1
    horizon_days: int = 3                # days_until_zero <= 3 => shortage_soon = 1

    # If StockHistory is sparse, usage_rate may be missing -> fallback to qty rule only.
    min_history_points: int = 2

    # Output paths:
    artifacts_dir: str = "app/ml/artifacts"
    model_filename: str = "baseline_model.joblib"
    metrics_filename: str = "baseline_metrics.json"


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def open_db_session() -> Session:
    return SessionLocal()


def load_inventory_df(db: Session) -> pd.DataFrame:
    rows = db.query(Inventory).all()
    data = [
        {
            "inventory_id": r.id,
            "pharmacy_id": r.pharmacy_id,
            "medication_id": r.medication_id,
            "quantity": int(r.quantity),
        }
        for r in rows
    ]
    return pd.DataFrame(data)


def load_stock_history_df(db: Session) -> pd.DataFrame:
    rows = db.query(StockHistory).all()
    data = [
        {
            "pharmacy_id": r.pharmacy_id,
            "medication_id": r.medication_id,
            "old_quantity": int(r.old_quantity),
            "new_quantity": int(r.new_quantity),
            "changed_at": r.changed_at,
            "reason": r.reason,
        }
        for r in rows
    ]
    df = pd.DataFrame(data)
    if not df.empty:
        df["changed_at"] = pd.to_datetime(df["changed_at"], utc=True, errors="coerce")
    return df


def compute_usage_features(
    inv: pd.DataFrame,
    hist: pd.DataFrame,
    *,
    min_history_points: int,
) -> pd.DataFrame:
    """
    Build simple usage_rate per (pharmacy_id, medication_id) from StockHistory.

    usage_rate = total_decrease / total_days
    - decrease is max(0, old - new)
    """
    inv = inv.copy()

    if hist.empty:
        # Ensure columns exist even when history is missing
        inv["usage_rate_per_day"] = np.nan
        inv["last_change_days_ago"] = np.nan
        return inv

    hist = hist.copy()
    hist["decrease"] = (hist["old_quantity"] - hist["new_quantity"]).clip(lower=0)

    grp = hist.groupby(["pharmacy_id", "medication_id"], as_index=False)
    agg = grp.agg(
        history_points=("decrease", "count"),
        total_decrease=("decrease", "sum"),
        first_change=("changed_at", "min"),
        last_change=("changed_at", "max"),
    )

    agg["total_days"] = (
        (agg["last_change"] - agg["first_change"]).dt.total_seconds() / 86400.0
    )
    agg.loc[agg["total_days"] <= 0, "total_days"] = np.nan

    agg["usage_rate_per_day"] = agg["total_decrease"] / agg["total_days"]
    agg.loc[agg["history_points"] < min_history_points, "usage_rate_per_day"] = np.nan

    now = utc_now()
    agg["last_change_days_ago"] = (now - agg["last_change"]).dt.total_seconds() / 86400.0

    out = inv.merge(
        agg[
            [
                "pharmacy_id",
                "medication_id",
                "usage_rate_per_day",
                "last_change_days_ago",
            ]
        ],
        on=["pharmacy_id", "medication_id"],
        how="left",
    )

    return out


def build_training_frame(
    db: Session,
    cfg: TrainConfig,
) -> Tuple[pd.DataFrame, pd.Series]:
    inv = load_inventory_df(db)
    if inv.empty:
        raise RuntimeError("No inventory data found. Cannot train baseline model.")

    hist = load_stock_history_df(db)
    df = compute_usage_features(inv, hist, min_history_points=cfg.min_history_points)

    # --- make numeric (avoid pd.NA / object dtypes) ---
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")

    usage_rate = pd.to_numeric(df.get("usage_rate_per_day"), errors="coerce")
    df["usage_rate_per_day"] = usage_rate

    last_change_days_ago = pd.to_numeric(df.get("last_change_days_ago"), errors="coerce")
    df["last_change_days_ago"] = last_change_days_ago

    # Derived feature: days_until_zero (if usage_rate known)
    df["days_until_zero"] = np.nan
    has_rate = usage_rate.notna() & (usage_rate > 0)
    df.loc[has_rate, "days_until_zero"] = (
        df.loc[has_rate, "quantity"].astype(float) / usage_rate.loc[has_rate].astype(float)
    )

    days_until_zero = pd.to_numeric(df["days_until_zero"], errors="coerce")

    # Baseline label:
    # shortage_soon = 1 if qty <= critical_threshold OR (days_until_zero <= horizon_days)
    shortage = df["quantity"].fillna(np.inf) <= cfg.critical_threshold
    has_days = days_until_zero.notna()
    shortage = shortage | (has_days & (days_until_zero <= cfg.horizon_days))

    y = shortage.astype(int)

    X = df[
        [
            "quantity",
            "usage_rate_per_day",
            "days_until_zero",
            "last_change_days_ago",
            "pharmacy_id",
            "medication_id",
        ]
    ].copy()

    # IMPORTANT: scikit-learn expects np.nan, not pd.NA
    X = X.apply(pd.to_numeric, errors="coerce").replace({pd.NA: np.nan})

    return X, y


def train_and_evaluate(
    X: pd.DataFrame,
    y: pd.Series,
    cfg: TrainConfig,
) -> Tuple[Pipeline, Dict[str, Any]]:
    if y.nunique() < 2:
        raise RuntimeError(
            "Training labels contain only one class. "
            "Need more varied data (both shortage and non-shortage examples)."
        )

    # Stratify only if both classes have at least 2 examples (otherwise sklearn can fail)
    class_counts = y.value_counts()
    can_stratify = (class_counts.min() >= 2)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=cfg.test_size,
        random_state=cfg.random_state,
        stratify=y if can_stratify else None,
    )

    numeric_features = list(X.columns)

    pre = ColumnTransformer(
        transformers=[
            (
                "num",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="median")),
                        ("scaler", StandardScaler()),
                    ]
                ),
                numeric_features,
            )
        ],
        remainder="drop",
    )

    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=cfg.random_state,
    )

    pipe = Pipeline(
        steps=[
            ("pre", pre),
            ("model", model),
        ]
    )

    pipe.fit(X_train, y_train)
    y_pred = pipe.predict(X_test)

    metrics: Dict[str, Any] = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred, zero_division=0)),
        "recall": float(recall_score(y_test, y_pred, zero_division=0)),
        "f1": float(f1_score(y_test, y_pred, zero_division=0)),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "classification_report": classification_report(
            y_test, y_pred, zero_division=0, output_dict=True
        ),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "label_positive_rate_train": float(y_train.mean()),
        "label_positive_rate_test": float(y_test.mean()),
        "stratified_split": bool(can_stratify),
    }

    return pipe, metrics


def save_artifacts(
    pipe: Pipeline,
    metrics: Dict[str, Any],
    cfg: TrainConfig,
) -> Tuple[Path, Path]:
    artifacts_dir = Path(cfg.artifacts_dir)
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    model_path = artifacts_dir / cfg.model_filename
    metrics_path = artifacts_dir / cfg.metrics_filename

    joblib.dump(pipe, model_path)

    payload: Dict[str, Any] = {
        "trained_at_utc": utc_now().isoformat(),
        "config": asdict(cfg),
        "metrics": metrics,
    }
    metrics_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    return model_path, metrics_path


def main() -> None:
    cfg = TrainConfig()

    db = open_db_session()
    try:
        X, y = build_training_frame(db, cfg)
        pipe, metrics = train_and_evaluate(X, y, cfg)
        model_path, metrics_path = save_artifacts(pipe, metrics, cfg)

        print("✅ Baseline model training complete")
        print(f"Model saved to:   {model_path}")
        print(f"Metrics saved to: {metrics_path}")
        print(f"Accuracy: {metrics['accuracy']:.4f} | F1: {metrics['f1']:.4f}")

    finally:
        db.close()
        version_path = save_model(pipe, version="v1")
        print(f"Saved versioned model: {version_path}")


if __name__ == "__main__":
    main()
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Session

if TYPE_CHECKING:
    from app.models.db_models import Inventory


@dataclass(frozen=True)
class ShortageRiskResult:
    pharmacy_id: int
    medication_id: int
    quantity: int
    risk_score: float  # 0.0 (low) -> 1.0 (high)
    reason: str
    calculated_at: datetime


class ShortageService:
    """
    Business logic for shortage risk calculation.

    Baseline implementation is rule-based (thresholds) so the system can work
    before ML is integrated. Later, swap compute_risk() with model inference
    while keeping the same interface.
    """

    def __init__(
        self,
        db: Session,
        *,
        critical_threshold: int = 5,
        low_threshold: int = 15,
    ) -> None:
        self.db = db
        self.critical_threshold = critical_threshold
        self.low_threshold = low_threshold

    def compute_risk(
        self,
        inventory: "Inventory",
    ) -> ShortageRiskResult:
        """
        Compute shortage risk for one inventory record.

        Rules:
        - qty <= 0  -> 1.0  (out of stock)
        - qty <= critical_threshold -> 0.85 (critical low stock)
        - qty <= low_threshold      -> 0.55 (low stock)
        - else -> 0.15 (stock ok)
        """
        qty = int(getattr(inventory, "quantity"))
        now = datetime.utcnow()

        pharmacy_id = int(getattr(inventory, "pharmacy_id"))
        medication_id = int(getattr(inventory, "medication_id"))

        if qty <= 0:
            return ShortageRiskResult(
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                quantity=qty,
                risk_score=1.0,
                reason="out_of_stock",
                calculated_at=now,
            )

        if qty <= self.critical_threshold:
            return ShortageRiskResult(
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                quantity=qty,
                risk_score=0.85,
                reason="critical_low_stock",
                calculated_at=now,
            )

        if qty <= self.low_threshold:
            return ShortageRiskResult(
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                quantity=qty,
                risk_score=0.55,
                reason="low_stock",
                calculated_at=now,
            )

        return ShortageRiskResult(
            pharmacy_id=pharmacy_id,
            medication_id=medication_id,
            quantity=qty,
            risk_score=0.15,
            reason="stock_ok",
            calculated_at=now,
        )

    def get_high_risk_items(
        self,
        min_risk: float = 0.8,
    ) -> List[ShortageRiskResult]:
        """
        Return inventory items whose computed risk_score >= min_risk.
        """
        # Local import to avoid import-time issues before models exist
        from app.models.db_models import Inventory  

        inventory_rows = self.db.query(Inventory).all()
        results = [self.compute_risk(inv) for inv in inventory_rows]

        return [
            result
            for result in results
            if result.risk_score >= min_risk
        ]

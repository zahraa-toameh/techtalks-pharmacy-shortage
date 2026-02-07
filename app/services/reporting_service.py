from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.services.shortage_service import ShortageRiskResult
from app.services.shortage_service import ShortageService


@dataclass(frozen=True)
class ShortageReport:
    generated_at: datetime
    total_items: int
    total_shortages: int
    critical_shortages: int
    low_shortages: int
    by_pharmacy: List[Dict[str, Any]]
    trend: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "generated_at": self.generated_at.isoformat(),
            "total_items": self.total_items,
            "total_shortages": self.total_shortages,
            "critical_shortages": self.critical_shortages,
            "low_shortages": self.low_shortages,
            "by_pharmacy": self.by_pharmacy,
            "trend": self.trend,
        }


class ReportingService:
    """
    Generates reports for pharmacy shortages.
    This service aggregates inventory + shortage risk into JSON-ready output.
    """

    def __init__(self, db: Session) -> None:
        self.db = db
        self.shortage_service = ShortageService(db)

    def generate_shortage_report(self) -> ShortageReport:
        """
        Generate a shortage report for all pharmacies.
        Baseline implementation uses rule-based shortage logic.
        """
        from app.models.db_models import Inventory

        generated_at = datetime.utcnow()

        inventory_rows = self.db.query(Inventory).all()
        total_items = len(inventory_rows)

        risks = [
            self.shortage_service.compute_risk(inv)
            for inv in inventory_rows
        ]

        shortages = [
            r
            for r in risks
            if r.reason in {"out_of_stock", "critical_low_stock", "low_stock"}
        ]

        critical_shortages = [
            r
            for r in shortages
            if r.reason in {"out_of_stock", "critical_low_stock"}
        ]

        low_shortages = [r for r in shortages if r.reason == "low_stock"]

        by_pharmacy_map: Dict[int, List[ShortageRiskResult]] = {}
        for risk in shortages:
            by_pharmacy_map.setdefault(risk.pharmacy_id, []).append(risk)

        by_pharmacy: List[Dict[str, Any]] = []
        for pharmacy_id, items in by_pharmacy_map.items():
            by_pharmacy.append(
                {
                    "pharmacy_id": pharmacy_id,
                    "shortage_count": len(items),
                    "items": [
                        {
                            "medication_id": i.medication_id,
                            "quantity": i.quantity,
                            "risk_score": i.risk_score,
                            "reason": i.reason,
                        }
                        for i in items
                    ],
                }
            )

        trend = {
            "status": "stable",
            "note": (
                "Trend requires historical data; "
                "baseline is rule-based only."
            ),
        }

        return ShortageReport(
            generated_at=generated_at,
            total_items=total_items,
            total_shortages=len(shortages),
            critical_shortages=len(critical_shortages),
            low_shortages=len(low_shortages),
            by_pharmacy=by_pharmacy,
            trend=trend,
        )

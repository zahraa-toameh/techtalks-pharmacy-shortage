"""
Seed Inventory + StockHistory sample data.

Usage (inside container):
  python -m app.database.seed_inventory

Notes:
- This inserts StockHistory rows for ML/testing.
- It ALSO upserts Inventory so the current stock exists (required for training).
"""

from __future__ import annotations

from datetime import datetime, timezone
from random import Random

from app.database.connection import SessionLocal
from app.models.db_models import Inventory, StockHistory


def upsert_inventory(
    db,
    *,
    pharmacy_id: int,
    medication_id: int,
    quantity: int,
) -> None:
    row = (
        db.query(Inventory)
        .filter(
            Inventory.pharmacy_id == pharmacy_id,
            Inventory.medication_id == medication_id,
        )
        .one_or_none()
    )

    if row is None:
        db.add(
            Inventory(
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                quantity=quantity,
            )
        )
    else:
        row.quantity = quantity


def main() -> None:
    db = SessionLocal()
    rng = Random(42)

    try:
        now = datetime.now(timezone.utc)

        # Adjust these ranges to match how many base rows you seeded
        # (pharmacies 1..2, medications 1..3 => 6 pairs)
        pairs = [(p, m) for p in range(1, 3) for m in range(1, 4)]

        history_rows: list[StockHistory] = []

        for pharmacy_id, medication_id in pairs:
            # starting stock
            start = rng.randint(20, 120)

            # usage speed (units/day)
            usage_per_day = rng.choice([1, 2, 3, 5, 10, 15])

            # create TWO history points per pair (so min_history_points=2 works)
            old1 = start
            new1 = max(0, old1 - usage_per_day * 5)

            old2 = new1
            new2 = max(0, old2 - usage_per_day * 5)

            history_rows.extend(
                [
                    StockHistory(
                        pharmacy_id=pharmacy_id,
                        medication_id=medication_id,
                        old_quantity=old1,
                        new_quantity=new1,
                        changed_at=now,
                        reason="SEED_1",
                    ),
                    StockHistory(
                        pharmacy_id=pharmacy_id,
                        medication_id=medication_id,
                        old_quantity=old2,
                        new_quantity=new2,
                        changed_at=now,
                        reason="SEED_2",
                    ),
                ]
            )

            # Inventory reflects latest quantity
            upsert_inventory(
                db,
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                quantity=new2,
            )

        db.add_all(history_rows)
        db.commit()

    finally:
        db.close()

    print("✅ Seeded StockHistory + Inventory (current stock) successfully")


if __name__ == "__main__":
    main()
import pytest

from app.models.db_models import Pharmacy, Medication, StockHistory
from app.database.utils import upsert_inventory_quantity

def test_stock_history_logged_on_inventory_update(db_session):
    pharmacy = Pharmacy(name="Test Pharmacy")
    medication = Medication(name="Test Medication")

    db_session.add_all([pharmacy, medication])
    db_session.commit()

    # Initial insert
    upsert_inventory_quantity(
        db_session,
        pharmacy_id=pharmacy.id,
        medication_id=medication.id,
        new_quantity=10,
        reason="initial stock",
    )

    # Update inventory
    upsert_inventory_quantity(
        db_session,
        pharmacy_id=pharmacy.id,
        medication_id=medication.id,
        new_quantity=5,
        reason="dispensed",
    )

    history = db_session.query(StockHistory).all()

    assert len(history) == 2
    assert history[0].old_quantity == 0
    assert history[0].new_quantity == 10
    assert history[1].old_quantity == 10
    assert history[1].new_quantity == 5

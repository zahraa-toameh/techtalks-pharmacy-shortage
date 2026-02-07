from app.services.shortage_service import ShortageService
from app.models.db_models import Inventory


def test_compute_risk_out_of_stock(db_session):
    inv = Inventory(pharmacy_id=1, medication_id=1, quantity=0)
    db_session.add(inv)
    db_session.commit()

    service = ShortageService(db_session)
    risk = service.compute_risk(inv)

    assert risk.reason == "out_of_stock"
    assert risk.risk_score == 1.0


def test_compute_risk_low_stock(db_session):
    inv = Inventory(pharmacy_id=1, medication_id=1, quantity=10)
    db_session.add(inv)
    db_session.commit()

    service = ShortageService(db_session)
    risk = service.compute_risk(inv)

    assert risk.reason == "low_stock"

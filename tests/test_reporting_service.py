from app.services.reporting_service import ReportingService
from app.models.db_models import Inventory


def test_generate_shortage_report(db_session):
    db_session.add_all(
        [
            Inventory(pharmacy_id=1, medication_id=1, quantity=0),
            Inventory(pharmacy_id=1, medication_id=2, quantity=3),
            Inventory(pharmacy_id=2, medication_id=3, quantity=50),
        ]
    )
    db_session.commit()

    service = ReportingService(db_session)
    report = service.generate_shortage_report()

    assert report.total_items == 3
    assert report.total_shortages == 2
    assert report.critical_shortages >= 1

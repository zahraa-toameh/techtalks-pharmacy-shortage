# this is a fake seeding script to generate some sample stock history data for ML testing
#note: run it once to populate the database with sample data for testing the ML model and API endpoints
# note: first run seed_base_data.py to insert pharmacies and medications, then run this script to insert stock history records
# write in terminal: python -m app.database.seed_inventory


from datetime import datetime, timezone
from app.database.connection import SessionLocal
from app.models.db_models import StockHistory

db = SessionLocal()

samples = [
    StockHistory(
        pharmacy_id=1,
        medication_id=1,
        old_quantity=20,
        new_quantity=5,
        changed_at=datetime.now(timezone.utc)
    ),
    StockHistory(
        pharmacy_id=1,
        medication_id=2,
        old_quantity=40,
        new_quantity=30,
        changed_at=datetime.now(timezone.utc)
    ),
    StockHistory(
        pharmacy_id=2,
        medication_id=1,
        old_quantity=15,
        new_quantity=8,
        changed_at=datetime.now(timezone.utc)
    ),
    StockHistory(
        pharmacy_id=2,
        medication_id=3,
        old_quantity=55,
        new_quantity=50,
        changed_at=datetime.now(timezone.utc)
    )
]

db.add_all(samples)
db.commit()
db.close()

print("✅ Stock history seed data inserted")

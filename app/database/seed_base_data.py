# Run first: python -m app.database.seed_base_data

from app.database.connection import SessionLocal
from app.models.db_models import Pharmacy, Medication

db = SessionLocal()

pharmacies = [
    Pharmacy(id=1, name="Central Pharmacy", address="Beirut"),
    Pharmacy(id=2, name="HealthPlus Pharmacy", address="Tripoli"),
]


medications = [
    Medication(id=1, name="Paracetamol", manufacturer="PharmaCorp"),
    Medication(id=2, name="Amoxicillin", manufacturer="MediPharma"),
    Medication(id=3, name="Ibuprofen", manufacturer="HealthFirst"),
]

db.add_all(pharmacies)
db.add_all(medications)
db.commit()
db.close()

print("✅ Pharmacies & medications inserted")

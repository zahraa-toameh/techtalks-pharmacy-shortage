from sqlalchemy import select, func
from app.database.session import SessionLocal
from app.models.db_models import User, Pharmacy, Medication, Inventory, StockHistory

db = SessionLocal()
print("Users:", db.scalar(select(func.count(User.id))))
print("Pharmacies:", db.scalar(select(func.count(Pharmacy.id))))
print("Medications:", db.scalar(select(func.count(Medication.id))))
print("Inventory:", db.scalar(select(func.count(Inventory.id))))
print("History:", db.scalar(select(func.count(StockHistory.id))))
db.close()
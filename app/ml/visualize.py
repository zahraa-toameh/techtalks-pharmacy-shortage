import matplotlib.pyplot as plt
from app.database import SessionLocal
from app.models import Inventory
import pandas as pd

db = SessionLocal()
records = db.query(Inventory).all()

df = pd.DataFrame([{
    "date": r.date,
    "quantity": r.quantity
} for r in records])

df.groupby("date").sum().plot()
plt.title("Inventory Over Time")
plt.show()

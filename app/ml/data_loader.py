from sqlalchemy.orm import Session
from app.models.db_models import Inventory, StockHistory
import pandas as pd

MIN_ROWS_REQUIRED = 50  # adjust as needed

def load_inventory_dataset(db: Session):
    # Query inventory
    inventory_records = db.query(Inventory).all()
    stock_history_records = db.query(StockHistory).all()

    columns = ["pharmacy_id", "medication_id", "quantity", "old_quantity", "new_quantity", "changed_at"]

    if not inventory_records or len(inventory_records) < MIN_ROWS_REQUIRED:
        print(f"Not enough inventory rows ({len(inventory_records)}), creating dataset from stock history")

        # Use latest stock_history per pharmacy × medication
        data = []
        df_history = pd.DataFrame([{
            "pharmacy_id": r.pharmacy_id,
            "medication_id": r.medication_id,
            "old_quantity": r.old_quantity,
            "new_quantity": r.new_quantity,
            "changed_at": r.changed_at
        } for r in stock_history_records])

        if not df_history.empty:
            latest_df = df_history.sort_values("changed_at").groupby(
                ["pharmacy_id", "medication_id"], as_index=False
            ).last()

            latest_df["quantity"] = latest_df["new_quantity"]
            return latest_df[columns]
        else:
            return pd.DataFrame(columns=columns)

    # Normal inventory + stock history merge
    data = []
    for r in inventory_records:
        # Get latest stock_history for this pharmacy × medication
        history = [h for h in stock_history_records if h.pharmacy_id == r.pharmacy_id and h.medication_id == r.medication_id]
        if history:
            latest = max(history, key=lambda x: x.changed_at)
            old_q = latest.old_quantity
            new_q = latest.new_quantity
        else:
            old_q = r.quantity
            new_q = r.quantity

        data.append({
            "pharmacy_id": r.pharmacy_id,
            "medication_id": r.medication_id,
            "quantity": r.quantity,
            "old_quantity": old_q,
            "new_quantity": new_q,
            "changed_at": latest.changed_at if history else None
        })

    return pd.DataFrame(data, columns=columns)

# run in the terminal: python -m app.ml.train_model
from sklearn.linear_model import LinearRegression
from app.database.connection import SessionLocal
from app.ml.data_loader import load_inventory_dataset
from app.ml.model_utils import save_model
from app.ml.logger import logger

def train_model():
    db = SessionLocal()
    df = load_inventory_dataset(db)

    if df is None:
        logger.warning("Training skipped: Not enough data.")
        return {"status": "skipped", "reason": "not enough data"}

    X = df[["medication_id"]]
    y = df["quantity"]

    model = LinearRegression()
    model.fit(X, y)

    save_model(model)
    logger.info(f"Model trained on {len(df)} rows")

    return {"status": "trained", "rows": len(df)}

if __name__ == "__main__":
    print(train_model())

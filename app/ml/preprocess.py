import pandas as pd

SHORTAGE_THRESHOLD = 10


def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """
    Apply feature engineering.
    Assumes real data only.
    """

    if df.empty:
        return df

    # Fill missing stock history safely
    df["old_quantity"] = df["old_quantity"].fillna(df["quantity"])
    df["new_quantity"] = df["new_quantity"].fillna(df["quantity"])

    # Features
    df["stock_change"] = df["new_quantity"] - df["old_quantity"]
    df["is_low_stock"] = (df["quantity"] < 20).astype(int)

    df["medication_freq"] = (
        df.groupby("medication_id")["medication_id"].transform("count")
    )

    # Target
    df["shortage"] = (df["quantity"] <= SHORTAGE_THRESHOLD).astype(int)

    return df

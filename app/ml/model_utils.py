# Central place for saving/loading models
import joblib
from pathlib import Path

MODEL_PATH = Path("app/ml/model.joblib")

def save_model(model):
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

def load_model():
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)

from app.ml.model_utils import load_model

def predict_shortage(drug_id: int):
    model = load_model()

    if model is None:
        return {
            "available": False,
            "message": "Model not trained yet"
        }

    predicted_quantity = model.predict([[drug_id]])[0]

    return {
        "available": True,
        "predicted_quantity": max(0, int(predicted_quantity))
    }

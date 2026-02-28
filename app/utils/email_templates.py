def shortage_alert_template(pharmacy_name: str, medication_name: str, quantity: int) -> str:
    return f"""
🚨 Shortage Alert

Pharmacy: {pharmacy_name}
Medication: {medication_name}
Current stock: {quantity}

Please restock as soon as possible.
"""
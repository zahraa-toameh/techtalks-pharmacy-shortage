# defined a request model for the API using Pydantic's BaseModel. This model will be used to validate incoming data for shortage predictions.
from pydantic import BaseModel

class ShortageRequest(BaseModel):
    quantity: int
    stock_change: int
    is_low_stock: int
    medication_freq: int
    pharmacy_id: int
    medication_id: int

"""
Pydantic schemas for API request/response validation.

This module contains all the schemas used across the API endpoints.
Currently includes schemas for shortage prediction endpoints.
"""

from pydantic import BaseModel, Field
from typing import List


# ===== SHORTAGE PREDICTION SCHEMAS =====

class ShortageItemSchema(BaseModel):
    """Individual shortage item in a report"""
    medication_id: int
    quantity: int
    risk_score: float = Field(..., ge=0.0, le=1.0)
    reason: str


class PharmacyShortageSchema(BaseModel):
    """Shortage information for a specific pharmacy"""
    pharmacy_id: int
    shortage_count: int
    items: List[ShortageItemSchema]


class TrendSchema(BaseModel):
    """Trend information for shortage reports"""
    status: str
    note: str


class ShortageReportSchema(BaseModel):
    """Complete shortage report across all pharmacies"""
    generated_at: str
    total_items: int
    total_shortages: int
    critical_shortages: int
    low_shortages: int
    by_pharmacy: List[PharmacyShortageSchema]
    trend: TrendSchema


class PharmacyShortageDetailSchema(BaseModel):
    """Detailed shortage report for a specific pharmacy"""
    pharmacy_id: int
    generated_at: str
    total_medications: int
    shortage_count: int
    critical_count: int
    low_count: int
    shortages: List[ShortageItemSchema]


# ===== EXPORT ALL SCHEMAS =====

__all__ = [
    "ShortageItemSchema",
    "PharmacyShortageSchema",
    "TrendSchema",
    "ShortageReportSchema",
    "PharmacyShortageDetailSchema",
]
"""
Shortage Prediction API Endpoints

This module exposes shortage results through the API:
- GET /shortages - Get all shortages across pharmacies
- GET /shortages/{pharmacy_id} - Get shortages for specific pharmacy

Connects to:
- ReportingService (for generating shortage reports)
- ShortageService (for risk calculations)
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.shortage_service import ShortageService
from app.services.reporting_service import ReportingService

router = APIRouter()


# ===== RESPONSE SCHEMAS =====
# These match the structure returned by ReportingService and ShortageService

class ShortageItemSchema(BaseModel):
    """
    Individual shortage item details.
    Matches the structure in ReportingService.by_pharmacy[].items[]
    """
    medication_id: int
    quantity: int
    risk_score: float = Field(..., ge=0.0, le=1.0)
    reason: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "medication_id": 101,
                "quantity": 3,
                "risk_score": 0.85,
                "reason": "critical_low_stock"
            }
        }


class PharmacyShortageSchema(BaseModel):
    """
    Shortage information for a specific pharmacy.
    Matches the structure in ReportingService.by_pharmacy[]
    """
    pharmacy_id: int
    shortage_count: int
    items: List[ShortageItemSchema]
    
    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "shortage_count": 2,
                "items": [
                    {
                        "medication_id": 101,
                        "quantity": 0,
                        "risk_score": 1.0,
                        "reason": "out_of_stock"
                    }
                ]
            }
        }


class TrendSchema(BaseModel):
    """
    Trend information.
    Matches the structure in ReportingService.trend
    """
    status: str
    note: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "stable",
                "note": "Trend requires historical data; baseline is rule-based only."
            }
        }


class ShortageReportSchema(BaseModel):
    """
    Complete shortage report response.
    Matches the output of ReportingService.generate_shortage_report().to_dict()
    """
    generated_at: str
    total_items: int
    total_shortages: int
    critical_shortages: int
    low_shortages: int
    by_pharmacy: List[PharmacyShortageSchema]
    trend: TrendSchema
    
    class Config:
        json_schema_extra = {
            "example": {
                "generated_at": "2026-02-02T12:34:56.789012",
                "total_items": 150,
                "total_shortages": 12,
                "critical_shortages": 5,
                "low_shortages": 7,
                "by_pharmacy": [
                    {
                        "pharmacy_id": 1,
                        "shortage_count": 2,
                        "items": [
                            {
                                "medication_id": 101,
                                "quantity": 0,
                                "risk_score": 1.0,
                                "reason": "out_of_stock"
                            }
                        ]
                    }
                ],
                "trend": {
                    "status": "stable",
                    "note": "Trend requires historical data; baseline is rule-based only."
                }
            }
        }


class PharmacyShortageDetailSchema(BaseModel):
    """
    Detailed shortage information for a specific pharmacy.
    Custom schema that extends the base report with pharmacy-specific details.
    """
    pharmacy_id: int
    generated_at: str
    total_medications: int
    shortage_count: int
    critical_count: int
    low_count: int
    shortages: List[ShortageItemSchema]
    
    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "generated_at": "2026-02-02T12:34:56.789012",
                "total_medications": 50,
                "shortage_count": 3,
                "critical_count": 1,
                "low_count": 2,
                "shortages": [
                    {
                        "medication_id": 101,
                        "quantity": 0,
                        "risk_score": 1.0,
                        "reason": "out_of_stock"
                    }
                ]
            }
        }


# ===== API ENDPOINTS =====

@router.get(
    "/shortages",
    response_model=ShortageReportSchema,
    summary="Get All Shortages",
    description="Get comprehensive shortage report across all pharmacies using ReportingService"
)
async def get_shortages(
    page: int = Query(1, ge=1, description="Page number (starts at 1)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    min_risk_score: Optional[float] = Query(None, ge=0.0, le=1.0),
    db: Session = Depends(get_db)
):
    """
    **GET /shortages**
    
    Generate and return a comprehensive shortage report for all pharmacies.
    
    This endpoint connects to the **ReportingService** which internally uses
    the **ShortageService** to compute risk scores for all inventory items.
    
    **Query Parameters:**
    - `min_risk_score`: Optional filter for minimum risk score
    
    **Response Structure:**
    - `generated_at`: Timestamp when the report was generated (ISO format)
    - `total_items`: Total number of inventory items analyzed
    - `total_shortages`: Total items with shortage risk (critical + low)
    - `critical_shortages`: Items that are out of stock or critically low
    - `low_shortages`: Items with low stock levels
    - `by_pharmacy`: List of pharmacies with their shortage items
    - `trend`: Trend information (baseline: rule-based)
    
    **Shortage Reasons:**
    - `out_of_stock`: Quantity = 0 (risk_score: 1.0)
    - `critical_low_stock`: Quantity ≤ 5 (risk_score: 0.85)
    - `low_stock`: Quantity ≤ 15 (risk_score: 0.55)
    - `stock_ok`: Quantity > 15 (risk_score: 0.15) - not included in default report
    
    **Example Response:**
    ```json
    {
      "generated_at": "2026-02-02T12:34:56.789012",
      "total_items": 150,
      "total_shortages": 12,
      "critical_shortages": 5,
      "low_shortages": 7,
      "by_pharmacy": [
        {
          "pharmacy_id": 1,
          "shortage_count": 2,
          "items": [
            {
              "medication_id": 101,
              "quantity": 0,
              "risk_score": 1.0,
              "reason": "out_of_stock"
            }
          ]
        }
      ],
      "trend": {
        "status": "stable",
        "note": "Trend requires historical data; baseline is rule-based only."
      }
    }
    ```
    """
    try:
        # Create ReportingService instance
        reporting_service = ReportingService(db)
        
        # Generate shortage report using ReportingService
        report = reporting_service.generate_shortage_report()
        
        # Convert dataclass to dict
        response = report.to_dict()
        
        # Apply min_risk_score filter if provided
        if min_risk_score is not None:
            # Filter items within each pharmacy
            for pharmacy in response["by_pharmacy"]:
                pharmacy["items"] = [
                    item for item in pharmacy["items"]
                    if item["risk_score"] >= min_risk_score
                ]
                pharmacy["shortage_count"] = len(pharmacy["items"])
            
            # Remove pharmacies with no items after filtering
            response["by_pharmacy"] = [
                p for p in response["by_pharmacy"]
                if p["shortage_count"] > 0
            ]
            
            # Recalculate summary counts
            all_filtered_items = [
                item
                for pharmacy in response["by_pharmacy"]
                for item in pharmacy["items"]
            ]
            
            response["total_shortages"] = len(all_filtered_items)
            response["critical_shortages"] = sum(
                1 for item in all_filtered_items
                if item["reason"] in {"out_of_stock", "critical_low_stock"}
            )
            response["low_shortages"] = sum(
                1 for item in all_filtered_items
                if item["reason"] == "low_stock"
            )
        
            # ===== ADD PAGINATION HERE =====
        # Paginate by_pharmacy list
        pharmacies = response["by_pharmacy"]
        total_pharmacies = len(pharmacies)

        # Calculate pagination
        offset = (page - 1) * limit
        paginated_pharmacies = pharmacies[offset:offset + limit]

        # Calculate total pages
        total_pages = (total_pharmacies + limit - 1) // limit  # Ceiling division

        # Add pagination metadata
        response["by_pharmacy"] = paginated_pharmacies
        response["pagination"] = {
            "page": page,
            "limit": limit,
            "total_items": total_pharmacies,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1
        }

        return response
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate shortage report: {str(e)}"
        )


@router.get(
    "/shortages/{pharmacy_id}",
    response_model=PharmacyShortageDetailSchema,
    summary="Get Shortages by Pharmacy",
    description="Get detailed shortage report for a specific pharmacy using ShortageService"
)
async def get_shortages_by_pharmacy(
    pharmacy_id: int,
    include_all: bool = Query(
        False,
        description="Include all inventory items, not just shortages"
    ),
    severity: Optional[str] = Query(
        None,
        description="Filter by severity: 'critical', 'low', or 'all'"
    ),
    db: Session = Depends(get_db)
):
    """
    **GET /shortages/{pharmacy_id}**
    
    Get detailed shortage information for a specific pharmacy.
    
    This endpoint connects to the **ShortageService** to compute risk scores
    for all inventory items at the specified pharmacy.
    
    **Path Parameters:**
    - `pharmacy_id`: ID of the pharmacy (must exist in database)
    
    **Query Parameters:**
    - `include_all`: If true, includes all inventory items (not just shortages)
    - `severity`: Filter by severity level:
      - `'critical'`: Only items with risk_score ≥ 0.8
      - `'low'`: Only items with 0.5 ≤ risk_score < 0.8
      - `'all'`: All items with any shortage risk
    
    **Response Structure:**
    - `pharmacy_id`: The pharmacy ID
    - `generated_at`: Timestamp when report was generated
    - `total_medications`: Total inventory items for this pharmacy
    - `shortage_count`: Number of items with shortage risk
    - `critical_count`: Number of critical shortages
    - `low_count`: Number of low stock items
    - `shortages`: List of shortage items with details
    
    **Severity Levels:**
    - `critical`: out_of_stock (1.0) or critical_low_stock (0.85)
    - `low`: low_stock (0.55)
    
    **Example Response:**
    ```json
    {
      "pharmacy_id": 1,
      "generated_at": "2026-02-02T12:34:56.789012",
      "total_medications": 50,
      "shortage_count": 3,
      "critical_count": 1,
      "low_count": 2,
      "shortages": [
        {
          "medication_id": 101,
          "quantity": 0,
          "risk_score": 1.0,
          "reason": "out_of_stock"
        }
      ]
    }
    ```
    """
    from app.models.db_models import Inventory, Pharmacy
    
    try:
        # Verify pharmacy exists
        pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
        if not pharmacy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pharmacy with ID {pharmacy_id} not found"
            )
        
        # Get all inventory items for this pharmacy
        inventory_items = (
            db.query(Inventory)
            .filter(Inventory.pharmacy_id == pharmacy_id)
            .all()
        )
        
        total_medications = len(inventory_items)
        
        # Handle case where pharmacy has no inventory
        if total_medications == 0:
            return PharmacyShortageDetailSchema(
                pharmacy_id=pharmacy_id,
                generated_at=datetime.utcnow().isoformat(),
                total_medications=0,
                shortage_count=0,
                critical_count=0,
                low_count=0,
                shortages=[]
            )
        
        # Create ShortageService instance
        shortage_service = ShortageService(db)
        
        # Compute risk for all items
        all_risks = []
        for item in inventory_items:
            risk_result = shortage_service.compute_risk(item)
            all_risks.append({
                "medication_id": risk_result.medication_id,
                "quantity": risk_result.quantity,
                "risk_score": risk_result.risk_score,
                "reason": risk_result.reason
            })
        
        # Filter based on include_all parameter
        if include_all:
            # Include all items regardless of risk
            filtered_risks = all_risks
        else:
            # Only include items with shortage risk
            filtered_risks = [
                r for r in all_risks
                if r["reason"] in {"out_of_stock", "critical_low_stock", "low_stock"}
            ]
        
        # Apply severity filter if specified
        if severity:
            severity_lower = severity.lower()
            if severity_lower == "critical":
                # Risk score >= 0.8 (out_of_stock or critical_low_stock)
                filtered_risks = [
                    r for r in filtered_risks
                    if r["risk_score"] >= 0.8
                ]
            elif severity_lower == "low":
                # 0.5 <= Risk score < 0.8 (low_stock)
                filtered_risks = [
                    r for r in filtered_risks
                    if 0.5 <= r["risk_score"] < 0.8
                ]
            # 'all' or any other value means no additional filtering
        
        # Calculate counts for different severity levels
        critical_count = sum(
            1 for r in filtered_risks
            if r["reason"] in {"out_of_stock", "critical_low_stock"}
        )
        low_count = sum(
            1 for r in filtered_risks
            if r["reason"] == "low_stock"
        )
        
        return PharmacyShortageDetailSchema(
            pharmacy_id=pharmacy_id,
            generated_at=datetime.utcnow().isoformat(),
            total_medications=total_medications,
            shortage_count=len(filtered_risks),
            critical_count=critical_count,
            low_count=low_count,
            shortages=filtered_risks
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        # Catch any other errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get pharmacy shortages: {str(e)}"
        )
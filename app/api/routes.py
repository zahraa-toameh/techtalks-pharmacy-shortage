from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy.orm import Session


from app.database.session import get_db
from app.services.inventory_service import (
    InventoryService,
    InventoryNotFoundError,
    InventoryValidationError,
)
from app.services.shortage_service import ShortageService

router = APIRouter()

# ===== PYDANTIC SCHEMAS =====

class InventoryCreate(BaseModel):
    """Schema for creating/adding inventory stock"""
    pharmacy_id: int = Field(..., description="ID of the pharmacy", gt=0)
    medication_id: int = Field(..., description="ID of the medication", gt=0)
    quantity: int = Field(..., description="Quantity to add", gt=0)

    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "medication_id": 101,
                "quantity": 50
            }
        }


class InventoryUpdate(BaseModel):
    """Schema for updating inventory stock to a specific quantity"""
    pharmacy_id: int = Field(..., description="ID of the pharmacy", gt=0)
    medication_id: int = Field(..., description="ID of the medication", gt=0)
    new_quantity: int = Field(..., description="New quantity to set", ge=0)

    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "medication_id": 101,
                "new_quantity": 75
            }
        }


class InventoryRemove(BaseModel):
    """Schema for removing inventory stock"""
    pharmacy_id: int = Field(..., description="ID of the pharmacy", gt=0)
    medication_id: int = Field(..., description="ID of the medication", gt=0)
    quantity: int = Field(..., description="Quantity to remove", gt=0)

    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "medication_id": 101,
                "quantity": 10
            }
        }


class InventoryChangeResponse(BaseModel):
    """Response schema for inventory change operations"""
    pharmacy_id: int
    medication_id: int
    previous_quantity: int
    new_quantity: int
    change_amount: int
    changed_at: datetime
    message: str

    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "medication_id": 101,
                "previous_quantity": 50,
                "new_quantity": 100,
                "change_amount": 50,
                "changed_at": "2026-02-02T12:34:56",
                "message": "Stock added successfully"
            }
        }


class InventoryItem(BaseModel):
    """Schema for inventory item details"""
    id: int
    pharmacy_id: int
    medication_id: int
    quantity: int

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "pharmacy_id": 1,
                "medication_id": 101,
                "quantity": 50
            }
        }


class ShortageRiskResponse(BaseModel):
    """Schema for shortage risk assessment"""
    pharmacy_id: int
    medication_id: int
    quantity: int
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_level: str
    reason: str
    calculated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "medication_id": 101,
                "quantity": 3,
                "risk_score": 0.85,
                "risk_level": "CRITICAL",
                "reason": "critical_low_stock",
                "calculated_at": "2026-02-02T12:34:56"
            }
        }


# ===== HELPER FUNCTIONS =====

def get_risk_level(risk_score: float) -> str:
    """Convert risk score to human-readable level"""
    if risk_score >= 0.8:
        return "CRITICAL"
    elif risk_score >= 0.5:
        return "WARNING"
    elif risk_score >= 0.3:
        return "LOW"
    else:
        return "NORMAL"


# ===== INVENTORY ENDPOINTS =====

@router.post(
    "/inventory/add",
    response_model=InventoryChangeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Stock to Inventory",
    description="Add a specified quantity to inventory. Creates inventory record if it doesn't exist."
)
async def add_inventory_stock(
    inventory: InventoryCreate,
    db: Session = Depends(get_db)
):
    """
    Add stock to inventory.
    
    - **pharmacy_id**: ID of the pharmacy (must be > 0)
    - **medication_id**: ID of the medication (must be > 0)
    - **quantity**: Quantity to add (must be > 0)
    
    Returns the previous quantity, new quantity, and change amount.
    """
    try:
        service = InventoryService(db)
        result = service.add_stock(
            pharmacy_id=inventory.pharmacy_id,
            medication_id=inventory.medication_id,
            quantity=inventory.quantity
        )
        
        return InventoryChangeResponse(
            pharmacy_id=result.pharmacy_id,
            medication_id=result.medication_id,
            previous_quantity=result.previous_quantity,
            new_quantity=result.new_quantity,
            change_amount=result.change_amount,
            changed_at=result.changed_at,
            message="Stock added successfully"
        )
    
    except InventoryValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add stock: {str(e)}"
        )


@router.put(
    "/inventory/update",
    response_model=InventoryChangeResponse,
    summary="Update Inventory to Specific Quantity",
    description="Set inventory to a specific quantity (not adding, but replacing)"
)
async def update_inventory_stock(
    inventory: InventoryUpdate,
    db: Session = Depends(get_db)
):
    """
    Update inventory to a specific quantity.
    
    - **pharmacy_id**: ID of the pharmacy
    - **medication_id**: ID of the medication
    - **new_quantity**: New quantity to set (must be >= 0)
    
    This replaces the current quantity with the new value.
    """
    try:
        service = InventoryService(db)
        result = service.update_stock(
            pharmacy_id=inventory.pharmacy_id,
            medication_id=inventory.medication_id,
            new_quantity=inventory.new_quantity
        )
        
        return InventoryChangeResponse(
            pharmacy_id=result.pharmacy_id,
            medication_id=result.medication_id,
            previous_quantity=result.previous_quantity,
            new_quantity=result.new_quantity,
            change_amount=result.change_amount,
            changed_at=result.changed_at,
            message="Stock updated successfully"
        )
    
    except InventoryValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update stock: {str(e)}"
        )


@router.post(
    "/inventory/remove",
    response_model=InventoryChangeResponse,
    summary="Remove Stock from Inventory",
    description="Remove a specified quantity from inventory"
)
async def remove_inventory_stock(
    inventory: InventoryRemove,
    db: Session = Depends(get_db)
):
    """
    Remove stock from inventory.
    
    - **pharmacy_id**: ID of the pharmacy
    - **medication_id**: ID of the medication
    - **quantity**: Quantity to remove (must be > 0)
    
    Will fail if trying to remove more stock than available.
    """
    try:
        service = InventoryService(db)
        result = service.remove_stock(
            pharmacy_id=inventory.pharmacy_id,
            medication_id=inventory.medication_id,
            quantity=inventory.quantity
        )
        
        return InventoryChangeResponse(
            pharmacy_id=result.pharmacy_id,
            medication_id=result.medication_id,
            previous_quantity=result.previous_quantity,
            new_quantity=result.new_quantity,
            change_amount=result.change_amount,
            changed_at=result.changed_at,
            message="Stock removed successfully"
        )
    
    except InventoryNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except InventoryValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove stock: {str(e)}"
        )


@router.get(
    "/inventory",
    response_model=List[InventoryItem],
    summary="Get All Inventory",
    description="Retrieve all inventory records, optionally filtered by pharmacy or low stock"
)
async def get_all_inventory(
    pharmacy_id: Optional[int] = None,
    medication_id: Optional[int] = None,
    low_stock_only: bool = False,
    min_quantity: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get inventory records with optional filters.
    
    - **pharmacy_id**: Filter by pharmacy ID (optional)
    - **medication_id**: Filter by medication ID (optional)
    - **low_stock_only**: Show only items at or below reorder point (optional)
    - **min_quantity**: Filter items with quantity >= this value (optional)
    """
    from app.models.db_models import Inventory
    
    try:
        query = db.query(Inventory)
        
        # Apply filters
        if pharmacy_id:
            query = query.filter(Inventory.pharmacy_id == pharmacy_id)
        
        if medication_id:
            query = query.filter(Inventory.medication_id == medication_id)
        
        if min_quantity is not None:
            query = query.filter(Inventory.quantity >= min_quantity)
        
        results = query.all()
        
        # Apply low stock filter if needed
        if low_stock_only:
            # Use shortage service to identify low stock items
            shortage_service = ShortageService(db, critical_threshold=5, low_threshold=15)
            low_stock_items = []
            for item in results:
                risk = shortage_service.compute_risk(item)
                if risk.risk_score >= 0.5:  # Warning level or higher
                    low_stock_items.append(item)
            results = low_stock_items
        
        return results
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve inventory: {str(e)}"
        )


@router.get(
    "/inventory/{pharmacy_id}/{medication_id}",
    response_model=InventoryItem,
    summary="Get Specific Inventory Item",
    description="Retrieve inventory for a specific pharmacy-medication pair"
)
async def get_inventory_item(
    pharmacy_id: int,
    medication_id: int,
    db: Session = Depends(get_db)
):
    """
    Get inventory for a specific pharmacy and medication.
    
    - **pharmacy_id**: ID of the pharmacy
    - **medication_id**: ID of the medication
    """
    from app.models.db_models import Inventory
    
    try:
        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.pharmacy_id == pharmacy_id,
                Inventory.medication_id == medication_id
            )
            .first()
        )
        
        if not inventory:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No inventory found for pharmacy {pharmacy_id} and medication {medication_id}"
            )
        
        return inventory
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve inventory item: {str(e)}"
        )


# ===== SHORTAGE RISK ENDPOINTS =====

@router.get(
    "/inventory/shortage-risks",
    response_model=List[ShortageRiskResponse],
    summary="Get Shortage Risk Assessment",
    description="Get shortage risk scores for all inventory items or high-risk items only"
)
async def get_shortage_risks(
    high_risk_only: bool = False,
    min_risk_score: float = 0.8,
    pharmacy_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get shortage risk assessment for inventory items.
    
    - **high_risk_only**: If true, only return items with risk >= min_risk_score
    - **min_risk_score**: Minimum risk score threshold (0.0 to 1.0)
    - **pharmacy_id**: Filter by pharmacy ID (optional)
    
    Risk Levels:
    - CRITICAL: risk_score >= 0.8
    - WARNING: risk_score >= 0.5
    - LOW: risk_score >= 0.3
    - NORMAL: risk_score < 0.3
    """
    from app.models.db_models import Inventory
    
    try:
        shortage_service = ShortageService(db)
        
        if high_risk_only:
            # Use the service method for high-risk items
            results = shortage_service.get_high_risk_items(min_risk=min_risk_score)
        else:
            # Calculate risk for all items
            query = db.query(Inventory)
            if pharmacy_id:
                query = query.filter(Inventory.pharmacy_id == pharmacy_id)
            
            inventory_items = query.all()
            results = [shortage_service.compute_risk(item) for item in inventory_items]
        
        # Convert to response schema
        return [
            ShortageRiskResponse(
                pharmacy_id=r.pharmacy_id,
                medication_id=r.medication_id,
                quantity=r.quantity,
                risk_score=r.risk_score,
                risk_level=get_risk_level(r.risk_score),
                reason=r.reason,
                calculated_at=r.calculated_at
            )
            for r in results
        ]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate shortage risks: {str(e)}"
        )


@router.get(
    "/inventory/shortage-risks/{pharmacy_id}/{medication_id}",
    response_model=ShortageRiskResponse,
    summary="Get Shortage Risk for Specific Item",
    description="Get shortage risk assessment for a specific inventory item"
)
async def get_item_shortage_risk(
    pharmacy_id: int,
    medication_id: int,
    db: Session = Depends(get_db)
):
    """
    Get shortage risk for a specific inventory item.
    
    - **pharmacy_id**: ID of the pharmacy
    - **medication_id**: ID of the medication
    """
    from app.models.db_models import Inventory
    
    try:
        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.pharmacy_id == pharmacy_id,
                Inventory.medication_id == medication_id
            )
            .first()
        )
        
        if not inventory:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No inventory found for pharmacy {pharmacy_id} and medication {medication_id}"
            )
        
        shortage_service = ShortageService(db)
        result = shortage_service.compute_risk(inventory)
        
        return ShortageRiskResponse(
            pharmacy_id=result.pharmacy_id,
            medication_id=result.medication_id,
            quantity=result.quantity,
            risk_score=result.risk_score,
            risk_level=get_risk_level(result.risk_score),
            reason=result.reason,
            calculated_at=result.calculated_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate shortage risk: {str(e)}"
        )
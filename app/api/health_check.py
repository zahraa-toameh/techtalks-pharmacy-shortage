from fastapi import APIRouter, status, Depends
from datetime import datetime
from typing import Dict
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.session import get_db

router = APIRouter()


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Check if the API is running and healthy"
)
async def health_check() -> Dict[str, str]:
    """
    Simple health check endpoint to verify API is operational.
    
    Returns:
        dict: Status, timestamp, and service name
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Pharmacy Shortage Prediction API",
        "version": "1.0.0"
    }


@router.get(
    "/status",
    status_code=status.HTTP_200_OK,
    summary="Detailed Status",
    description="Get detailed API status information including database connectivity"
)
async def detailed_status(db: Session = Depends(get_db)) -> Dict:
    """
    Detailed status endpoint with database and service checks.
    
    Returns:
        dict: Detailed status information
    """
    # Check database connectivity
    db_status = "disconnected"
    db_error = None
    
    try:
        # Execute simple query to verify database connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_error = str(e)
    
    # Check if tables exist
    tables_exist = False
    try:
        from app.models.db_models import Inventory
        # Try to count inventory records
        inventory_count = db.query(Inventory).count()
        tables_exist = True
    except Exception as e:
        inventory_count = 0
        db_error = f"Tables not initialized: {str(e)}"
    
    response = {
        "api": "running",
        "database": {
            "status": db_status,
            "tables_initialized": tables_exist,
        },
        "services": {
            "inventory_service": "available",
            "shortage_service": "available"
        },
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
    
    # Add database error if any
    if db_error:
        response["database"]["error"] = db_error
    
    # Add statistics if database is working
    if db_status == "connected" and tables_exist:
        try:
            from app.models.db_models import Pharmacy, Medication
            response["statistics"] = {
                "total_inventory_items": inventory_count,
                "total_pharmacies": db.query(Pharmacy).count(),
                "total_medications": db.query(Medication).count()
            }
        except Exception:
            pass
    
    return response


@router.get(
    "/ping",
    status_code=status.HTTP_200_OK,
    summary="Ping",
    description="Simple ping endpoint for load balancers"
)
async def ping() -> Dict[str, str]:
    """
    Minimal ping endpoint for monitoring tools and load balancers.
    
    Returns:
        dict: Simple pong response
    """
    return {"ping": "pong"}
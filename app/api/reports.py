"""
Reports API Endpoints

This module provides aggregated reporting and trend analysis:
- GET /reports/summary - Quick overview with key metrics
- GET /reports/trends - Historical trend analysis

Includes pagination support for large datasets.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database.session import get_db
from app.services.reporting_service import ReportingService
from app.services.shortage_service import ShortageService

router = APIRouter()


# ===== PAGINATION SCHEMAS =====

class PaginationParams(BaseModel):
    """Standard pagination parameters"""
    page: int = Field(1, ge=1, description="Page number (starts at 1)")
    page_size: int = Field(20, ge=1, le=100, description="Items per page (max 100)")


class PaginationMeta(BaseModel):
    """Pagination metadata"""
    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_previous: bool


# ===== REPORT SUMMARY SCHEMAS =====

class PharmacySummary(BaseModel):
    """Summary statistics for a single pharmacy"""
    pharmacy_id: int
    pharmacy_name: Optional[str] = None
    total_medications: int
    total_shortages: int
    critical_shortages: int
    low_shortages: int
    average_risk_score: float
    
    class Config:
        json_schema_extra = {
            "example": {
                "pharmacy_id": 1,
                "pharmacy_name": "Central Pharmacy",
                "total_medications": 150,
                "total_shortages": 12,
                "critical_shortages": 5,
                "low_shortages": 7,
                "average_risk_score": 0.35
            }
        }


class TopShortageItem(BaseModel):
    """Top shortage item details"""
    medication_id: int
    medication_name: Optional[str] = None
    pharmacy_id: int
    quantity: int
    risk_score: float
    reason: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "medication_id": 101,
                "medication_name": "Aspirin 100mg",
                "pharmacy_id": 1,
                "quantity": 0,
                "risk_score": 1.0,
                "reason": "out_of_stock"
            }
        }


class ReportSummaryResponse(BaseModel):
    """Complete summary report response"""
    generated_at: str
    overview: Dict[str, Any]
    by_pharmacy: List[PharmacySummary]
    top_shortages: List[TopShortageItem]
    pagination: Optional[PaginationMeta] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "generated_at": "2026-02-02T12:34:56.789012",
                "overview": {
                    "total_pharmacies": 5,
                    "total_medications": 750,
                    "total_shortages": 45,
                    "critical_count": 18,
                    "low_count": 27,
                    "overall_risk_percentage": 6.0
                },
                "by_pharmacy": [],
                "top_shortages": []
            }
        }


# ===== TREND SCHEMAS =====

class TrendDataPoint(BaseModel):
    """Single data point in a trend"""
    date: str
    total_items: int
    shortage_count: int
    critical_count: int
    low_count: int
    average_risk_score: float
    
    class Config:
        json_schema_extra = {
            "example": {
                "date": "2026-02-02",
                "total_items": 150,
                "shortage_count": 12,
                "critical_count": 5,
                "low_count": 7,
                "average_risk_score": 0.35
            }
        }


class TrendComparison(BaseModel):
    """Comparison between time periods"""
    metric: str
    current_value: float
    previous_value: float
    change_percentage: float
    trend_direction: str  # "up", "down", "stable"


class TrendAnalysis(BaseModel):
    """Analysis of trends"""
    period: str
    summary: str
    concerns: List[str]
    improvements: List[str]


class ReportTrendsResponse(BaseModel):
    """Trend analysis response"""
    generated_at: str
    period_start: str
    period_end: str
    period_days: int
    data_points: List[TrendDataPoint]
    comparisons: List[TrendComparison]
    analysis: TrendAnalysis
    pagination: Optional[PaginationMeta] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "generated_at": "2026-02-02T12:34:56.789012",
                "period_start": "2026-01-26",
                "period_end": "2026-02-02",
                "period_days": 7,
                "data_points": [],
                "comparisons": [],
                "analysis": {
                    "period": "last_7_days",
                    "summary": "Shortage levels have remained stable",
                    "concerns": ["3 pharmacies show increasing critical shortages"],
                    "improvements": ["Overall inventory levels improved by 5%"]
                }
            }
        }


# ===== HELPER FUNCTIONS =====

def calculate_pagination_meta(
    page: int,
    page_size: int,
    total_items: int
) -> PaginationMeta:
    """Calculate pagination metadata"""
    total_pages = (total_items + page_size - 1) // page_size  # Ceiling division
    
    return PaginationMeta(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_previous=page > 1
    )


def paginate_list(
    items: List[Any],
    page: int,
    page_size: int
) -> tuple[List[Any], PaginationMeta]:
    """Paginate a list and return items + metadata"""
    total_items = len(items)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    paginated_items = items[start_idx:end_idx]
    meta = calculate_pagination_meta(page, page_size, total_items)
    
    return paginated_items, meta


def get_trend_direction(current: float, previous: float) -> str:
    """Determine trend direction"""
    if abs(current - previous) < 0.01:  # Less than 1% change
        return "stable"
    return "up" if current > previous else "down"


def calculate_change_percentage(current: float, previous: float) -> float:
    """Calculate percentage change"""
    if previous == 0:
        return 0.0 if current == 0 else 100.0
    return round(((current - previous) / previous) * 100, 2)


# ===== REPORT SUMMARY ENDPOINT =====

@router.get(
    "/reports/summary",
    response_model=ReportSummaryResponse,
    summary="Get Reports Summary",
    description="Get aggregated summary report with key metrics and top shortages"
)
async def get_reports_summary(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    pharmacy_id: Optional[int] = Query(None, description="Filter by pharmacy ID"),
    include_pharmacy_names: bool = Query(False, description="Include pharmacy names (slower)"),
    top_n: int = Query(10, ge=1, le=50, description="Number of top shortage items to return"),
    db: Session = Depends(get_db)
):
    """
    **GET /reports/summary**
    
    Get a comprehensive summary report with:
    - Overall statistics across all pharmacies
    - Breakdown by pharmacy (paginated)
    - Top shortage items
    
    **Query Parameters:**
    - `page`: Page number for pharmacy breakdown (default: 1)
    - `page_size`: Items per page (default: 20, max: 100)
    - `pharmacy_id`: Filter by specific pharmacy (optional)
    - `include_pharmacy_names`: Include pharmacy names in response (optional)
    - `top_n`: Number of top shortage items (default: 10, max: 50)
    
    **Response Overview Section:**
    - `total_pharmacies`: Total number of pharmacies
    - `total_medications`: Total inventory items
    - `total_shortages`: Total items with shortage risk
    - `critical_count`: Items out of stock or critically low
    - `low_count`: Items with low stock
    - `overall_risk_percentage`: Percentage of items at risk
    
    **Pharmacy Breakdown:**
    - Paginated list of pharmacies with their statistics
    - Each pharmacy shows: total medications, shortages, risk score
    
    **Top Shortages:**
    - List of most critical shortage items
    - Sorted by risk score (highest first)
    
    **Example Request:**
    ```
    GET /api/v1/reports/summary?page=1&page_size=10&top_n=5
    ```
    """
    from app.models.db_models import Inventory, Pharmacy, Medication
    
    try:
        generated_at = datetime.utcnow()
        
        # Create services
        shortage_service = ShortageService(db)
        
        # Base query
        query = db.query(Inventory)
        if pharmacy_id:
            query = query.filter(Inventory.pharmacy_id == pharmacy_id)
        
        all_inventory = query.all()
        
        if not all_inventory:
            return ReportSummaryResponse(
                generated_at=generated_at.isoformat(),
                overview={
                    "total_pharmacies": 0,
                    "total_medications": 0,
                    "total_shortages": 0,
                    "critical_count": 0,
                    "low_count": 0,
                    "overall_risk_percentage": 0.0
                },
                by_pharmacy=[],
                top_shortages=[],
                pagination=None
            )
        
        # Calculate risks for all items
        all_risks = [shortage_service.compute_risk(item) for item in all_inventory]
        
        # Overall statistics
        total_items = len(all_risks)
        shortages = [r for r in all_risks if r.reason in {"out_of_stock", "critical_low_stock", "low_stock"}]
        critical_shortages = [r for r in shortages if r.reason in {"out_of_stock", "critical_low_stock"}]
        low_shortages = [r for r in shortages if r.reason == "low_stock"]
        
        # Get unique pharmacies
        pharmacy_ids = list(set(r.pharmacy_id for r in all_risks))
        total_pharmacies = len(pharmacy_ids)
        
        # Build pharmacy summaries
        pharmacy_summaries = []
        for pid in pharmacy_ids:
            pharmacy_risks = [r for r in all_risks if r.pharmacy_id == pid]
            pharmacy_shortages = [r for r in pharmacy_risks if r.reason in {"out_of_stock", "critical_low_stock", "low_stock"}]
            pharmacy_critical = [r for r in pharmacy_shortages if r.reason in {"out_of_stock", "critical_low_stock"}]
            pharmacy_low = [r for r in pharmacy_shortages if r.reason == "low_stock"]
            
            avg_risk = sum(r.risk_score for r in pharmacy_risks) / len(pharmacy_risks) if pharmacy_risks else 0.0
            
            pharmacy_name = None
            if include_pharmacy_names:
                pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pid).first()
                pharmacy_name = pharmacy.name if pharmacy else None
            
            pharmacy_summaries.append(PharmacySummary(
                pharmacy_id=pid,
                pharmacy_name=pharmacy_name,
                total_medications=len(pharmacy_risks),
                total_shortages=len(pharmacy_shortages),
                critical_shortages=len(pharmacy_critical),
                low_shortages=len(pharmacy_low),
                average_risk_score=round(avg_risk, 3)
            ))
        
        # Sort by critical shortages (most critical first)
        pharmacy_summaries.sort(key=lambda x: x.critical_shortages, reverse=True)
        
        # Paginate pharmacy summaries
        paginated_pharmacies, pagination_meta = paginate_list(
            pharmacy_summaries,
            page,
            page_size
        )
        
        # Get top shortage items
        shortage_risks = sorted(shortages, key=lambda x: x.risk_score, reverse=True)[:top_n]
        
        top_shortages = []
        for risk in shortage_risks:
            med_name = None
            if include_pharmacy_names:  # Reuse the flag for medication names too
                medication = db.query(Medication).filter(Medication.id == risk.medication_id).first()
                med_name = medication.name if medication else None
            
            top_shortages.append(TopShortageItem(
                medication_id=risk.medication_id,
                medication_name=med_name,
                pharmacy_id=risk.pharmacy_id,
                quantity=risk.quantity,
                risk_score=risk.risk_score,
                reason=risk.reason
            ))
        
        # Calculate overall risk percentage
        risk_percentage = round((len(shortages) / total_items) * 100, 2) if total_items > 0 else 0.0
        
        return ReportSummaryResponse(
            generated_at=generated_at.isoformat(),
            overview={
                "total_pharmacies": total_pharmacies,
                "total_medications": total_items,
                "total_shortages": len(shortages),
                "critical_count": len(critical_shortages),
                "low_count": len(low_shortages),
                "overall_risk_percentage": risk_percentage
            },
            by_pharmacy=paginated_pharmacies,
            top_shortages=top_shortages,
            pagination=pagination_meta
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate summary report: {str(e)}"
        )


# ===== TREND ANALYSIS ENDPOINT =====

@router.get(
    "/reports/trends",
    response_model=ReportTrendsResponse,
    summary="Get Trend Analysis",
    description="Get historical trend analysis of shortage patterns over time"
)
async def get_reports_trends(
    days: int = Query(7, ge=1, le=90, description="Number of days to analyze"),
    page: int = Query(1, ge=1, description="Page number for data points"),
    page_size: int = Query(30, ge=1, le=100, description="Data points per page"),
    db: Session = Depends(get_db)
):
    """
    **GET /reports/trends**
    
    Analyze shortage trends over a specified time period.
    
    **Note:** This is a baseline implementation using current inventory snapshots.
    For true historical trends, StockHistory table data would be used.
    
    **Query Parameters:**
    - `days`: Number of days to analyze (default: 7, max: 90)
    - `page`: Page number for data points (default: 1)
    - `page_size`: Data points per page (default: 30, max: 100)
    
    **Response Includes:**
    - `data_points`: Daily snapshots of shortage metrics
    - `comparisons`: Period-over-period comparisons
    - `analysis`: Summary and insights
    
    **Data Points Include:**
    - Date
    - Total inventory items
    - Shortage count
    - Critical count
    - Low stock count
    - Average risk score
    
    **Comparisons Show:**
    - Change in total shortages
    - Change in critical shortages
    - Change in average risk score
    - Trend direction (up, down, stable)
    
    **Example Request:**
    ```
    GET /api/v1/reports/trends?days=7&page=1&page_size=10
    ```
    """
    from app.models.db_models import Inventory, StockHistory
    
    try:
        generated_at = datetime.utcnow()
        period_end = generated_at.date()
        period_start = period_end - timedelta(days=days)
        
        # Create shortage service
        shortage_service = ShortageService(db)
        
        # Check if StockHistory has data
        has_history = db.query(StockHistory).first() is not None
        
        if has_history:
            # Use StockHistory for true historical trends
            data_points = []
            
            # Group stock history by date
            for day_offset in range(days):
                target_date = period_start + timedelta(days=day_offset)
                
                # Get latest stock levels for this date
                # This is a simplified version - in production you'd aggregate properly
                current_inventory = db.query(Inventory).all()
                
                if current_inventory:
                    risks = [shortage_service.compute_risk(item) for item in current_inventory]
                    
                    shortages = [r for r in risks if r.reason in {"out_of_stock", "critical_low_stock", "low_stock"}]
                    critical = [r for r in shortages if r.reason in {"out_of_stock", "critical_low_stock"}]
                    low = [r for r in shortages if r.reason == "low_stock"]
                    
                    avg_risk = sum(r.risk_score for r in risks) / len(risks) if risks else 0.0
                    
                    data_points.append(TrendDataPoint(
                        date=target_date.isoformat(),
                        total_items=len(risks),
                        shortage_count=len(shortages),
                        critical_count=len(critical),
                        low_count=len(low),
                        average_risk_score=round(avg_risk, 3)
                    ))
        else:
            # Baseline: Generate synthetic trend based on current state
            # In production, this would use actual historical data
            current_inventory = db.query(Inventory).all()
            
            if not current_inventory:
                return ReportTrendsResponse(
                    generated_at=generated_at.isoformat(),
                    period_start=period_start.isoformat(),
                    period_end=period_end.isoformat(),
                    period_days=days,
                    data_points=[],
                    comparisons=[],
                    analysis=TrendAnalysis(
                        period="baseline",
                        summary="No inventory data available for trend analysis",
                        concerns=[],
                        improvements=[]
                    ),
                    pagination=None
                )
            
            # Create current snapshot
            risks = [shortage_service.compute_risk(item) for item in current_inventory]
            shortages = [r for r in risks if r.reason in {"out_of_stock", "critical_low_stock", "low_stock"}]
            critical = [r for r in shortages if r.reason in {"out_of_stock", "critical_low_stock"}]
            low = [r for r in shortages if r.reason == "low_stock"]
            avg_risk = sum(r.risk_score for r in risks) / len(risks) if risks else 0.0
            
            # Create a single data point (current state)
            # Note: This is baseline - real implementation would have multiple points
            data_points = [
                TrendDataPoint(
                    date=period_end.isoformat(),
                    total_items=len(risks),
                    shortage_count=len(shortages),
                    critical_count=len(critical),
                    low_count=len(low),
                    average_risk_score=round(avg_risk, 3)
                )
            ]
        
        # Paginate data points
        paginated_points, pagination_meta = paginate_list(
            data_points,
            page,
            page_size
        )
        
        # Calculate comparisons (current vs previous period)
        comparisons = []
        if len(data_points) >= 2:
            # Compare most recent with earliest
            current = data_points[-1]
            previous = data_points[0]
            
            comparisons = [
                TrendComparison(
                    metric="Total Shortages",
                    current_value=float(current.shortage_count),
                    previous_value=float(previous.shortage_count),
                    change_percentage=calculate_change_percentage(
                        float(current.shortage_count),
                        float(previous.shortage_count)
                    ),
                    trend_direction=get_trend_direction(
                        float(current.shortage_count),
                        float(previous.shortage_count)
                    )
                ),
                TrendComparison(
                    metric="Critical Shortages",
                    current_value=float(current.critical_count),
                    previous_value=float(previous.critical_count),
                    change_percentage=calculate_change_percentage(
                        float(current.critical_count),
                        float(previous.critical_count)
                    ),
                    trend_direction=get_trend_direction(
                        float(current.critical_count),
                        float(previous.critical_count)
                    )
                ),
                TrendComparison(
                    metric="Average Risk Score",
                    current_value=current.average_risk_score,
                    previous_value=previous.average_risk_score,
                    change_percentage=calculate_change_percentage(
                        current.average_risk_score,
                        previous.average_risk_score
                    ),
                    trend_direction=get_trend_direction(
                        current.average_risk_score,
                        previous.average_risk_score
                    )
                )
            ]
        
        # Generate analysis
        concerns = []
        improvements = []
        
        for comp in comparisons:
            if comp.trend_direction == "up" and "Shortages" in comp.metric:
                concerns.append(f"{comp.metric} increased by {comp.change_percentage}%")
            elif comp.trend_direction == "down" and "Shortages" in comp.metric:
                improvements.append(f"{comp.metric} decreased by {abs(comp.change_percentage)}%")
        
        if not concerns and not improvements:
            summary = f"Shortage levels have remained stable over the last {days} days"
        elif len(concerns) > len(improvements):
            summary = f"Shortage situation is deteriorating - {len(concerns)} areas of concern identified"
        else:
            summary = f"Shortage situation is improving - {len(improvements)} positive trends observed"
        
        if not has_history:
            concerns.append("Note: Historical data not available. Using baseline snapshot.")
        
        analysis = TrendAnalysis(
            period=f"last_{days}_days",
            summary=summary,
            concerns=concerns if concerns else ["No major concerns identified"],
            improvements=improvements if improvements else ["Monitor for future improvements"]
        )
        
        return ReportTrendsResponse(
            generated_at=generated_at.isoformat(),
            period_start=period_start.isoformat(),
            period_end=period_end.isoformat(),
            period_days=days,
            data_points=paginated_points,
            comparisons=comparisons,
            analysis=analysis,
            pagination=pagination_meta
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate trend analysis: {str(e)}"
        )
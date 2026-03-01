from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api import health_check, routes, predictions, reports
from app.database.connection import engine
from app.models.db_models import Base

from fastapi import HTTPException
from app.api.schemas import ShortageRequest  # import schema

from pydantic import BaseModel
from app.ml.predict import predict_shortage
from xml.parsers.expat import model
from app.ml.train_model import train_model


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    Replaces deprecated @app.on_event decorators.
    """
    # Startup
    logger.info("Starting Pharmacy Shortage Prediction API...")
    
    try:
        # Create database tables if they don't exist
        logger.info("Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        # Don't prevent startup, as tables might already exist
    
    # Log service availability
    logger.info("Inventory Service: Ready")
    logger.info("Shortage Service: Ready")
    
    logger.info("API startup complete!")
    logger.info("API Documentation: http://localhost:8000/docs")
    logger.info("Alternative Docs: http://localhost:8000/redoc")
    
    yield  # Application runs here
    
    # Shutdown
    logger.info("Shutting down Pharmacy Shortage Prediction API...")
    logger.info("Cleanup complete")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Pharmacy Shortage Prediction API",
    description="""
    API for predicting and managing pharmacy inventory shortages.
    
    ## Features
    
    * **Inventory Management**: Add, update, remove, and query inventory
    * **Shortage Risk Assessment**: Real-time risk calculation for stockouts
    * **Shortage Predictions**: Comprehensive shortage reports across pharmacies
    * **Reports & Analytics**: Summary reports and trend analysis with pagination
    * **Stock History**: Automatic tracking of all inventory changes
    * **Flexible Filtering**: Query by pharmacy, medication, risk level, etc.
    
    ## Endpoints
    
    * `/api/v1/health` - Health check and system status
    * `/api/v1/inventory/*` - Inventory management operations
    * `/api/v1/shortages/*` - Shortage predictions and reports
    * `/api/v1/reports/*` - Summary reports and trend analysis
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Include routers
app.include_router(
    health_check.router,
    prefix="/api/v1",
    tags=["Health"]
)
app.include_router(
    routes.router,
    prefix="/api/v1",
    tags=["Inventory & Shortage Assessment"]
)
app.include_router(
    predictions.router,
    prefix="/api/v1",
    tags=["Shortage Predictions"]
)
app.include_router(
    reports.router,
    prefix="/api/v1",
    tags=["Reports & Analytics"]
)


@app.get("/", include_in_schema=False)
async def root():
    """Root endpoint - redirects to documentation"""
    return {
        "message": "Pharmacy Shortage Prediction API",
        "version": "1.0.0",
        "documentation": "/docs",
        "health_check": "/api/v1/health",
        "status": "/api/v1/status"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


@app.post("/api/v1/inventory/shortage-risk")
async def shortage_risk(request: ShortageRequest):
    """
    Calculate the shortage risk probability for a given inventory item.
    """
    try:
        features = request.dict()
        probability = predict_shortage(features)
        # If model not loaded, inform user
        if probability == 0.0 and model is None:
            raise HTTPException(
                status_code=503,
                detail="ML model not loaded yet. Train the model first."
            )
        return {"shortage_risk_probability": round(probability, 4)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@app.get("/predict/{drug_id}")
def predict(drug_id: int):
    return predict_shortage(drug_id)

@app.post("/retrain-model")
def retrain():
    return train_model()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api import health_check, routes
from app.database.connection import engine
from app.models.db_models import Base

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
    * **Stock History**: Automatic tracking of all inventory changes
    * **Flexible Filtering**: Query by pharmacy, medication, risk level, etc.
    
    ## Endpoints
    
    * `/api/v1/health` - Health check
    * `/api/v1/inventory/*` - Inventory management
    * `/api/v1/inventory/shortage-risks` - Risk assessment
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
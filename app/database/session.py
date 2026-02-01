from sqlalchemy.orm import sessionmaker
from app.database.connection import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    FastAPI dependency generator:
    yields a DB session and closes it after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

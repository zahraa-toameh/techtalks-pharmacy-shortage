import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.db_models import Base


@pytest.fixture()
def db_session():
    # Use an in-memory SQLite DB for unit tests (fast + isolated)
    engine = create_engine("sqlite+pysqlite:///:memory:", future=True)

    Base.metadata.create_all(bind=engine)

    TestingSessionLocal = sessionmaker(
        bind=engine, autoflush=False, autocommit=False
    )

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

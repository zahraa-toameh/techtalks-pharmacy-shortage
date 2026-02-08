import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

load_dotenv()

def get_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError(
            "DATABASE_URL is not set. Create a .env file in the project root "
            "or export DATABASE_URL in your environment."
        )
    return url


def create_db_engine() -> Engine:
    echo = os.getenv("DB_ECHO", "false").lower() in {"1", "true", "yes", "y"}
    # pool_pre_ping helps avoid stale connections
    return create_engine(get_database_url(), echo=echo, pool_pre_ping=True)


engine = create_db_engine()

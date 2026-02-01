from fastapi import FastAPI
from dotenv import load_dotenv

from app.models.db_models import Base
from app.database.connection import engine

load_dotenv()

app = FastAPI()

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

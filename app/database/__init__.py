from app.database.connection import engine, Base

# remark: I removed the Base import from db_models to avoid circular imports. We only need Base here to create tables, not the models themselves.
def init_db():
    from app.models import db_models  # import models here, not Base
    Base.metadata.create_all(bind=engine)

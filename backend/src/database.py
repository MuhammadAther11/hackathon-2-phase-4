import os
import time
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import event
from dotenv import load_dotenv
from urllib.parse import urlparse

# Import all models to ensure they're registered with SQLModel metadata
from src.models.user import User
from src.models.task import Task
from src.models.chat import ChatSession, ChatMessage

# Load environment variables
load_dotenv()

# Use env variable or fallback (for local testing)
DATABASE_URL = os.getenv("DATABASE_URL")
# Log database configuration on startup
print(f"[DB] DATABASE_URL configured: {bool(DATABASE_URL)}")
if DATABASE_URL:
    masked_url = DATABASE_URL.split("@")[0] + "@***@***" if "@" in DATABASE_URL else "***"
    print(f"[DB] Connection string: {masked_url}")


def create_neon_engine():
    """Create database engine with Neon-specific configuration"""
    if not DATABASE_URL:
        return create_engine("sqlite:///dummy.db", echo=True)

    engine_args = {
        "echo": True,
        "pool_size": 1,
        "max_overflow": 4,
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_timeout": 30,
        "max_identifier_length": 63,
        "connect_args": {
            "connect_timeout": 30,
            "sslmode": "require",
            "keepalives": 1,
            "keepalives_idle": 30,
            "keepalives_interval": 10,
            "keepalives_count": 5,
        },
    }

    if "neon.tech" in DATABASE_URL:
        engine_args["connect_args"]["sslmode"] = "require"

    return create_engine(DATABASE_URL, **engine_args)


# Create engine
engine = create_neon_engine()


# Neon-specific event listeners
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Handle connection setup for Neon"""
    with dbapi_conn.cursor() as cursor:
        cursor.execute("SET idle_in_transaction_session_timeout = 30000;")
        cursor.execute("SET statement_timeout = 30000;")
        cursor.execute("SET timezone = 'Asia/Karachi';")


@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    """Handle connection checkout"""
    pass


def create_db_and_tables():
    """Create database tables with retry logic for Neon"""
    max_retries = 5
    for attempt in range(max_retries):
        try:
            with engine.connect() as conn:
                pass
            SQLModel.metadata.create_all(engine)
            print(f"Database tables created successfully on attempt {attempt + 1}")
            return
        except Exception as e:
            print(f"Database connection attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(min(2 ** attempt, 10))
            else:
                print(f"Failed to create database tables after {max_retries} attempts")
                raise


# FastAPI dependency for database session
def get_db():
    """Yield a database session"""
    with Session(engine) as session:
        yield session


# Alias for older imports using get_session()
get_session = get_db
if __name__ == "__main__":
    create_db_and_tables()
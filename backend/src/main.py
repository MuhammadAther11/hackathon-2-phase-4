from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from src.api.tasks import router as tasks_router
from src.api.auth import router as auth_router
from src.api.chat import router as chat_router
from src.database import create_db_and_tables

app = FastAPI(title="Task Management API")

@app.on_event("startup")
def on_startup():
    try:
        create_db_and_tables()
        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Warning: Database initialization error (will retry on first request): {str(e)}")
        import traceback
        traceback.print_exc()

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "http://localhost:8000",
        "http://127.0.0.1:8000",  
        "https://hackathon-2-phase-3-todo-ai-cahtbot.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="")
app.include_router(tasks_router, prefix="/api")
app.include_router(chat_router, prefix="")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    import traceback
    print(f"SQLAlchemy Error: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Database error occurred: {str(exc)}"},
    )

@app.get("/")
async def root():
    return {"message": "Welcome to the Task Management API"}

@app.get("/health")
async def health():
    """Health check endpoint to verify API is running"""
    return {"status": "ok", "service": "Task Management API"}

@app.get("/debug/config")
async def debug_config():
    """Debug endpoint to check configuration (development only)"""
    import os
    return {
        "has_database_url": bool(os.getenv("DATABASE_URL")),
        "has_better_auth_secret": bool(os.getenv("BETTER_AUTH_SECRET")),
        "secret_length": len(os.getenv("BETTER_AUTH_SECRET", "")),
        "frontend_url": os.getenv("FRONTEND_URL", "not set")
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base
from .database import engine
from . import models


Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="Daily Goals API",
    description="Backend API for Daily Goals",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Daily Goals API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }
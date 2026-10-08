from fastapi import FastAPI


app = FastAPI(
    title="Daily Goals API",
    description="Backend for Daily Goals",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Daily Goals backend is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    } 
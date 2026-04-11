from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.domains.auth.router import router as auth_router
from app.domains.users.router import router as users_router
from app.domains.patients.router import router as patients_router
from app.domains.evaluations.router import router as evaluations_router

app = FastAPI(title="CARS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(patients_router)
app.include_router(evaluations_router)


@app.get("/health")
def health():
    return {"status": "ok"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from models.database import init_db
from routes import registrations, admin, performances
from seed import seed_performances

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_performances()
    yield


app = FastAPI(
    title="Goonj 2026 API",
    description="Backend for Goonj 2026 Grand Cultural Festival",
    version="1.0.0",
    lifespan=lifespan
)

# CORS — allow all origins so ngrok works seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (QR codes)
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Routers
app.include_router(registrations.router)
app.include_router(admin.router)
app.include_router(performances.router)


@app.get("/")
def root():
    return {"message": "Goonj 2026 API is running 🎉", "docs": "/docs"}


@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}

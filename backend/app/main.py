"""
PICKSY — Backend FastAPI Principal
Fichier : backend/app/main.py
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from app.api.routes import categories, products, chat, recommendations, prices, alerts, wishlist, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Picksy Backend démarré")
    yield
    print("🛑 Picksy Backend arrêté")

app = FastAPI(
    title="Picksy API",
    description="AI-powered home product recommendation engine",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(categories.router, prefix="/categories", tags=["categories"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
app.include_router(prices.router, prefix="/prices", tags=["prices"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": "Picksy", "version": "1.0.0"}

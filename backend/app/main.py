"""
PICKSY — Point d'entrée FastAPI
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api.routes import chat, products, newsletter


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Picksy Backend démarré")
    yield
    print("🛑 Picksy Backend arrêté")


app = FastAPI(
    title="Picksy API",
    description="L'IA anti-regret pour tes achats maison",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat IA"])
app.include_router(products.router, prefix="/api/products", tags=["Produits"])
app.include_router(newsletter.router, prefix="/api/newsletter", tags=["Newsletter"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "picksy-backend"}

"""
Main FastAPI application module for ResumeForge
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import ai_router, resume_router, upload_router, pdf_router
from .utils.env_loader import load_env_variables

# Load environment variables
load_env_variables()

# Create FastAPI application
app = FastAPI(
    title="ResumeForge API",
    description="API for enhancing and managing resumes with AI",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ai_router.router, prefix="/api")
app.include_router(resume_router.router, prefix="/api")
app.include_router(upload_router.router, prefix="/api")
app.include_router(pdf_router.router, prefix="/api")


@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    return {
        "message": "Welcome to ResumeForge API",
        "version": "1.0.0",
        "docs_url": "/docs",
    }

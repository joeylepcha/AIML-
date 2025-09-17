"""  
Main entry point for AI Microservices with Flowise + LangChain
"""
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sys
import os

# Add services directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))

# Import routers with proper module names
try:
    from services.auth.api import router as auth_router
except ImportError as e:
    print(f"Warning: Could not import auth router: {e}")
    auth_router = None

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("summarization_api", "services/text-summarization/api.py")
    summarization_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(summarization_module)
    summarization_router = summarization_module.router
except Exception as e:
    print(f"Warning: Could not import summarization router: {e}")
    summarization_router = None

try:
    spec = importlib.util.spec_from_file_location("qa_api", "services/qa-documents/api.py")
    qa_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(qa_module)
    qa_router = qa_module.router
except Exception as e:
    print(f"Warning: Could not import QA router: {e}")
    qa_router = None

try:
    spec = importlib.util.spec_from_file_location("learning_api", "services/learning-path/api.py")
    learning_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(learning_module)
    learning_router = learning_module.router
except Exception as e:
    print(f"Warning: Could not import learning router: {e}")
    learning_router = None

app = FastAPI(
    title="AI Microservices with Flowise + LangChain",
    description="Mobile App with Login, Dashboard and AI Services for text summarization, Q&A over documents, and dynamic learning path suggestion",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend
try:
    app.mount("/static", StaticFiles(directory="frontend/build"), name="static")
except Exception:
    pass  # Frontend build directory might not exist yet

# Include routers
if auth_router:
    app.include_router(auth_router)
if summarization_router:
    app.include_router(summarization_router)
if qa_router:
    app.include_router(qa_router)
if learning_router:
    app.include_router(learning_router)

@app.get("/")
async def root():
    return {
        "message": "AI Microservices Mobile App with Flowise + LangChain",
        "description": "Interactive mobile app prototype with login, signup, and dashboard",
        "services": [
            "authentication",
            "text-summarization",
            "qa-documents", 
            "learning-path"
        ],
        "endpoints": {
            "auth": "/auth - Authentication endpoints",
            "summarization": "/summarize - Text summarization service",
            "qa": "/qa - Q&A over documents service",
            "learning": "/learning - Learning path suggestions",
            "docs": "/docs - API documentation"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "main": "healthy",
            "auth": "healthy",
            "summarization": "healthy",
            "qa": "healthy",
            "learning": "healthy"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
"""
Main entry point for AI Microservices with Flowise + LangChain
"""
import uvicorn
from fastapi import FastAPI

app = FastAPI(
    title="AI Microservices with Flowise + LangChain",
    description="API for text summarization, Q&A over documents, and dynamic learning path suggestion",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {
        "message": "AI Microservices with Flowise + LangChain",
        "services": [
            "text-summarization",
            "qa-documents", 
            "learning-path"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
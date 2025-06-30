"""
Server startup script for ResumeForge API
"""
import uvicorn
import os

def start():
    """Start the FastAPI server"""
    # Get the port from environment variables or use default
    port = int(os.environ.get("PORT", 8000))
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,  # Enable auto-reload during development
    )

if __name__ == "__main__":
    start()

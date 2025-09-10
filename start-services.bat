@echo off
echo Starting AI Microservices...

echo.
echo Please make sure you have:
echo 1. Activated your Python virtual environment
echo 2. Installed all dependencies with "pip install -r requirements.txt"
echo 3. Started Flowise separately with "npx flowise start"
echo.

echo Starting Main Service...
start "Main Service" /D "%cd%" cmd /k "uvicorn main:app --reload"

timeout /t 5

echo Starting Text Summarization Service...
start "Text Summarization" /D "%cd%" cmd /k "uvicorn services.text-summarization.api:app --reload --port 8001"

timeout /t 5

echo Starting Q&A Documents Service...
start "Q&A Documents" /D "%cd%" cmd /k "uvicorn services.qa-documents.api:app --reload --port 8002"

timeout /t 5

echo Starting Learning Path Service...
start "Learning Path" /D "%cd%" cmd /k "uvicorn services.learning-path.api:app --reload --port 8003"

echo.
echo All services started!
echo.
echo Main Service: http://localhost:8000
echo Text Summarization: http://localhost:8001
echo Q&A Documents: http://localhost:8002
echo Learning Path: http://localhost:8003
echo.
echo Press any key to exit...
pause >nul
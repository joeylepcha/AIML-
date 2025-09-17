@echo off
REM Script to build all Docker images for the AI microservices

echo Building Docker images for AI Microservices...

REM Build main API service
echo Building main-api service...
docker build -f Dockerfile.main -t aiml-main-api .

REM Build text summarization service
echo Building text-summarization service...
docker build -f services/text-summarization/Dockerfile -t aiml-text-summarization .

REM Build Q&A documents service
echo Building qa-documents service...
docker build -f services/qa-documents/Dockerfile -t aiml-qa-documents .

REM Build learning path service
echo Building learning-path service...
docker build -f services/learning-path/Dockerfile -t aiml-learning-path .

REM Build frontend service
echo Building frontend service...
docker build -f frontend/Dockerfile -t aiml-frontend ./frontend

echo.
echo All Docker images built successfully!
echo.
echo You can now run the services using:
echo docker-compose up
echo.
echo Or run individual containers:
echo docker run -p 8000:8000 aiml-main-api
echo docker run -p 8001:8001 aiml-text-summarization
echo docker run -p 8002:8002 aiml-qa-documents
echo docker run -p 8003:8003 aiml-learning-path
echo docker run -p 3001:3001 aiml-frontend

pause
@echo off
REM AWS ECR Deployment Script for AI Microservices (Windows)
REM This script automates the entire deployment process to AWS ECR

setlocal enabledelayedexpansion

REM Configuration - Update these values
set AWS_REGION=us-east-1
set AWS_ACCOUNT_ID=
set PROJECT_NAME=aiml

echo [INFO] Starting AWS ECR deployment for AI Microservices...

REM Function to check prerequisites
echo [INFO] Checking prerequisites...

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] AWS CLI is not installed. Please install it first.
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Check if AWS credentials are configured
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] AWS credentials not configured. Run 'aws configure' first.
    pause
    exit /b 1
)

REM Get AWS Account ID if not provided
if "%AWS_ACCOUNT_ID%"=="" (
    for /f "tokens=*" %%a in ('aws sts get-caller-identity --query Account --output text') do set AWS_ACCOUNT_ID=%%a
    echo [INFO] Using AWS Account ID: !AWS_ACCOUNT_ID!
)

echo [INFO] Prerequisites check completed.

REM Create ECR repositories
echo [INFO] Creating ECR repositories...

aws ecr create-repository --repository-name %PROJECT_NAME%-main-api --region %AWS_REGION% 2>nul || echo [WARNING] Repository might already exist
aws ecr create-repository --repository-name %PROJECT_NAME%-text-summarization --region %AWS_REGION% 2>nul || echo [WARNING] Repository might already exist
aws ecr create-repository --repository-name %PROJECT_NAME%-qa-documents --region %AWS_REGION% 2>nul || echo [WARNING] Repository might already exist
aws ecr create-repository --repository-name %PROJECT_NAME%-learning-path --region %AWS_REGION% 2>nul || echo [WARNING] Repository might already exist
aws ecr create-repository --repository-name %PROJECT_NAME%-frontend --region %AWS_REGION% 2>nul || echo [WARNING] Repository might already exist

echo [INFO] ECR repositories created.

REM Login to ECR
echo [INFO] Logging in to ECR...
for /f "tokens=*" %%a in ('aws ecr get-login-password --region %AWS_REGION%') do (
    echo %%a | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com
)
echo [INFO] ECR login successful.

REM Build Docker images
echo [INFO] Building Docker images...
docker-compose build
echo [INFO] Docker images built successfully.

REM Tag images for ECR
echo [INFO] Tagging images for ECR...
set ECR_REGISTRY=%AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com

docker tag aimlassignment-main-api:latest %ECR_REGISTRY%/%PROJECT_NAME%-main-api:latest
docker tag aimlassignment-text-summarization:latest %ECR_REGISTRY%/%PROJECT_NAME%-text-summarization:latest
docker tag aimlassignment-qa-documents:latest %ECR_REGISTRY%/%PROJECT_NAME%-qa-documents:latest
docker tag aimlassignment-learning-path:latest %ECR_REGISTRY%/%PROJECT_NAME%-learning-path:latest
docker tag aimlassignment-frontend:latest %ECR_REGISTRY%/%PROJECT_NAME%-frontend:latest

echo [INFO] Images tagged for ECR.

REM Push images to ECR
echo [INFO] Pushing images to ECR...

echo [INFO] Pushing main-api...
docker push %ECR_REGISTRY%/%PROJECT_NAME%-main-api:latest

echo [INFO] Pushing text-summarization...
docker push %ECR_REGISTRY%/%PROJECT_NAME%-text-summarization:latest

echo [INFO] Pushing qa-documents...
docker push %ECR_REGISTRY%/%PROJECT_NAME%-qa-documents:latest

echo [INFO] Pushing learning-path...
docker push %ECR_REGISTRY%/%PROJECT_NAME%-learning-path:latest

echo [INFO] Pushing frontend...
docker push %ECR_REGISTRY%/%PROJECT_NAME%-frontend:latest

echo [INFO] All images pushed to ECR successfully.

REM Create production docker-compose file
echo [INFO] Creating production docker-compose file...

(
echo version: '3.8'
echo.
echo services:
echo   flowise:
echo     image: flowiseai/flowise
echo     container_name: flowise-service
echo     ports:
echo       - "3000:3000"
echo     environment:
echo       - PORT=3000
echo     volumes:
echo       - flowise-data:/root/.flowise
echo     restart: unless-stopped
echo.
echo   main-api:
echo     image: %ECR_REGISTRY%/%PROJECT_NAME%-main-api:latest
echo     container_name: main-api
echo     ports:
echo       - "8000:8000"
echo     environment:
echo       - HOST=0.0.0.0
echo       - PORT=8000
echo     volumes:
echo       - ./uploads:/app/uploads
echo     depends_on:
echo       - flowise
echo     restart: unless-stopped
echo.
echo   text-summarization:
echo     image: %ECR_REGISTRY%/%PROJECT_NAME%-text-summarization:latest
echo     container_name: text-summarization-service
echo     ports:
echo       - "8001:8001"
echo     environment:
echo       - HOST=0.0.0.0
echo       - PORT=8001
echo     volumes:
echo       - ./uploads:/app/uploads
echo     depends_on:
echo       - flowise
echo     restart: unless-stopped
echo.
echo   qa-documents:
echo     image: %ECR_REGISTRY%/%PROJECT_NAME%-qa-documents:latest
echo     container_name: qa-documents-service
echo     ports:
echo       - "8002:8002"
echo     environment:
echo       - HOST=0.0.0.0
echo       - PORT=8002
echo     volumes:
echo       - ./uploads:/app/uploads
echo       - chroma_db:/app/chroma_db
echo     depends_on:
echo       - flowise
echo     restart: unless-stopped
echo.
echo   learning-path:
echo     image: %ECR_REGISTRY%/%PROJECT_NAME%-learning-path:latest
echo     container_name: learning-path-service
echo     ports:
echo       - "8003:8003"
echo     environment:
echo       - HOST=0.0.0.0
echo       - PORT=8003
echo     depends_on:
echo       - flowise
echo     restart: unless-stopped
echo.
echo   frontend:
echo     image: %ECR_REGISTRY%/%PROJECT_NAME%-frontend:latest
echo     container_name: frontend-service
echo     ports:
echo       - "3001:3001"
echo     restart: unless-stopped
echo.
echo volumes:
echo   flowise-data:
echo   chroma_db:
) > docker-compose.prod.yml

echo [INFO] Production docker-compose.yml created as docker-compose.prod.yml

REM Display summary
echo.
echo [INFO] Deployment Summary:
echo ====================
echo AWS Account ID: %AWS_ACCOUNT_ID%
echo AWS Region: %AWS_REGION%
echo ECR Registry: %ECR_REGISTRY%
echo.
echo Images pushed:
echo   - %ECR_REGISTRY%/%PROJECT_NAME%-main-api:latest
echo   - %ECR_REGISTRY%/%PROJECT_NAME%-text-summarization:latest
echo   - %ECR_REGISTRY%/%PROJECT_NAME%-qa-documents:latest
echo   - %ECR_REGISTRY%/%PROJECT_NAME%-learning-path:latest
echo   - %ECR_REGISTRY%/%PROJECT_NAME%-frontend:latest
echo.
echo To deploy on a server:
echo 1. Copy docker-compose.prod.yml to your server
echo 2. Login to ECR: aws ecr get-login-password --region %AWS_REGION% ^| docker login --username AWS --password-stdin %ECR_REGISTRY%
echo 3. Run: docker-compose -f docker-compose.prod.yml up -d
echo.
echo [INFO] Deployment to AWS ECR completed successfully! 🚀

pause
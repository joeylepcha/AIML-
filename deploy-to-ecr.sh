#!/bin/bash

# AWS ECR Deployment Script for AI Microservices
# This script automates the entire deployment process to AWS ECR

set -e  # Exit on any error

# Configuration - Update these values
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=""  # Add your AWS account ID here
PROJECT_NAME="aiml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    
    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Run 'aws configure' first."
        exit 1
    fi
    
    # Get AWS Account ID if not provided
    if [ -z "$AWS_ACCOUNT_ID" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        print_status "Using AWS Account ID: $AWS_ACCOUNT_ID"
    fi
    
    print_status "Prerequisites check completed."
}

# Function to create ECR repositories
create_ecr_repositories() {
    print_status "Creating ECR repositories..."
    
    repositories=(
        "${PROJECT_NAME}-main-api"
        "${PROJECT_NAME}-text-summarization"
        "${PROJECT_NAME}-qa-documents"
        "${PROJECT_NAME}-learning-path"
        "${PROJECT_NAME}-frontend"
    )
    
    for repo in "${repositories[@]}"; do
        print_status "Creating repository: $repo"
        aws ecr create-repository --repository-name "$repo" --region "$AWS_REGION" || {
            print_warning "Repository $repo might already exist, continuing..."
        }
    done
    
    print_status "ECR repositories created."
}

# Function to login to ECR
ecr_login() {
    print_status "Logging in to ECR..."
    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin \
        "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    print_status "ECR login successful."
}

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build using docker-compose
    docker-compose build
    
    print_status "Docker images built successfully."
}

# Function to tag images for ECR
tag_images() {
    print_status "Tagging images for ECR..."
    
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    # Tag images
    docker tag "aimlassignment-main-api:latest" "${ECR_REGISTRY}/${PROJECT_NAME}-main-api:latest"
    docker tag "aimlassignment-text-summarization:latest" "${ECR_REGISTRY}/${PROJECT_NAME}-text-summarization:latest"
    docker tag "aimlassignment-qa-documents:latest" "${ECR_REGISTRY}/${PROJECT_NAME}-qa-documents:latest"
    docker tag "aimlassignment-learning-path:latest" "${ECR_REGISTRY}/${PROJECT_NAME}-learning-path:latest"
    docker tag "aimlassignment-frontend:latest" "${ECR_REGISTRY}/${PROJECT_NAME}-frontend:latest"
    
    print_status "Images tagged for ECR."
}

# Function to push images to ECR
push_images() {
    print_status "Pushing images to ECR..."
    
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    images=(
        "${PROJECT_NAME}-main-api"
        "${PROJECT_NAME}-text-summarization"
        "${PROJECT_NAME}-qa-documents"
        "${PROJECT_NAME}-learning-path"
        "${PROJECT_NAME}-frontend"
    )
    
    for image in "${images[@]}"; do
        print_status "Pushing ${image}..."
        docker push "${ECR_REGISTRY}/${image}:latest"
    done
    
    print_status "All images pushed to ECR successfully."
}

# Function to create production docker-compose file
create_production_compose() {
    print_status "Creating production docker-compose file..."
    
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  flowise:
    image: flowiseai/flowise
    container_name: flowise-service
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
    volumes:
      - flowise-data:/root/.flowise
    restart: unless-stopped

  main-api:
    image: ${ECR_REGISTRY}/${PROJECT_NAME}-main-api:latest
    container_name: main-api
    ports:
      - "8000:8000"
    environment:
      - HOST=0.0.0.0
      - PORT=8000
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - flowise
    restart: unless-stopped

  text-summarization:
    image: ${ECR_REGISTRY}/${PROJECT_NAME}-text-summarization:latest
    container_name: text-summarization-service
    ports:
      - "8001:8001"
    environment:
      - HOST=0.0.0.0
      - PORT=8001
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - flowise
    restart: unless-stopped

  qa-documents:
    image: ${ECR_REGISTRY}/${PROJECT_NAME}-qa-documents:latest
    container_name: qa-documents-service
    ports:
      - "8002:8002"
    environment:
      - HOST=0.0.0.0
      - PORT=8002
    volumes:
      - ./uploads:/app/uploads
      - chroma_db:/app/chroma_db
    depends_on:
      - flowise
    restart: unless-stopped

  learning-path:
    image: ${ECR_REGISTRY}/${PROJECT_NAME}-learning-path:latest
    container_name: learning-path-service
    ports:
      - "8003:8003"
    environment:
      - HOST=0.0.0.0
      - PORT=8003
    depends_on:
      - flowise
    restart: unless-stopped

  frontend:
    image: ${ECR_REGISTRY}/${PROJECT_NAME}-frontend:latest
    container_name: frontend-service
    ports:
      - "3001:3001"
    restart: unless-stopped

volumes:
  flowise-data:
  chroma_db:
EOF

    print_status "Production docker-compose.yml created as docker-compose.prod.yml"
}

# Function to display summary
display_summary() {
    print_status "Deployment Summary:"
    echo "===================="
    echo "AWS Account ID: $AWS_ACCOUNT_ID"
    echo "AWS Region: $AWS_REGION"
    echo "ECR Registry: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    echo ""
    echo "Images pushed:"
    for image in "${PROJECT_NAME}-main-api" "${PROJECT_NAME}-text-summarization" "${PROJECT_NAME}-qa-documents" "${PROJECT_NAME}-learning-path" "${PROJECT_NAME}-frontend"; do
        echo "  - ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${image}:latest"
    done
    echo ""
    echo "To deploy on a server:"
    echo "1. Copy docker-compose.prod.yml to your server"
    echo "2. Login to ECR: aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"
}

# Main execution
main() {
    print_status "Starting AWS ECR deployment for AI Microservices..."
    
    check_prerequisites
    create_ecr_repositories
    ecr_login
    build_images
    tag_images
    push_images
    create_production_compose
    display_summary
    
    print_status "Deployment to AWS ECR completed successfully! 🚀"
}

# Run the main function
main "$@"
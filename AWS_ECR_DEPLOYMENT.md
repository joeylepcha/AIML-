# AWS ECR Deployment Guide

This guide provides step-by-step instructions for deploying the AI Microservices application to AWS ECR (Elastic Container Registry).

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   aws --version
   aws configure
   ```

2. **Docker Desktop running**
   - Ensure Docker Desktop is started and running

3. **AWS ECR Repository created**
   - Create repositories for each service in AWS ECR

## Step 1: Create ECR Repositories

Run the following commands to create ECR repositories for each service:

```bash
# Create repositories
aws ecr create-repository --repository-name aiml-main-api --region us-east-1
aws ecr create-repository --repository-name aiml-text-summarization --region us-east-1
aws ecr create-repository --repository-name aiml-qa-documents --region us-east-1
aws ecr create-repository --repository-name aiml-learning-path --region us-east-1
aws ecr create-repository --repository-name aiml-frontend --region us-east-1
```

Note: Replace `us-east-1` with your preferred AWS region.

## Step 2: Get ECR Login Token

```bash
# Get login token for ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
```

Replace `<your-account-id>` with your AWS account ID.

## Step 3: Build Docker Images

Run one of the following commands to build all Docker images:

### Option A: Using Docker Compose (Recommended)
```bash
docker-compose build
```

### Option B: Using the build script
```bash
# On Windows
./build-images.bat

# On Linux/Mac
./build-images.sh
```

## Step 4: Tag Images for ECR

```bash
# Tag images for ECR (replace <account-id> and <region>)
docker tag aiml-main-api:latest <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-main-api:latest
docker tag aiml-text-summarization:latest <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-text-summarization:latest
docker tag aiml-qa-documents:latest <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-qa-documents:latest
docker tag aiml-learning-path:latest <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-learning-path:latest
docker tag aiml-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-frontend:latest
```

## Step 5: Push Images to ECR

```bash
# Push images to ECR
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-main-api:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-text-summarization:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-qa-documents:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-learning-path:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-frontend:latest
```

## Step 6: Create Production Docker Compose

Create a production version of docker-compose.yml that uses ECR images:

```yaml
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
    image: <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-main-api:latest
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
    image: <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-text-summarization:latest
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
    image: <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-qa-documents:latest
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
    image: <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-learning-path:latest
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
    image: <account-id>.dkr.ecr.<region>.amazonaws.com/aiml-frontend:latest
    container_name: frontend-service
    ports:
      - "3001:3001"
    restart: unless-stopped

volumes:
  flowise-data:
  chroma_db:
```

## Step 7: Deploy on AWS (Optional)

### Using AWS ECS (Elastic Container Service)

1. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name aiml-cluster
   ```

2. **Create Task Definitions**
   - Create task definitions for each service using the ECR image URIs

3. **Create Services**
   - Create ECS services for each task definition

### Using AWS EKS (Elastic Kubernetes Service)

1. **Create EKS Cluster**
2. **Create Kubernetes Deployment Files**
3. **Deploy using kubectl**

## Troubleshooting

### Common Issues:

1. **Docker Desktop not running**
   - Start Docker Desktop and wait for it to fully initialize

2. **AWS CLI not configured**
   ```bash
   aws configure
   ```

3. **ECR login fails**
   - Check your AWS credentials and region
   - Ensure you have proper ECR permissions

4. **Build failures**
   - Check Dockerfile syntax
   - Ensure all dependencies are available

## Environment Variables

For production deployment, consider setting these environment variables:

```bash
# API Configuration
export API_HOST=0.0.0.0
export API_PORT=8000

# Database
export DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Security
export SECRET_KEY=your-secret-key
export JWT_SECRET=your-jwt-secret

# LLM Configuration
export OPENAI_API_KEY=your-openai-api-key
export FLOWISE_URL=http://flowise:3000
```

## Security Considerations

1. **Use IAM roles** instead of hardcoded credentials
2. **Enable VPC** for network isolation
3. **Use ALB/NLB** for load balancing
4. **Enable HTTPS** with SSL certificates
5. **Implement proper logging** and monitoring

## Monitoring and Logging

Consider implementing:
- CloudWatch for logging and monitoring
- AWS X-Ray for distributed tracing
- Health checks for each service
- Auto-scaling policies

## Cost Optimization

- Use spot instances for non-critical workloads
- Implement proper resource limits
- Set up auto-scaling based on demand
- Consider using AWS Fargate for serverless containers
# Makefile for AI Microservices Project

# Variables
PYTHON = python
PIP = pip
DOCKER = docker
DOCKER_COMPOSE = docker-compose

# Default target
.PHONY: help
help:
	@echo "AI Microservices - Available Commands:"
	@echo "  setup            - Set up the development environment"
	@echo "  install          - Install Python dependencies"
	@echo "  run              - Run all services locally"
	@echo "  run-main         - Run main service"
	@echo "  run-text-summarization - Run text summarization service"
	@echo "  run-qa-documents - Run Q&A documents service"
	@echo "  run-learning-path - Run learning path service"
	@echo "  run-frontend     - Run frontend service"
	@echo "  run-flowise      - Run Flowise service"
	@echo "  docker-build     - Build Docker images"
	@echo "  docker-up        - Start all services with Docker Compose"
	@echo "  docker-down      - Stop all services with Docker Compose"
	@echo "  test             - Run tests"
	@echo "  clean            - Clean up temporary files"

# Setup development environment
.PHONY: setup
setup:
	$(PYTHON) setup.py

# Install Python dependencies
.PHONY: install
install:
	$(PIP) install -r requirements.txt

# Run all services locally
.PHONY: run
run:
	@echo "Starting all services..."
	@echo "Please start each service in separate terminals:"
	@echo "1. Main service: uvicorn main:app --reload"
	@echo "2. Text Summarization: uvicorn services.text-summarization.api:app --reload --port 8001"
	@echo "3. Q&A Documents: uvicorn services.qa-documents.api:app --reload --port 8002"
	@echo "4. Learning Path: uvicorn services.learning-path.api:app --reload --port 8003"

# Run main service
.PHONY: run-main
run-main:
	uvicorn main:app --reload

# Run text summarization service
.PHONY: run-text-summarization
run-text-summarization:
	uvicorn services.text-summarization.api:app --reload --port 8001

# Run Q&A documents service
.PHONY: run-qa-documents
run-qa-documents:
	uvicorn services.qa-documents.api:app --reload --port 8002

# Run learning path service
.PHONY: run-learning-path
run-learning-path:
	uvicorn services.learning-path.api:app --reload --port 8003

# Run frontend service
.PHONY: run-frontend
run-frontend:
	cd frontend && npm run dev

# Run Flowise service
.PHONY: run-flowise
run-flowise:
	npx flowise start

# Build Docker images
.PHONY: docker-build
docker-build:
	$(DOCKER_COMPOSE) build

# Start all services with Docker Compose
.PHONY: docker-up
docker-up:
	$(DOCKER_COMPOSE) up --build

# Stop all services with Docker Compose
.PHONY: docker-down
docker-down:
	$(DOCKER_COMPOSE) down

# Run tests
.PHONY: test
test:
	$(PYTHON) test_services.py

# Clean up temporary files
.PHONY: clean
clean:
	rm -rf __pycache__
	rm -rf */__pycache__
	rm -rf uploads/*
	rm -rf chroma_db/*
	@echo "Cleaned up temporary files"
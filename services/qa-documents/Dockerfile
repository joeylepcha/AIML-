# Dockerfile for qa-documents service
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code and root services directory
COPY services/qa-documents/ services/qa-documents/
COPY services/__init__.py services/

# Create uploads and chroma_db directories
RUN mkdir -p uploads chroma_db

# Expose port
EXPOSE 8002

# Run the application
CMD ["uvicorn", "services.qa-documents.api:app", "--host", "0.0.0.0", "--port", "8002"]
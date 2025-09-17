# Dockerfile for learning-path service
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
COPY services/learning-path/ services/learning-path/
COPY services/__init__.py services/

# Expose port
EXPOSE 8003

# Run the application
CMD ["uvicorn", "services.learning-path.api:app", "--host", "0.0.0.0", "--port", "8003"]
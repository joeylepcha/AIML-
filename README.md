# AI Microservices with Flowise + LangChain

This project implements modular AI microservices using Flowise and LangChain for the following functionalities:
1. Text summarization
2. Q&A over documents
3. Dynamic learning path suggestion

## Project Structure

```
ai-microservices-assignment/
├── services/
│   ├── text-summarization/
│   ├── qa-documents/
│   └── learning-path/
├── frontend/
├── docs/
│   ├── USAGE.md
│   └── AI-Microservices.postman_collection.json
├── uploads/
├── requirements.txt
├── setup.py
├── main.py
├── docker-compose.yml
├── Dockerfile.main
├── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Python 3.8 or higher
- Node.js (for Flowise and frontend)
- Git
- Docker and Docker Compose (optional, for containerized deployment)

## Setup Instructions

### Python Environment Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

### Alternative Automated Setup

Run the setup script:
```bash
python setup.py
```

This will:
- Check Python version
- Install Python requirements
- Check Node.js installation
- Install Flowise globally
- Create necessary directories

### Flowise Setup

Flowise can be installed globally or as part of the project:

1. Install Flowise globally:
   ```bash
   npm install -g flowise
   ```

2. Run Flowise:
   ```bash
   npx flowise start
   ```

   By default, Flowise runs on port 3000.

### Frontend Setup (Optional, for bonus points)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   node setup-frontend.js
   ```
   
   Or manually:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Services Overview

### 1. Text Summarization Service
- Provides API endpoints for summarizing text content
- Uses LangChain with an open-source LLM
- Supports various summarization techniques

### 2. Q&A over Documents Service
- Enables question answering over uploaded documents
- Supports PDF, DOCX, and TXT file formats
- Uses document parsing and embedding techniques

### 3. Dynamic Learning Path Suggestion Service
- Recommends personalized learning paths based on user input
- Uses AI to analyze learning objectives and suggest resources
- Adapts recommendations based on user progress

## API Endpoints

### Main Service
- `GET /` - Root endpoint with service information
- `GET /health` - Health check endpoint

### Text Summarization Service (Port 8001)
- `GET /` - Service information
- `GET /health` - Health check
- `POST /summarize` - Summarize text
- `POST /summarize-document` - Summarize uploaded document

### Q&A Documents Service (Port 8002)
- `GET /` - Service information
- `GET /health` - Health check
- `POST /upload-document` - Upload and process document
- `POST /ask` - Ask question about processed document

### Learning Path Suggestion Service (Port 8003)
- `GET /` - Service information
- `GET /health` - Health check
- `POST /suggest-path` - Suggest learning path
- `POST /suggest-path-json` - Suggest learning path from JSON

For detailed usage instructions, see [USAGE.md](docs/USAGE.md).

## Environment Variables

Copy the `.env.example` file to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Key variables:
- `LLM_PROVIDER` - Choose between openrouter, ollama, or local
- `LLM_MODEL` - Specify the model to use
- `LLM_API_KEY` - API key for your chosen LLM provider
- `FLOWISE_API_URL` - URL for Flowise API
- `FLOWISE_API_KEY` - API key for Flowise (if authentication is enabled)

## Running the Application

### Option 1: Manual Start

1. Start Flowise (in a separate terminal):
   ```bash
   npx flowise start
   ```

2. Start the main Python service:
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload
   ```

3. Start each service individually (in separate terminals):
   ```bash
   # Text Summarization Service
   uvicorn services.text-summarization.api:app --reload --port 8001
   
   # Q&A Documents Service
   uvicorn services.qa-documents.api:app --reload --port 8002
   
   # Learning Path Suggestion Service
   uvicorn services.learning-path.api:app --reload --port 8003
   ```

### Option 2: Docker Compose (Recommended)

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```

2. Access the services:
   - Main API: http://localhost:8000
   - Text Summarization: http://localhost:8001
   - Q&A Documents: http://localhost:8002
   - Learning Path Suggestion: http://localhost:8003
   - Frontend: http://localhost:3001
   - Flowise: http://localhost:3000

3. Stop all services:
   ```bash
   docker-compose down
   ```

## Deployment

For production deployment, consider:

1. Using a proper web server (Nginx, Apache) as a reverse proxy
2. Configuring SSL certificates
3. Setting up proper environment variables
4. Using a production-grade database instead of SQLite
5. Implementing proper logging and monitoring

## Postman Collection

A Postman collection is available in the [docs/](docs/) directory:
- [AI-Microservices.postman_collection.json](docs/AI-Microservices.postman_collection.json)

Import this collection into Postman to easily test all API endpoints.

## Testing

Run the test script to verify that all services are working:
```bash
python test_services.py
```
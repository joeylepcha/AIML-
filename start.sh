#!/bin/bash

# AI Microservices Application Startup Script
# This script starts both the backend API server and frontend React application

echo "🚀 Starting AI Microservices Application..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
python -m pip install fastapi uvicorn pydantic python-dotenv python-multipart requests sqlalchemy passlib python-jose bcrypt alembic email-validator pypdf python-docx

# Create demo user
echo "👤 Creating demo user..."
python create_demo_user.py

# Start backend server in background
echo "🔧 Starting backend server on port 8000..."
python main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Install frontend dependencies and start frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🎨 Starting frontend server on port 3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo ""
echo "👤 Demo Login Credentials:"
echo "   Email: demo@example.com"
echo "   Username: demo"
echo "   Password: demo123"
echo ""
echo "⚠️  Note: Some AI services require additional setup (LangChain, Ollama)"
echo ""
echo "To stop the application, press Ctrl+C"

# Wait for user to stop
wait $FRONTEND_PID
kill $BACKEND_PID

echo "🛑 Application stopped."
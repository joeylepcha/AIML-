@echo off
echo 🚀 Starting ALL AI Microservices...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo 📦 Installing Python dependencies...
python -m pip install fastapi uvicorn pydantic python-dotenv python-multipart requests sqlalchemy passlib python-jose bcrypt alembic email-validator pypdf python-docx langchain langchain-community langchain-core chromadb sentence-transformers huggingface-hub transformers

echo 👤 Creating demo user...
python create_demo_user.py

echo 🔧 Starting all microservices...

REM Start Main API Gateway (Backend) - Port 8000
echo 📡 Starting Main API Gateway on port 8000...
start "Main API Gateway (Port 8000)" /D "%cd%" cmd /k "python main.py"
timeout /t 3

REM Start Text Summarization Service - Port 8001
echo 📝 Starting Text Summarization Service on port 8001...
start "Text Summarization Service (Port 8001)" /D "%cd%" cmd /k "uvicorn services.text-summarization.api:app --reload --port 8001"
timeout /t 3

REM Start Q&A Documents Service - Port 8002
echo 📚 Starting Q&A Documents Service on port 8002...
start "Q&A Documents Service (Port 8002)" /D "%cd%" cmd /k "uvicorn services.qa-documents.api:app --reload --port 8002"
timeout /t 3

REM Start Learning Path Service - Port 8003
echo 🎯 Starting Learning Path Service on port 8003...
start "Learning Path Service (Port 8003)" /D "%cd%" cmd /k "uvicorn services.learning-path.api:app --reload --port 8003"
timeout /t 3

REM Install frontend dependencies and start frontend
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

echo 🎨 Starting Frontend on port 3000...
start "Frontend (Port 3000)" /D "%cd%" cmd /k "npm start"
cd ..

echo ⏳ Waiting for all services to initialize...
timeout /t 10

echo.
echo ✅ ALL SERVICES STARTED SUCCESSFULLY! 🎉
echo.
echo 🌐 SERVICE ENDPOINTS:
echo ==========================================
echo 🎨 Frontend:              http://localhost:3000
echo 📡 Main API Gateway:      http://localhost:8000
echo 📝 Text Summarization:    http://localhost:8001
echo 📚 Q&A Documents:         http://localhost:8002
echo 🎯 Learning Path:         http://localhost:8003
echo.
echo 📖 API DOCUMENTATION:
echo ==========================================
echo 📡 Main API Docs:         http://localhost:8000/docs
echo 📝 Text Summary Docs:     http://localhost:8001/docs
echo 📚 Q&A Docs:              http://localhost:8002/docs
echo 🎯 Learning Path Docs:    http://localhost:8003/docs
echo.
echo 👤 DEMO LOGIN CREDENTIALS:
echo ==========================================
echo    Email: demo@example.com
echo    Username: demo
echo    Password: demo123
echo.
echo ⚠️  NOTES:
echo - Each service runs in a separate window
echo - Close individual windows to stop services
echo - Frontend will open automatically in your browser
echo - Some AI features require additional LLM setup
echo.
echo 🔍 To check if all services are running:
echo    netstat -an ^| findstr ":3000 :8000 :8001 :8002 :8003"
echo.
echo Press any key to close this window (services will continue running)...
pause
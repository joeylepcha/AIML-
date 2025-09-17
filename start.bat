@echo off
echo 🚀 Starting AI Microservices Application...

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

REM Install Python dependencies
echo 📦 Installing Python dependencies...
python -m pip install fastapi uvicorn pydantic python-dotenv python-multipart requests sqlalchemy passlib python-jose bcrypt alembic email-validator pypdf python-docx

REM Create demo user
echo 👤 Creating demo user...
python create_demo_user.py

REM Start backend server
echo 🔧 Starting backend server on port 8000...
start "Backend Server" python main.py

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 5

REM Install frontend dependencies and start frontend
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

echo 🎨 Starting frontend server on port 3000...
start "Frontend Server" npm start

echo.
echo ✅ Application started successfully!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:8000
echo 📖 API Documentation: http://localhost:8000/docs
echo.
echo 👤 Demo Login Credentials:
echo    Email: demo@example.com
echo    Username: demo
echo    Password: demo123
echo.
echo ⚠️  Note: Some AI services require additional setup (LangChain, Ollama)
echo.
echo Press any key to exit...
pause
cd ..
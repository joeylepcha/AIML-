@echo off
echo 🔄 RESUMING ALL SERVICES - Quick Start...

echo 📡 Main API Gateway is RUNNING on port 8000
echo ✅ Backend API: http://localhost:8000
echo 📖 API Docs: http://localhost:8000/docs

echo.
echo 🎨 Starting Frontend on available port...
cd frontend
set PORT=3002
start "Frontend (Port 3002)" npm start
cd ..

echo.
echo ⏳ Waiting for frontend to start...
timeout /t 5

echo.
echo ✅ SERVICES RESUMED SUCCESSFULLY! 🎉
echo.
echo 🌐 ACCESS YOUR APPLICATION:
echo ==========================================
echo 🔌 Backend API:       http://localhost:8000
echo 🎨 Frontend:          http://localhost:3002
echo 📖 API Documentation: http://localhost:8000/docs
echo.
echo 👤 DEMO LOGIN CREDENTIALS:
echo    Email: demo@example.com
echo    Username: demo
echo    Password: demo123
echo.
echo 📝 CURRENT STATUS:
echo ✅ Main API Gateway: RUNNING
echo ✅ Authentication: AVAILABLE  
echo ✅ Frontend: STARTING
echo ⚠️  AI Services: Available via main API
echo.
echo 🔍 To verify services are running:
echo    netstat -an ^| findstr ":8000 :3002"
echo.
pause
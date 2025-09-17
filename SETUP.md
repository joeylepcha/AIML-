# AI Microservices Setup Guide

This guide will help you set up and run the AI Microservices application with authentication and AI-powered features.

## 🎯 Quick Start

### Option 1: One-Click Setup (Recommended)

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### Backend Setup
1. Install Python dependencies:
```bash
pip install fastapi uvicorn pydantic python-dotenv python-multipart requests sqlalchemy passlib python-jose bcrypt alembic email-validator pypdf python-docx
```

2. Create demo user:
```bash
python create_demo_user.py
```

3. Start backend server:
```bash
python main.py
```

#### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend server:
```bash
npm start
```

## 📱 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔐 Demo Credentials

Use these credentials to test the application:

- **Email**: demo@example.com
- **Username**: demo
- **Password**: demo123

## 🛠️ Features Available

### ✅ Working Features
- ✅ User Registration and Login
- ✅ JWT Authentication
- ✅ Responsive Mobile-First Design
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ Modern UI with Animations

### 🚧 AI Services (Requires Additional Setup)
- 🚧 Text Summarization (needs LangChain + LLM)
- 🚧 Q&A over Documents (needs LangChain + Vector Store)
- 🚧 Learning Path Suggestions (basic version working)

## 🔧 Advanced Setup (AI Services)

To enable full AI functionality, you need to set up additional dependencies:

### LangChain Setup
```bash
pip install langchain langchain-community langchain-core chromadb sentence-transformers
```

### Ollama Setup (Optional - for local LLM)
1. Install Ollama: https://ollama.ai/
2. Pull a model:
```bash
ollama pull llama2
```

## 📝 Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./ai_microservices.db
REACT_APP_API_URL=http://localhost:8000
```

## 🐳 Docker Setup (Alternative)

```bash
docker-compose up --build
```

## 📋 Project Structure

```
AIMLassignment/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── utils/          # API and auth utilities
├── services/               # Backend microservices
│   ├── auth/              # Authentication service
│   ├── text-summarization/ # Text summarization API
│   ├── qa-documents/      # Document Q&A API
│   └── learning-path/     # Learning path suggestions
├── main.py                # Main FastAPI application
├── start.bat             # Windows startup script
├── start.sh              # Linux/Mac startup script
└── README.md             # Project documentation
```

## 🎨 UI Features

- **Mobile-First Design**: Optimized for mobile devices
- **Responsive Layout**: Works on desktop and mobile
- **Modern UI**: Gradient backgrounds, smooth animations
- **Dark Theme**: Beautiful dark color scheme
- **Interactive Elements**: Hover effects, loading states

## 🔐 Authentication Flow

1. User visits the application
2. Redirected to login page if not authenticated
3. User can login or register
4. JWT token stored in localStorage
5. Protected routes accessible after authentication
6. Token automatically included in API requests

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**:
   - Frontend (3000): `npx kill-port 3000`
   - Backend (8000): `npx kill-port 8000`

2. **Python dependencies issues**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Node.js dependencies issues**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Database issues**:
   - Delete `ai_microservices.db` and restart
   - Run `python create_demo_user.py` again

### Quote/Escape Character Issues in Frontend

If you encounter Unicode escape sequence errors, the issue is with quote characters in JSX. This is a known issue that can be resolved by:

1. Recreating the affected files with proper quotes
2. Using single quotes instead of double quotes in JSX attributes
3. Running the application with backend-only mode for testing authentication

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API documentation at http://localhost:8000/docs
3. Check browser console for error messages
4. Verify all required dependencies are installed

## 🎉 Next Steps

1. Test the authentication system
2. Explore the API documentation
3. Set up AI services for full functionality
4. Customize the UI and add new features
5. Deploy to production environment

---

**Note**: This application is a development prototype. For production use, additional security measures, error handling, and optimizations should be implemented.
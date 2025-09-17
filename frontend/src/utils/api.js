import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  
  login: (credentials) => api.post('/auth/login-json', credentials),
  
  getProfile: () => api.get('/auth/me'),
  
  updateProfile: (userData) => api.put('/auth/me', userData),
  
  logout: () => api.post('/auth/logout')
};

// AI Services API functions
export const aiAPI = {
  // Text Summarization
  summarizeText: (data) => api.post('/summarize/text', data),
  
  summarizeDocument: (formData) => api.post('/summarize/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Q&A Documents
  uploadDocument: (formData) => api.post('/qa/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  askQuestion: (data) => api.post('/qa/ask', data),
  
  getDocuments: () => api.get('/qa/documents'),
  
  deleteDocument: (documentId) => api.delete(`/qa/documents/${documentId}`),
  
  // Learning Path
  suggestLearningPath: (data) => api.post('/learning/suggest', data),
  
  suggestSimplePath: (subject, skillLevel = 'beginner') => 
    api.post(`/learning/suggest-simple?subject=${encodeURIComponent(subject)}&skill_level=${skillLevel}`),
  
  getAvailableSubjects: () => api.get('/learning/subjects')
};

// Health check
export const healthAPI = {
  checkHealth: () => api.get('/health'),
  checkAuthHealth: () => api.get('/auth/health'),
  checkSummarizationHealth: () => api.get('/summarize/health'),
  checkQAHealth: () => api.get('/qa/health'),
  checkLearningHealth: () => api.get('/learning/health')
};

export default api;
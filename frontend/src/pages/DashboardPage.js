import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiLogOut, 
  FiFileText, 
  FiMessageSquare, 
  FiBookOpen, 
  FiMenu, 
  FiX,
  FiUpload,
  FiSend,
  FiDownload,
  FiTrash2,
  FiSettings,
  FiActivity
} from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { aiAPI, healthAPI } from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const Header = styled.header`
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: clamp(14px, 3.5vw, 18px);
  color: #1e293b;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
  
  .logo-icon {
    width: clamp(24px, 6vw, 32px);
    height: clamp(24px, 6vw, 32px);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    @media (max-width: 480px) {
      display: none;
    }
    
    .name {
      font-weight: 600;
      color: #1e293b;
      font-size: clamp(12px, 2.5vw, 14px);
    }
    
    .email {
      font-size: clamp(10px, 2vw, 12px);
      color: #64748b;
    }
  }
  
  .logout-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: clamp(10px, 2vw, 12px);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    
    @media (max-width: 480px) {
      padding: 6px 8px;
      gap: 2px;
    }
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 16px;
  }
`;

const WelcomeCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 10px;
  }
  
  h2 {
    font-size: clamp(20px, 4vw, 24px);
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  
  p {
    color: #64748b;
    font-size: clamp(14px, 3vw, 16px);
    line-height: 1.4;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const ServiceCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
  
  .service-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .service-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }
    
    .service-info {
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 4px;
      }
      
      p {
        font-size: 14px;
        color: #64748b;
      }
    }
  }
  
  .service-content {
    margin-top: 16px;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }
  
  &.dragover {
    border-color: #667eea;
    background: #eff6ff;
  }
  
  .upload-icon {
    font-size: 32px;
    color: #94a3b8;
    margin-bottom: 8px;
  }
  
  p {
    color: #64748b;
    font-size: 14px;
  }
  
  input {
    display: none;
  }
`;

const ResultArea = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  min-height: 100px;
  
  .result-header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 12px;
    
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
  }
  
  .result-content {
    color: #4b5563;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  
  .empty-state {
    text-align: center;
    color: #9ca3af;
    font-style: italic;
  }
`;

const TabButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  
  button {
    padding: 8px 16px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
    
    &:hover:not(.active) {
      background: #f8fafc;
    }
  }
`;

const DocumentsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin: 16px 0;
  
  .document-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
    
    .doc-info {
      font-size: 14px;
      color: #374151;
    }
    
    .doc-actions {
      display: flex;
      gap: 8px;
      
      button {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: #64748b;
        
        &:hover {
          color: #ef4444;
        }
      }
    }
  }
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.healthy ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.healthy ? '#166534' : '#dc2626'};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeService, setActiveService] = useState('summarization');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [healthStatus, setHealthStatus] = useState({});
  
  // Form states
  const [textInput, setTextInput] = useState('');
  const [question, setQuestion] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [learningSubject, setLearningSubject] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  
  // Check health status on mount
  useEffect(() => {
    checkHealthStatus();
    loadUploadedDocuments();
  }, []);
  
  const checkHealthStatus = async () => {
    try {
      const [main, auth, summarization, qa, learning] = await Promise.allSettled([
        healthAPI.checkHealth(),
        healthAPI.checkAuthHealth(),
        healthAPI.checkSummarizationHealth(),
        healthAPI.checkQAHealth(),
        healthAPI.checkLearningHealth()
      ]);
      
      setHealthStatus({
        main: main.status === 'fulfilled',
        auth: auth.status === 'fulfilled',
        summarization: summarization.status === 'fulfilled',
        qa: qa.status === 'fulfilled',
        learning: learning.status === 'fulfilled'
      });
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };
  
  const loadUploadedDocuments = async () => {
    try {
      const response = await aiAPI.getDocuments();
      if (response.data.success) {
        setUploadedDocuments(response.data.documents || []);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const handleTextSummarization = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }
    
    setLoading(true);
    try {
      const response = await aiAPI.summarizeText({
        text: textInput,
        summary_type: 'concise'
      });
      
      setResults(prev => ({
        ...prev,
        summarization: response.data.summary
      }));
      
      toast.success('Text summarized successfully!');
    } catch (error) {
      toast.error('Failed to summarize text. Please try again.');
      console.error('Summarization error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDocumentUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const response = await aiAPI.uploadDocument(formData);
      
      if (response.data.success) {
        toast.success(`Document "${response.data.filename}" uploaded successfully!`);
        loadUploadedDocuments();
      }
    } catch (error) {
      toast.error('Failed to upload document. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuestionSubmit = async () => {
    if (!selectedDocument || !question.trim()) {
      toast.error('Please select a document and enter a question');
      return;
    }
    
    setLoading(true);
    try {
      const response = await aiAPI.askQuestion({
        document_id: selectedDocument,
        question: question
      });
      
      setResults(prev => ({
        ...prev,
        qa: {
          question,
          answer: response.data.answer,
          confidence: response.data.confidence,
          sources: response.data.source_documents
        }
      }));
      
      toast.success('Question answered successfully!');
    } catch (error) {
      toast.error('Failed to answer question. Please try again.');
      console.error('Q&A error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLearningPathSuggestion = async () => {
    if (!learningSubject.trim()) {
      toast.error('Please enter a subject to learn');
      return;
    }
    
    setLoading(true);
    try {
      const response = await aiAPI.suggestSimplePath(learningSubject, skillLevel);
      
      setResults(prev => ({
        ...prev,
        learning: {
          subject: learningSubject,
          path: response.data.personalized_path,
          phases: response.data.phases,
          timeline: response.data.estimated_timeline
        }
      }));
      
      toast.success('Learning path generated successfully!');
    } catch (error) {
      toast.error('Failed to generate learning path. Please try again.');
      console.error('Learning path error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleDocumentUpload(file);
    }
  };
  
  const deleteDocument = async (documentId) => {
    try {
      await aiAPI.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      loadUploadedDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
      console.error('Delete error:', error);
    }
  };
  
  const renderServiceContent = () => {
    switch (activeService) {
      case 'summarization':
        return (
          <ServiceCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="service-header">
              <div className="service-icon">
                <FiFileText />
              </div>
              <div className="service-info">
                <h3>Text Summarization</h3>
                <p>Summarize long texts and documents with AI</p>
              </div>
            </div>
            
            <StatusIndicator healthy={healthStatus.summarization}>
              <div className="status-dot" />
              {healthStatus.summarization ? 'Service Online' : 'Service Offline'}
            </StatusIndicator>
            
            <div className="service-content">
              <Input
                label="Text to Summarize"
                as="textarea"
                rows={6}
                placeholder="Enter or paste the text you want to summarize..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              
              <Button
                onClick={handleTextSummarization}
                loading={loading}
                disabled={!textInput.trim()}
              >
                <FiFileText /> Summarize Text
              </Button>
              
              <FileUploadArea>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  <FiUpload className="upload-icon" />
                  <p>Upload document (PDF, DOCX, TXT)</p>
                </label>
              </FileUploadArea>
              
              <ResultArea>
                <div className="result-header">
                  <h4>Summary Result</h4>
                </div>
                <div className="result-content">
                  {results.summarization ? (
                    results.summarization
                  ) : (
                    <div className="empty-state">Summary will appear here...</div>
                  )}
                </div>
              </ResultArea>
            </div>
          </ServiceCard>
        );
        
      case 'qa':
        return (
          <ServiceCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="service-header">
              <div className="service-icon">
                <FiMessageSquare />
              </div>
              <div className="service-info">
                <h3>Q&A over Documents</h3>
                <p>Ask questions about your uploaded documents</p>
              </div>
            </div>
            
            <StatusIndicator healthy={healthStatus.qa}>
              <div className="status-dot" />
              {healthStatus.qa ? 'Service Online' : 'Service Offline'}
            </StatusIndicator>
            
            <div className="service-content">
              <FileUploadArea>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  id="qa-file-upload"
                />
                <label htmlFor="qa-file-upload" style={{ cursor: 'pointer' }}>
                  <FiUpload className="upload-icon" />
                  <p>Upload document for Q&A (PDF, DOCX, TXT)</p>
                </label>
              </FileUploadArea>
              
              {uploadedDocuments.length > 0 && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Select Document
                  </label>
                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}
                  >
                    <option value="">Choose a document...</option>
                    {uploadedDocuments.map((doc, index) => (
                      <option key={doc} value={doc}>
                        Document {index + 1} (ID: {doc.substring(0, 8)}...)
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <DocumentsList>
                {uploadedDocuments.map((doc, index) => (
                  <div key={doc} className="document-item">
                    <div className="doc-info">
                      Document {index + 1} (ID: {doc.substring(0, 8)}...)
                    </div>
                    <div className="doc-actions">
                      <button onClick={() => deleteDocument(doc)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </DocumentsList>
              
              <Input
                label="Your Question"
                placeholder="Ask a question about the selected document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              
              <Button
                onClick={handleQuestionSubmit}
                loading={loading}
                disabled={!selectedDocument || !question.trim()}
              >
                <FiSend /> Ask Question
              </Button>
              
              <ResultArea>
                <div className="result-header">
                  <h4>Answer</h4>
                </div>
                <div className="result-content">
                  {results.qa ? (
                    <div>
                      <p><strong>Q:</strong> {results.qa.question}</p>
                      <p><strong>A:</strong> {results.qa.answer}</p>
                      <p><strong>Confidence:</strong> {(results.qa.confidence * 100).toFixed(1)}%</p>
                    </div>
                  ) : (
                    <div className="empty-state">Answer will appear here...</div>
                  )}
                </div>
              </ResultArea>
            </div>
          </ServiceCard>
        );
        
      case 'learning':
        return (
          <ServiceCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="service-header">
              <div className="service-icon">
                <FiBookOpen />
              </div>
              <div className="service-info">
                <h3>Learning Path Suggestions</h3>
                <p>Get personalized learning recommendations</p>
              </div>
            </div>
            
            <StatusIndicator healthy={healthStatus.learning}>
              <div className="status-dot" />
              {healthStatus.learning ? 'Service Online' : 'Service Offline'}
            </StatusIndicator>
            
            <div className="service-content">
              <Input
                label="Subject to Learn"
                placeholder="e.g., Python, Web Development, Machine Learning..."
                value={learningSubject}
                onChange={(e) => setLearningSubject(e.target.value)}
              />
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Current Skill Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <Button
                onClick={handleLearningPathSuggestion}
                loading={loading}
                disabled={!learningSubject.trim()}
              >
                <FiBookOpen /> Generate Learning Path
              </Button>
              
              <ResultArea>
                <div className="result-header">
                  <h4>Learning Path</h4>
                </div>
                <div className="result-content">
                  {results.learning ? (
                    <div>
                      <h4>📚 Learning Path for {results.learning.subject}</h4>
                      <p><strong>Timeline:</strong> {results.learning.timeline}</p>
                      <br />
                      {results.learning.phases?.map((phase, index) => (
                        <div key={index} style={{ marginBottom: '16px' }}>
                          <h5>Phase {phase.phase}: {phase.title}</h5>
                          <p>{phase.description}</p>
                          <p><strong>Duration:</strong> {phase.duration}</p>
                          <ul>
                            {phase.learning_objectives?.map((objective, idx) => (
                              <li key={idx}>{objective}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">Learning path will appear here...</div>
                  )}
                </div>
              </ResultArea>
            </div>
          </ServiceCard>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <DashboardContainer>
      <Header>
        <Logo>
          <div className="logo-icon">
            <FiActivity />
          </div>
          Smart Flow
        </Logo>
        <UserSection>
          <div className="user-info">
            <div className="name">{user?.full_name}</div>
            <div className="email">{user?.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </UserSection>
      </Header>
      
      <MainContent>
        <WelcomeCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Welcome to Smart Flow, {user?.full_name?.split(' ')[0]}! 👋</h2>
          <p>Experience intelligent workflow management with our AI-powered platform.</p>
        </WelcomeCard>
        
        <TabButtons>
          <button 
            className={activeService === 'summarization' ? 'active' : ''}
            onClick={() => setActiveService('summarization')}
          >
            <FiFileText /> Text Summarization
          </button>
          <button 
            className={activeService === 'qa' ? 'active' : ''}
            onClick={() => setActiveService('qa')}
          >
            <FiMessageSquare /> Q&A Documents
          </button>
          <button 
            className={activeService === 'learning' ? 'active' : ''}
            onClick={() => setActiveService('learning')}
          >
            <FiBookOpen /> Learning Path
          </button>
        </TabButtons>
        
        <AnimatePresence mode="wait">
          {renderServiceContent()}
        </AnimatePresence>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardPage;
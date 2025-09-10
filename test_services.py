"""
Test script for AI Microservices
"""
import requests
import time

# Service URLs
MAIN_URL = "http://localhost:8000"
TEXT_SUMMARIZATION_URL = "http://localhost:8001"
QA_DOCUMENTS_URL = "http://localhost:8002"
LEARNING_PATH_URL = "http://localhost:8003"

def test_main_service():
    """Test the main service"""
    print("Testing Main Service...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{MAIN_URL}/")
        print(f"Root endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing main service root: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{MAIN_URL}/health")
        print(f"Health endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing main service health: {e}")

def test_text_summarization_service():
    """Test the text summarization service"""
    print("\nTesting Text Summarization Service...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{TEXT_SUMMARIZATION_URL}/")
        print(f"Root endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing text summarization service root: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{TEXT_SUMMARIZATION_URL}/health")
        print(f"Health endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing text summarization service health: {e}")

def test_qa_documents_service():
    """Test the Q&A documents service"""
    print("\nTesting Q&A Documents Service...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{QA_DOCUMENTS_URL}/")
        print(f"Root endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing Q&A documents service root: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{QA_DOCUMENTS_URL}/health")
        print(f"Health endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing Q&A documents service health: {e}")

def test_learning_path_service():
    """Test the learning path suggestion service"""
    print("\nTesting Learning Path Suggestion Service...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{LEARNING_PATH_URL}/")
        print(f"Root endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing learning path service root: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{LEARNING_PATH_URL}/health")
        print(f"Health endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing learning path service health: {e}")

def main():
    """Main test function"""
    print("Starting AI Microservices Tests...")
    print("=" * 50)
    
    # Wait a moment for services to start
    time.sleep(2)
    
    # Test each service
    test_main_service()
    test_text_summarization_service()
    test_qa_documents_service()
    test_learning_path_service()
    
    print("\n" + "=" * 50)
    print("Tests completed!")

if __name__ == "__main__":
    main()
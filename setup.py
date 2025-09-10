"""
Setup script for AI Microservices with Flowise + LangChain Assignment
"""
import os
import subprocess
import sys

def check_python_version():
    """Check if Python 3.8+ is installed"""
    if sys.version_info < (3, 8):
        print("Python 3.8 or higher is required.")
        return False
    return True

def install_requirements():
    """Install Python requirements"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Python requirements installed successfully.")
        return True
    except subprocess.CalledProcessError:
        print("Failed to install Python requirements.")
        return False

def check_node_installed():
    """Check if Node.js is installed"""
    try:
        subprocess.check_output(["node", "--version"])
        print("Node.js is installed.")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Node.js is not installed. Please install Node.js to use Flowise.")
        return False

def install_flowise():
    """Install Flowise globally"""
    try:
        subprocess.check_call(["npm", "install", "-g", "flowise"])
        print("Flowise installed successfully.")
        return True
    except subprocess.CalledProcessError:
        print("Failed to install Flowise. Please install it manually.")
        return False

def create_uploads_directory():
    """Create uploads directory for document processing"""
    uploads_dir = os.path.join(os.getcwd(), "uploads")
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)
        print("Created uploads directory.")
    else:
        print("Uploads directory already exists.")

def main():
    print("Setting up AI Microservices environment...")
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install Python requirements
    if not install_requirements():
        sys.exit(1)
    
    # Check Node.js installation
    if not check_node_installed():
        print("Warning: Some features may not work without Node.js.")
    
    # Install Flowise
    install_flowise()
    
    # Create necessary directories
    create_uploads_directory()
    
    print("\nSetup completed!")
    print("\nNext steps:")
    print("1. Activate your virtual environment:")
    print("   - Windows: venv\\Scripts\\activate")
    print("   - macOS/Linux: source venv/bin/activate")
    print("2. Copy .env.example to .env and configure your environment variables")
    print("3. Start Flowise: npx flowise start")
    print("4. Run individual services as needed")

if __name__ == "__main__":
    main()
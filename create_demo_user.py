"""
Demo user creation script for testing the authentication system
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))

from services.auth.database import create_tables, get_db
from services.auth.crud import create_user
from services.auth import schemas

def create_demo_user():
    """Create a demo user for testing purposes"""
    create_tables()
    
    db = next(get_db())
    
    # Check if demo user already exists
    from services.auth.crud import get_user_by_email
    existing_user = get_user_by_email(db, "demo@example.com")
    
    if existing_user:
        print("Demo user already exists!")
        print(f"Email: demo@example.com")
        print(f"Username: demo") 
        print(f"Password: demo123")
        return
    
    # Create demo user
    demo_user = schemas.UserCreate(
        email="demo@example.com",
        username="demo",
        full_name="Demo User",
        password="demo123"
    )
    
    try:
        user = create_user(db, demo_user)
        print("Demo user created successfully!")
        print(f"ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Username: {user.username}")
        print(f"Full Name: {user.full_name}")
        print(f"Password: demo123")
    except Exception as e:
        print(f"Error creating demo user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_user()
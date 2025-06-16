from app.database.database import SessionLocal
from app.models.models import User

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        
        print(f"Found {len(users)} users in the database:")
        for user in users:
            print(f"- User: {user.username} (Email: {user.email}, Admin: {user.is_admin})")
            
    except Exception as e:
        print(f"Error checking users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users() 
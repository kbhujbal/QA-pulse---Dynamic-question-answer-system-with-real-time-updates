from app.database.database import SessionLocal
from app.models.models import Question

def check_database():
    db = SessionLocal()
    try:
        questions = db.query(Question).all()
        print(f"Found {len(questions)} questions in the database:")
        for q in questions:
            print(f"ID: {q.id}, Content: {q.content}, Status: {q.status}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database() 
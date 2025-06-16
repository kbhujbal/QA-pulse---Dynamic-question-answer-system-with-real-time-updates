from app.database.database import SessionLocal
from app.models.models import Question, Answer

def check_database():
    db = SessionLocal()
    try:
        questions = db.query(Question).all()
        answers = db.query(Answer).all()
        
        print(f"Found {len(questions)} questions in the database:")
        for q in questions:
            print(f"- Question {q.id}: {q.content}")
            
        print(f"\nFound {len(answers)} answers in the database:")
        for a in answers:
            print(f"- Answer {a.id} for Question {a.question_id}: {a.content}")
            
    except Exception as e:
        print(f"Error checking database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database() 
from app.database.database import SessionLocal
from app.models.models import Answer

def check_answers():
    db = SessionLocal()
    try:
        answers = db.query(Answer).all()
        print(f"Number of answers in database: {len(answers)}")
        if len(answers) > 0:
            print("\nExisting answers:")
            for answer in answers:
                print(f"Answer ID: {answer.id}, Content: {answer.content[:50]}...")
    finally:
        db.close()

if __name__ == "__main__":
    check_answers() 
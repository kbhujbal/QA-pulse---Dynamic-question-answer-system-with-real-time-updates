from app.database.database import SessionLocal
from app.models.models import Question, Answer

def delete_all_data():
    db = SessionLocal()
    try:
        # Delete all answers first
        db.query(Answer).delete()
        # Then delete all questions
        db.query(Question).delete()
        db.commit()
        print("All questions and answers deleted successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    delete_all_data() 
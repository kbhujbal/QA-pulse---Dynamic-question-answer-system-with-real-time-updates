from app.database.database import SessionLocal
from app.models.models import Question, Answer

def delete_all_data():
    db = SessionLocal()
    try:
        # Delete all answers first (due to foreign key constraints)
        db.query(Answer).delete()
        # Delete all questions
        db.query(Question).delete()
        db.commit()
        print("All questions and answers deleted successfully.")
    except Exception as e:
        print(f"Error deleting data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    delete_all_data() 
from app.database.database import SessionLocal
from app.models.models import Question

def delete_all_questions():
    db = SessionLocal()
    try:
        db.query(Question).delete()
        db.commit()
        print("All questions deleted successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    delete_all_questions() 
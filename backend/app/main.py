from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime, timedelta

from .database.database import get_db, engine
from .models.models import Base, Question, User, Answer
from .schemas import (
    UserCreate, Token, User as UserSchema,
    QuestionCreate, Question as QuestionSchema,
    AnswerCreate, Answer as AnswerSchema
)
from .auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user_optional
from .rag.suggestions import get_suggested_answers


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str, exclude: Optional[WebSocket] = None):
        for connection in self.active_connections:
            if connection != exclude:  # Don't send back to the sender
                try:
                    await connection.send_text(message)
                except Exception as e:
                    print(f"Error broadcasting message: {e}")

manager = ConnectionManager()

@app.post("/signup", response_model=UserSchema)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = User.get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        is_admin=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not User.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/questions/", response_model=QuestionSchema)
async def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    if not question.content.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    db_question = Question(content=question.content)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    await manager.broadcast(json.dumps({
        "type": "new_question",
        "question": {
            "id": db_question.id,
            "content": db_question.content,
            "timestamp": db_question.timestamp.isoformat(),
            "status": db_question.status
        }
    }))
    
    return db_question

@app.get("/questions/", response_model=List[QuestionSchema])
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    
    sorted_questions = sorted(questions, key=lambda q: (
        q.status != "Escalated", 
        q.status == "Answered",   
        -q.timestamp.timestamp()  
    ))
    
    return sorted_questions

@app.post("/questions/{question_id}/answers", response_model=AnswerSchema)
async def create_answer(
    question_id: int,
    answer: AnswerCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    if not answer.content.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty")
    
    db_answer = Answer(
        content=answer.content,
        question_id=question_id,
        user_id=current_user.id if current_user else None
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    
    username = None
    if current_user:
        username = current_user.username
    
    await manager.broadcast(json.dumps({
        "type": "new_answer",
        "answer": {
            "id": db_answer.id,
            "content": db_answer.content,
            "timestamp": db_answer.timestamp.isoformat(),
            "username": username,
            "question_id": question_id
        }
    }))
    
    response_answer = AnswerSchema(
        id=db_answer.id,
        content=db_answer.content,
        timestamp=db_answer.timestamp,
        user_id=db_answer.user_id,
        username=username
    )
    
    return response_answer

@app.put("/questions/{question_id}/status")
async def update_question_status(
    question_id: int,
    status_update: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can update question status")
    
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    new_status = status_update.get("status")
    if new_status not in ["Pending", "Escalated", "Answered"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    question.status = new_status
    db.commit()
    db.refresh(question)
    
    await manager.broadcast(json.dumps({
        "type": "question_updated",
        "question": {
            "id": question.id,
            "content": question.content,
            "timestamp": question.timestamp.isoformat(),
            "status": question.status
        }
    }))
    
    return question

@app.get("/questions/{question_id}/suggestions")
async def get_answer_suggestions(
    question_id: int,
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    suggestions = get_suggested_answers(question.content)
    return {"suggestions": suggestions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
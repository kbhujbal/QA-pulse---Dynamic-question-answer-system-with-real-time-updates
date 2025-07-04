# QA-pulse - Dynamic Question-Answer System with Real-time Updates

A modern, real-time Q&A platform built with FastAPI and Next.js that enables dynamic question-answer interactions with live updates, user authentication, and admin management capabilities.

## 🚀 Features

### Core Functionality
- **Real-time Q&A**: Ask questions and get instant answers with live updates
- **WebSocket Integration**: Real-time communication for instant notifications
- **User Authentication**: Secure login/signup system with JWT tokens
- **Admin Panel**: Manage questions, update statuses, and moderate content
- **Guest Mode**: Allow anonymous users to participate
- **Smart Sorting**: Questions automatically sorted by priority and status

### Question Management
- **Status Tracking**: Questions can be marked as Pending, Escalated, or Answered
- **Priority Sorting**: Escalated questions appear first, followed by pending, then answered
- **Real-time Updates**: All users see new questions and answers instantly
- **Answer Suggestions**: AI-powered answer suggestions for questions

### User Experience
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Notifications**: Instant updates when new questions/answers are posted
- **Clean Interface**: Intuitive dashboard for easy navigation
- **Mobile Friendly**: Optimized for all device sizes

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **WebSockets** - Real-time bidirectional communication
- **JWT Authentication** - Secure token-based authentication
- **SQLite** - Lightweight database for development
- **Pydantic** - Data validation using Python type annotations

### Frontend
- **Next.js 15** - React framework for production
- **React 19** - Modern React with latest features
- **Tailwind CSS** - Utility-first CSS framework
- **WebSocket Client** - Real-time frontend communication

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/QA-pulse---Dynamic-question-answer-system-with-real-time-updates.git
cd QA-pulse---Dynamic-question-answer-system-with-real-time-updates
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📖 Usage

### Getting Started

1. **Access the Application**: Open `http://localhost:3000` in your browser
2. **Authentication**: 
   - Sign up for a new account, or
   - Log in with existing credentials, or
   - Use guest mode for anonymous participation
3. **Ask Questions**: Use the question form to post new questions
4. **Answer Questions**: Provide answers to questions in real-time
5. **Admin Features**: If you're an admin, you can update question statuses

### User Roles

#### Regular User
- Ask questions
- Provide answers
- View all questions and answers
- Real-time updates

#### Admin User
- All regular user features
- Update question statuses (Pending → Escalated → Answered)
- Moderate content
- Manage the Q&A flow

#### Guest User
- Ask questions anonymously
- Provide answers anonymously
- View all content
- No persistent account

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /token` - Login and get JWT token

### Questions
- `GET /questions/` - Get all questions (sorted by priority)
- `POST /questions/` - Create a new question
- `PUT /questions/{question_id}/status` - Update question status (admin only)
- `GET /questions/{question_id}/suggestions` - Get AI-powered answer suggestions

### Answers
- `POST /questions/{question_id}/answers` - Add an answer to a question

### WebSocket
- `WS /ws` - Real-time communication endpoint

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# JWT Settings
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./qa_app.db

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000
```

### Database

The application uses SQLite by default. The database file (`qa_app.db`) will be created automatically when you first run the application.

## 🏗️ Project Structure

```
QA-pulse/
├── backend/
│   ├── app/
│   │   ├── auth.py              # Authentication logic
│   │   ├── main.py              # FastAPI application
│   │   ├── models/
│   │   │   └── models.py        # Database models
│   │   ├── database/
│   │   │   └── database.py      # Database configuration
│   │   ├── rag/
│   │   │   ├── llm_wrapper.py   # AI integration
│   │   │   └── suggestions.py   # Answer suggestions
│   │   └── schemas.py           # Pydantic schemas
│   ├── requirements.txt         # Python dependencies
│   └── venv/                    # Virtual environment
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── QuestionForm.js      # Question input form
│   │   │   ├── QuestionList.js      # Questions display
│   │   │   ├── AnswerForm.js        # Answer input form
│   │   │   └── auth/
│   │   │       ├── AuthWrapper.js   # Authentication wrapper
│   │   │       ├── Login.js         # Login component
│   │   │       └── SignUp.js        # Signup component
│   │   ├── layout.js            # Root layout
│   │   ├── page.js              # Main page
│   │   └── globals.css          # Global styles
│   ├── package.json             # Node.js dependencies
│   └── next.config.js           # Next.js configuration
└── README.md                    # This file
```

## 🚀 Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Create Procfile in backend directory
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy to Heroku
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/QA-pulse---Dynamic-question-answer-system-with-real-time-updates/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🔮 Future Enhancements

- [ ] Email notifications for new questions/answers
- [ ] Rich text editor for questions and answers
- [ ] File attachments support
- [ ] Search and filtering capabilities
- [ ] User reputation system
- [ ] Categories and tags for questions
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

## 🙏 Acknowledgments

- FastAPI community for the excellent framework
- Next.js team for the amazing React framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

---

**Made with ❤️ for the developer community** 

from typing import List, Dict
from .llm_wrapper import LLMWrapper

KNOWLEDGE_BASE = [
    {
        "question": "What is Python?",
        "answer": "Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, AI, and automation."
    },
    {
        "question": "How do I install Python packages?",
        "answer": "You can install Python packages using pip, Python's package installer. The basic command is 'pip install package_name'. For example: 'pip install requests'."
    },
    {
        "question": "What is FastAPI?",
        "answer": "FastAPI is a modern, fast web framework for building APIs with Python. It's based on standard Python type hints and provides automatic API documentation."
    },
    {
        "question": "How do I handle errors in Python?",
        "answer": "In Python, you can handle errors using try-except blocks. The basic syntax is: try: # code that might raise an error except Exception as e: # handle the error"
    },
    {
        "question": "What is SQLAlchemy?",
        "answer": "SQLAlchemy is a SQL toolkit and Object-Relational Mapping (ORM) library for Python. It provides a set of high-level API to communicate with relational databases."
    },
    {
        "question": "What is React?",
        "answer": "React is a JavaScript library for building user interfaces. It's maintained by Facebook and allows developers to create reusable UI components and manage application state efficiently."
    },
    {
        "question": "How do I create a React component?",
        "answer": "You can create a React component using either function or class syntax. For a function component: function MyComponent() { return <div>Hello World</div>; }"
    },
    {
        "question": "What is REST API?",
        "answer": "REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources."
    },
    {
        "question": "What is a database?",
        "answer": "A database is an organized collection of structured information or data, typically stored electronically in a computer system. It's managed by a database management system (DBMS)."
    },
    {
        "question": "What is SQL?",
        "answer": "SQL (Structured Query Language) is a standard language for storing, manipulating, and retrieving data in relational databases. It's used to communicate with databases."
    },
    {
        "question": "What is Git?",
        "answer": "Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work on the same codebase efficiently."
    },
    {
        "question": "What is Docker?",
        "answer": "Docker is a platform for developing, shipping, and running applications in containers. It helps ensure that applications work consistently across different environments."
    }
]

llm_wrapper = LLMWrapper()

def calculate_similarity(str1: str, str2: str) -> float:
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()

def get_suggested_answers(question: str, num_suggestions: int = 3) -> List[Dict[str, str]]:
    return llm_wrapper.generate_suggestions(question, num_suggestions) 
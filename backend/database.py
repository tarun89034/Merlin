from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database URL - using SQLite for simplicity (can be changed to PostgreSQL later)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./eduvision_ai.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    file_path = Column(String(500))
    content = Column(Text)
    user_id = Column(Integer, index=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    file_size = Column(Integer)
    file_type = Column(String(50))

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    document_id = Column(Integer, index=True, nullable=True)
    question = Column(Text)
    answer = Column(Text)
    confidence_score = Column(Float)
    service_type = Column(String(50))  # 'document-qa', 'visual-qa', 'summarization', etc.
    created_at = Column(DateTime, default=datetime.utcnow)

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    service_type = Column(String(50))
    user_id = Column(Integer, index=True, nullable=True)
    processing_time = Column(Float)
    success = Column(Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
def init_db():
    create_tables()
    print("Database initialized successfully!")

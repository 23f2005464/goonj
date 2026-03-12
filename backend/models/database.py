from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./goonj2026.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    enrollment= Column(String(20), nullable=False)  # New field for enrollment number
    department = Column(String(200), nullable=False)
    year = Column(String(50), nullable=False)
    event_interest = Column(String(500), nullable=True)
    qr_code = Column(String(100), unique=True, index=True, nullable=True)
    status = Column(String(20), default="pending")  
    is_attended = Column(Boolean, default=False)
    attended_at = Column(DateTime, nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)
    email_sent = Column(Boolean, default=False)


class Performance(Base):
    __tablename__ = "performances"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    performer = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)  # dance, music, drama, etc.
    year = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    duration = Column(String(50), nullable=True)
    award = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)

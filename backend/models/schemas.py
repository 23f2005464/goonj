from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class RegistrationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    enrollment: str
    department: str
    year: str
    event_interest: Optional[str] = None

class RegistrationResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    department: str
    enrollment: str
    year: str
    event_interest: Optional[str]

    status: str   # NEW FIELD

    qr_code: Optional[str]
    is_attended: bool
    attended_at: Optional[datetime]
    registered_at: datetime
    email_sent: bool

    class Config:
        from_attributes = True


class RegistrationUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    event_interest: Optional[str] = None


class QRVerifyRequest(BaseModel):
    qr_code: str


class QRVerifyResponse(BaseModel):
    success: bool
    message: str
    registration: Optional[RegistrationResponse] = None


class PerformanceCreate(BaseModel):
    title: str
    performer: str
    category: str
    year: int
    description: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    duration: Optional[str] = None
    award: Optional[str] = None


class PerformanceUpdate(BaseModel):
    title: Optional[str] = None
    performer: Optional[str] = None
    category: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    duration: Optional[str] = None
    award: Optional[str] = None


class PerformanceResponse(BaseModel):
    id: int
    title: str
    performer: str
    category: str
    year: int
    description: Optional[str]
    image_url: Optional[str]
    video_url: Optional[str]
    duration: Optional[str]
    award: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AdminLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class StatsResponse(BaseModel):
    total_registrations: int
    attended: int
    not_attended: int
    emails_sent: int

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, Registration
from models.schemas import RegistrationCreate, RegistrationResponse, QRVerifyRequest, QRVerifyResponse
from utils.qr_utils import generate_qr_token, generate_qr_image
from utils.email_utils import send_registration_email
from utils.auth import verify_token
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/registrations", tags=["registrations"])


@router.post("/", response_model=RegistrationResponse)
async def register(
    data: RegistrationCreate,
    db: Session = Depends(get_db)
):
    # Check existing email
    existing = db.query(Registration).filter(Registration.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create registration with pending status — email will be sent only after admin approval
    reg = Registration(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        enrollment=data.enrollment,
        department=data.department,
        year=data.year,
        event_interest=data.event_interest,
        qr_code=None,  # Will be generated on approval
        status="pending",
        email_sent=False
    )
    db.add(reg)
    db.commit()
    db.refresh(reg)

    return reg


@router.post("/verify-qr", response_model=QRVerifyResponse)
def verify_qr(data: QRVerifyRequest, db: Session = Depends(get_db)):
    reg = db.query(Registration).filter(Registration.qr_code == data.qr_code).first()

    if not reg:
        return QRVerifyResponse(success=False, message="Invalid QR code — not found in database")

    if reg.is_attended:
        return QRVerifyResponse(
            success=False,
            message=f"Already checked in at {reg.attended_at.strftime('%I:%M %p') if reg.attended_at else 'unknown time'}",
            registration=reg
        )

    reg.is_attended = True
    reg.attended_at = datetime.utcnow()
    db.commit()
    db.refresh(reg)

    return QRVerifyResponse(
        success=True,
        message=f"Welcome, {reg.full_name}! Entry confirmed ✓",
        registration=reg
    )

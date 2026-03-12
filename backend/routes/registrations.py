from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
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
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check existing email
    existing = db.query(Registration).filter(Registration.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    qr_token = generate_qr_token()
    generate_qr_image(qr_token, data.full_name)

    reg = Registration(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        enrollment=data.enrollment,
        department=data.department,
        year=data.year,
        event_interest=data.event_interest,
        qr_code=qr_token,
    )
    db.add(reg)
    db.commit()
    db.refresh(reg)

    # Send email in background
    background_tasks.add_task(
        send_and_update_email,
        reg.id,
        data.email,
        data.full_name,
        qr_token,
        db
    )

    return reg


async def send_and_update_email(reg_id: int, email: str, name: str, token: str, db: Session):
    sent = await send_registration_email(email, name, token)
    if sent:
        reg = db.query(Registration).filter(Registration.id == reg_id).first()
        if reg:
            reg.email_sent = True
            db.commit()


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

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, Registration, Performance
from models.schemas import (
    RegistrationResponse, RegistrationUpdate,
    PerformanceCreate, PerformanceUpdate, PerformanceResponse,
    AdminLogin, TokenResponse, StatsResponse
)
from utils.auth import verify_admin, create_access_token, verify_token
from utils.email_utils import send_registration_email
from utils.qr_utils import generate_qr_token
from typing import List
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=TokenResponse)
def login(data: AdminLogin):
    if not verify_admin(data.username, data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": data.username})
    return TokenResponse(access_token=token, token_type="bearer")


# ── Stats ──────────────────────────────────────────────────
@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db), _=Depends(verify_token)):
    total = db.query(Registration).count()
    attended = db.query(Registration).filter(Registration.is_attended == True).count()
    emails_sent = db.query(Registration).filter(Registration.email_sent == True).count()
    return StatsResponse(
        total_registrations=total,
        attended=attended,
        not_attended=total - attended,
        emails_sent=emails_sent
    )


# ── Registrations CRUD ──────────────────────────────────────
@router.get("/registrations", response_model=List[RegistrationResponse])
def list_registrations(
    skip: int = 0,
    limit: int = 1000,
    search: str = "",
    db: Session = Depends(get_db),
    _=Depends(verify_token)
):
    q = db.query(Registration)
    if search:
        q = q.filter(
            Registration.full_name.ilike(f"%{search}%") |
            Registration.email.ilike(f"%{search}%") |
            Registration.department.ilike(f"%{search}%")
        )
    return q.order_by(Registration.registered_at.desc()).offset(skip).limit(limit).all()


@router.get("/registrations/{reg_id}", response_model=RegistrationResponse)
def get_registration(reg_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    reg = db.query(Registration).filter(Registration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    return reg


@router.put("/registrations/{reg_id}", response_model=RegistrationResponse)
def update_registration(
    reg_id: int,
    data: RegistrationUpdate,
    db: Session = Depends(get_db),
    _=Depends(verify_token)
):
    reg = db.query(Registration).filter(Registration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reg, field, value)

    db.commit()
    db.refresh(reg)
    return reg


@router.get("/registrations/pending", response_model=List[RegistrationResponse])
def pending_registrations(db: Session = Depends(get_db), _=Depends(verify_token)):
    return db.query(Registration).filter(
        Registration.status == "pending"
    ).order_by(Registration.registered_at.desc()).all()


@router.post("/registrations/{reg_id}/approve")
async def approve_registration(
    reg_id: int,
    db: Session = Depends(get_db),
    _=Depends(verify_token)
):
    reg = db.query(Registration).filter(Registration.id == reg_id).first()

    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    if reg.status == "approved":
        return {"message": "Already approved"}

    # Generate QR token
    token = str(uuid4())
    reg.qr_code = token
    reg.status = "approved"

    # Send approval email with QR code
    await send_registration_email(reg.email, reg.full_name, token)
    reg.email_sent = True

    db.commit()
    db.refresh(reg)

    return {"message": "Registration approved and email sent", "registration": reg}


@router.post("/registrations/{reg_id}/reject")
def reject_registration(
    reg_id: int,
    db: Session = Depends(get_db),
    _=Depends(verify_token)
):
    reg = db.query(Registration).filter(Registration.id == reg_id).first()

    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    reg.status = "rejected"
    db.commit()

    return {"message": "Registration rejected"}


@router.delete("/registrations/{reg_id}")
def delete_registration(reg_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    reg = db.query(Registration).filter(Registration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    db.delete(reg)
    db.commit()
    return {"message": "Deleted successfully"}


@router.patch("/registrations/{reg_id}/attendance")
def toggle_attendance(reg_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    reg = db.query(Registration).filter(Registration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    reg.is_attended = not reg.is_attended
    reg.attended_at = datetime.utcnow() if reg.is_attended else None
    db.commit()
    db.refresh(reg)
    return reg


# ── Performances CRUD ──────────────────────────────────────
@router.get("/performances", response_model=List[PerformanceResponse])
def list_performances(db: Session = Depends(get_db), _=Depends(verify_token)):
    return db.query(Performance).order_by(Performance.year.desc()).all()


@router.post("/performances", response_model=PerformanceResponse)
def create_performance(data: PerformanceCreate, db: Session = Depends(get_db), _=Depends(verify_token)):
    perf = Performance(**data.model_dump())
    db.add(perf)
    db.commit()
    db.refresh(perf)
    return perf


@router.put("/performances/{perf_id}", response_model=PerformanceResponse)
def update_performance(
    perf_id: int,
    data: PerformanceUpdate,
    db: Session = Depends(get_db),
    _=Depends(verify_token)
):
    perf = db.query(Performance).filter(Performance.id == perf_id).first()
    if not perf:
        raise HTTPException(status_code=404, detail="Performance not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(perf, field, value)

    db.commit()
    db.refresh(perf)
    return perf


@router.delete("/performances/{perf_id}")
def delete_performance(perf_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    perf = db.query(Performance).filter(Performance.id == perf_id).first()
    if not perf:
        raise HTTPException(status_code=404, detail="Performance not found")
    db.delete(perf)
    db.commit()
    return {"message": "Deleted successfully"}

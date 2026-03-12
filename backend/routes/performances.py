from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.database import get_db, Performance
from models.schemas import PerformanceResponse
from typing import List

router = APIRouter(prefix="/api/performances", tags=["performances"])


@router.get("/", response_model=List[PerformanceResponse])
def list_performances(year: int = None, category: str = None, db: Session = Depends(get_db)):
    q = db.query(Performance)
    if year:
        q = q.filter(Performance.year == year)
    if category:
        q = q.filter(Performance.category.ilike(f"%{category}%"))
    return q.order_by(Performance.year.desc(), Performance.id.desc()).all()

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.shared.auth import get_current_user
from app.domains.auth.models import User
from app.domains.patients.service import PatientService
from app.domains.patients.schemas import PatientOut, PatientCreate

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.get("/", response_model=list[PatientOut])
def list_patients(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return PatientService(db).list_all()


@router.post("/", response_model=PatientOut)
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return PatientService(db).create(data, avaliador_id=current_user.id)

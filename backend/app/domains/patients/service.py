from sqlalchemy.orm import Session

from app.domains.patients.models import Patient
from app.domains.patients.schemas import PatientCreate


class PatientService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Patient]:
        return self.db.query(Patient).all()

    def create(self, data: PatientCreate, avaliador_id: int | None = None) -> Patient:
        patient = Patient(nome=data.nome, idade=data.idade, avaliador_id=avaliador_id)
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient

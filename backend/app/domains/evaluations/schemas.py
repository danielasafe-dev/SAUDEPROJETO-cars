from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EvaluationOut(BaseModel):
    id: int
    patientId: int
    patientNome: str
    avaliadorId: int
    avaliadorNome: str
    scoreTotal: float
    classificacao: str
    dataAvaliacao: Optional[str] = None

    class Config:
        from_attributes = True


class EvaluationCreate(BaseModel):
    patient_id: int
    respostas: dict[int, int]

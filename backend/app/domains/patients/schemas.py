from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PatientOut(BaseModel):
    id: int
    nome: str
    idade: Optional[int] = None
    avaliador_id: Optional[int] = None
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True


class PatientCreate(BaseModel):
    nome: str
    idade: Optional[int] = None

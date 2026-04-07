from pydantic import BaseModel
from typing import Optional


class PatientOut(BaseModel):
    id: int
    nome: str
    idade: Optional[int] = None
    avaliador_id: Optional[int] = None
    criado_em: Optional[str] = None

    class Config:
        from_attributes = True


class PatientCreate(BaseModel):
    nome: str
    idade: Optional[int] = None

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    nome: str
    email: str
    role: str
    ativo: bool
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    nome: str
    email: str
    password: str
    role: str = "avaliador"

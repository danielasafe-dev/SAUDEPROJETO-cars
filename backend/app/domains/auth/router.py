from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.shared.auth import get_current_user
from app.domains.auth.models import User
from app.domains.auth.service import AuthService
from app.domains.auth.schemas import LoginRequest, UserCreate, TokenResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.authenticate(data.email, data.password)
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    token = service.create_token(user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "role": user.role,
            "ativo": user.ativo,
            "criado_em": str(user.criado_em) if user.criado_em else None,
        },
    }


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/register")
def register(
    data: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_user),
):
    if admin.role != "admin":
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas admin pode criar usuários")
    user = AuthService(db).create_user(data.nome, data.email, data.password, data.role)
    return {
        "id": user.id,
        "nome": user.nome,
        "email": user.email,
        "role": user.role,
        "ativo": user.ativo,
    }

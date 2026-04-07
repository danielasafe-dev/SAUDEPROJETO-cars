from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.shared.auth import get_current_user, get_current_admin
from app.domains.auth.models import User
from app.domains.users.service import UserService
from app.domains.users.schemas import UserListOut, UserCreate

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/", response_model=list[UserListOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return UserService(db).list_users()


@router.post("/", response_model=UserListOut)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return UserService(db).create_user(data.nome, data.email, data.password, data.role)


@router.put("/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    success = UserService(db).deactivate(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"message": "Usuário desativado"}

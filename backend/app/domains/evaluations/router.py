from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.shared.auth import get_current_user, get_current_admin
from app.domains.auth.models import User
from app.domains.evaluations.service import EvaluationService
from app.domains.evaluations.schemas import EvaluationCreate

router = APIRouter(prefix="/api/evaluations", tags=["Evaluations"])


@router.get("/")
def list_evaluations(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return EvaluationService(db).list_all()


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return EvaluationService(db).get_stats()


# Must come before /{eval_id} route
@router.post("/")
def create_evaluation(
    data: EvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return EvaluationService(db).create(data, avaliador_id=current_user.id)


@router.get("/{eval_id}")
def get_evaluation(eval_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    result = EvaluationService(db).get_by_id(eval_id)
    if not result:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return result


@router.delete("/{eval_id}")
def delete_evaluation(
    eval_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    success = EvaluationService(db).delete(eval_id)
    if not success:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return {"message": "Avaliação deletada"}

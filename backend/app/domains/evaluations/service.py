import json
from typing import Any
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.domains.evaluations.models import Evaluation
from app.domains.evaluations.schemas import EvaluationCreate


def _map_eval(row: dict) -> dict:
    return {
        "id": row["id"],
        "patientId": row["patient_id"],
        "patientNome": row["patient_nome"],
        "avaliadorId": row["avaliador_id"],
        "avaliadorNome": row["avaliador_nome"],
        "scoreTotal": row["score_total"],
        "classificacao": row["classificacao"],
        "dataAvaliacao": row["data_avaliacao"],
        "respostas": json.loads(row["respostas"]) if isinstance(row["respostas"], str) else {},
    }


def calc_score(respostas: dict) -> float:
    return sum(respostas.values())


def classify(score: float) -> str:
    if score <= 29.5:
        return "Sem indicativo de TEA"
    if score < 37:
        return "TEA Leve a Moderado"
    return "TEA Grave"


class EvaluationService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[dict[str, Any]]:
        query = text("""
            SELECT
                e.id,
                e.patient_id,
                p.nome as patient_nome,
                e.avaliador_id,
                u.nome as avaliador_nome,
                CAST(e.score_total as float) as score_total,
                e.classificacao,
                FORMAT(e.data_avaliacao, 'yyyy-MM-ddTHH:mm:ss') as data_avaliacao,
                e.respostas
            FROM evaluations e
            INNER JOIN patients p ON p.id = e.patient_id
            INNER JOIN users u ON u.id = e.avaliador_id
            ORDER BY e.data_avaliacao DESC
        """)
        rows = self.db.execute(query).mappings().all()
        return [_map_eval(dict(r)) for r in rows]

    def get_by_id(self, eval_id: int) -> dict[str, Any] | None:
        query = text("""
            SELECT
                e.id,
                e.patient_id,
                p.nome as patient_nome,
                e.avaliador_id,
                u.nome as avaliador_nome,
                CAST(e.score_total as float) as score_total,
                e.classificacao,
                FORMAT(e.data_avaliacao, 'yyyy-MM-ddTHH:mm:ss') as data_avaliacao,
                e.respostas
            FROM evaluations e
            INNER JOIN patients p ON p.id = e.patient_id
            INNER JOIN users u ON u.id = e.avaliador_id
            WHERE e.id = :eval_id
        """)
        row = self.db.execute(query, {"eval_id": eval_id}).mappings().first()
        return _map_eval(dict(row)) if row else None

    def create(self, data: EvaluationCreate, avaliador_id: int) -> dict[str, Any]:
        score = calc_score(data.respostas)
        classificacao = classify(score)

        eval_obj = Evaluation(
            patient_id=data.patient_id,
            avaliador_id=avaliador_id,
            respostas=json.dumps(data.respostas),
            score_total=score,
            classificacao=classificacao,
        )
        self.db.add(eval_obj)
        self.db.commit()
        self.db.refresh(eval_obj)

        result = self.get_by_id(eval_obj.id)
        return result or {}

    def get_stats(self) -> dict[str, Any]:
        query = text("""
            SELECT
                COUNT(*) as total,
                ISNULL(AVG(CAST(score_total as float)), 0) as avg_score,
                SUM(CASE WHEN CAST(score_total as float) <= 29.5 THEN 1 ELSE 0 END) as sem_indicativo,
                SUM(CASE WHEN CAST(score_total as float) > 29.5 AND CAST(score_total as float) < 37 THEN 1 ELSE 0 END) as tea_leve,
                SUM(CASE WHEN CAST(score_total as float) >= 37 THEN 1 ELSE 0 END) as tea_grave
            FROM evaluations
        """)
        row = self.db.execute(query).mappings().first()
        if not row:
            return {"total": 0, "avg_score": 0, "sem_indicativo": 0, "tea_leve": 0, "tea_grave": 0}

        recent = self.list_all()[:5]

        return {
            "total": row["total"],
            "avg_score": round(float(row["avg_score"]), 1),
            "sem_indicativo": row["sem_indicativo"],
            "tea_leve": row["tea_leve"],
            "tea_grave": row["tea_grave"],
            "recent": recent,
        }

    def delete(self, eval_id: int) -> bool:
        ev = self.db.query(Evaluation).filter(Evaluation.id == eval_id).first()
        if not ev:
            return False
        self.db.delete(ev)
        self.db.commit()
        return True

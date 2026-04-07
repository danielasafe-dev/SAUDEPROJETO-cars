from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, TEXT
from sqlalchemy.sql import func
from app.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    avaliador_id = Column(Integer, ForeignKey("users.id"))
    respostas = Column(TEXT)  # JSON string
    score_total = Column(Numeric(5, 1))
    classificacao = Column(String(50))
    data_avaliacao = Column(DateTime, server_default=func.now())

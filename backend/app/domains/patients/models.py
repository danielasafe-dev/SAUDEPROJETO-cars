from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    idade = Column(Integer, nullable=True)
    avaliador_id = Column(Integer, ForeignKey("users.id"))
    criado_em = Column(DateTime, server_default=func.now())

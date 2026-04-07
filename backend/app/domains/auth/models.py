from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    senha_hash = Column(String(256), nullable=False)
    role = Column(String(20), nullable=False, default="avaliador")
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"

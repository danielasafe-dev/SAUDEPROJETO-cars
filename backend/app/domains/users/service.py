from sqlalchemy.orm import Session

from app.domains.auth.models import User
from app.domains.auth.service import AuthService


class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.auth = AuthService(db)

    def list_users(self) -> list[User]:
        return self.db.query(User).all()

    def create_user(self, nome: str, email: str, password: str, role: str = "avaliador") -> User:
        return self.auth.create_user(nome, email, password, role)

    def deactivate(self, user_id: int) -> bool:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        user.ativo = False
        self.db.commit()
        return True

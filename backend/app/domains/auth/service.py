from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.domains.auth.models import User
from app.shared.auth import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate(self, email: str, password: str) -> User | None:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not user.ativo:
            return None
        if not pwd_context.verify(password, user.senha_hash):
            return None
        return user

    def create_token(self, user: User) -> str:
        return create_access_token(user_id=user.id, role=user.role)

    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def create_user(self, nome: str, email: str, password: str, role: str = "avaliador") -> User:
        user = User(
            nome=nome,
            email=email,
            senha_hash=self.hash_password(password),
            role=role,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

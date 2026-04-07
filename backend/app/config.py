from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # FastAPI
    app_name: str = "CARS API"
    debug: bool = False

    # Database
    db_server: str = "localhost"
    db_port: int = 1433
    db_name: str = "cars_db"
    db_user: str = "sa"
    db_password: str = "StrongPass123!"

    # JWT
    jwt_secret: str = "super-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24  # 24 horas

    @property
    def db_url(self) -> str:
        return (
            f"mssql+pyodbc://{self.db_user}:{self.db_password}"
            f"@{self.db_server}:{self.db_port}/{self.db_name}"
            f"?driver=ODBC+Driver+17+for+SQL+Server"
        )

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()

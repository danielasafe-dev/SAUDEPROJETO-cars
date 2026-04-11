from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings
from sqlalchemy.engine import URL


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
        return URL.create(
            "mssql+pyodbc",
            username=self.db_user,
            password=self.db_password,
            host=self.db_server,
            port=self.db_port,
            database=self.db_name,
            query={"driver": "ODBC Driver 17 for SQL Server"},
        ).render_as_string(hide_password=False)

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, str):
            value_lower = value.lower()
            if value_lower in {"release", "prod", "production"}:
                return False
            if value_lower in {"debug", "dev", "development"}:
                return True
        return value

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()

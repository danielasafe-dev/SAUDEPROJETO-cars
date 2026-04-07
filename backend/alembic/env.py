from alembic import context
from sqlalchemy import create_engine
from app.database import Base
from app.config import get_settings

settings = get_settings()

config = context.config

target_metadata = Base.metadata


def run_migrations_offline():
    context.configure(url=settings.db_url, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    engine = create_engine(settings.db_url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

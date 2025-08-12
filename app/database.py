from typing import Generator

from sqlmodel import SQLModel, create_engine, Session

from .config import settings

# For SQLite, check_same_thread must be False for usage with FastAPI
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, echo=settings.debug, connect_args=connect_args)


def init_db() -> None:
    """Create database tables. In production, prefer migrations."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    app_name: str = Field(default="Plateforme Immo API")
    debug: bool = Field(default=True)
    database_url: str = Field(default="sqlite:///./immo.db")

    jwt_secret_key: str = Field(default="CHANGE_ME_SECRET")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60 * 24)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
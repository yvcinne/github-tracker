from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    github_token: str
    github_username: str
    database_url: str
    resend_api_key: str = ""
    email_to: str = ""

    class Config:
        env_file = ".env"


settings = Settings()

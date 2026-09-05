import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    RAZORPAY_KEY_ID: str = "rzp_test_dummy_key"
    RAZORPAY_KEY_SECRET: str = "dummy_secret"
    RAZORPAY_WEBHOOK_SECRET: str = "dummy_webhook_secret"
    OPENAI_API_KEY: str = "sk-dummy"
    DATABASE_URL: str = "sqlite:///./revagent.db"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
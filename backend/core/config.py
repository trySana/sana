import logging

from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict


# === 1. Configuration du logger global ===
logger = logging.getLogger("app_logger")
logger.setLevel(logging.INFO)

formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

if not logger.hasHandlers():
    logger.addHandler(console_handler)


# === 2. Configuration de l'application ===
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    OPENAI_API_KEY: str = ""
    MONGO_HOST: str = "localhost:27017"
    MONGO_DB: str = "sana_test"
    MONGO_USER: str = ""
    MONGO_PWD: str = ""
    ELEVENLABS_API_KEY: str = ""
    VOICE_ID: str = ""
    MODEL_ID: str = ""
    TTS_URL: str = ""
    SALT: str = ""


settings = Settings()  # type: ignore

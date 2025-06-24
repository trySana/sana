from dotenv import load_dotenv
import os 
from pydantic import BaseSettings


load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

settings = Settings()
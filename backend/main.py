


import hashlib


from fastapi import FastAPI
from mongoengine.connection import disconnect_all

from core.config import logger
from core.utils.whisper_stt import transcribe_audio
from core.utils.whisper_stt import WhisperSTT


from fastapi import FastAPI
from fastapi import File
from fastapi import UploadFile

from motor.motor_asyncio import AsyncIOMotorClient

from backend.core.config import logger
from backend.core.config import settings
from backend.core.models.user import Authentification
from backend.core.models.user import CreateUser
from backend.core.models.user import User


from backend.core.config import logger
from backend.core.utils.connection import database_connection


from backend.core.utils.whisper_stt import WhisperSTT




whisper_stt = WhisperSTT()

logger.info("Starting the API...")
app = FastAPI()
logger.info("API started.")


@app.get("/")
async def read_root():
    logger.info("Route / called")
    return {"message": "Hello World"}



@app.post("/create_user/")
async def create_user(input: CreateUser) -> bool:
    """Create user

    Args:
        input (CreateUser): Input

    Returns:
        bool: True
    """

    logger.info("Hashing...")

    hasher = hashlib.blake2b(
        input.password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    logger.info("Connecting to database...")
    database_connection()

    logger.info("Saving...")
    User(
        username=input.username,
        password=hasher,
        email=input.email,
        sex=input.sex,
        date_of_birth=input.date_of_birth,
    ).save()

    logger.info("Closing database connection...")
    disconnect_all()

    return True


@app.post("/authentificate/")
async def authentificate(input: Authentification) -> bool:
    """Authentificate

    Args:
        input (Authentification): Input

    Raises:
        Exception: If username and password are wrong.

    Returns:
        bool: True
    """

    logger.info("Hashing...")

    hasher = hashlib.blake2b(
        input.password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    logger.info("Connecting to database...")
    database_connection()

    logger.info("Authentificating...")

    user = User.objects(  # type: ignore[attr-defined]
        username=input.username, password=hasher
    ).first()

    if not user:
        raise Exception("Incorrect username or password.")

    logger.info("Closing database connection...")
    disconnect_all()

    return True

@app.post("/stt/")
async def stt(file: UploadFile = File(...)):
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    text = await whisper_stt.transcribe_audio(temp_path)
    return {"text": text}


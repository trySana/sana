import hashlib


import openai
from fastapi import FastAPI
from fastapi import File
from fastapi import UploadFile

from fastapi import FastAPI

from mongoengine.connection import disconnect_all

from backend.core.config import logger
from backend.core.config import settings
from backend.core.models.MedicalHistory import MedicalHistory
from backend.core.models.user import Authentification
from backend.core.models.user import CreateUser
from backend.core.models.user import UpdateUser
from backend.core.models.user import User
from backend.core.utils.connection import database_connection

from backend.core.utils.llm_parser import parse_medical_text
from backend.core.utils.whisper_stt import WhisperSTT


whisper_stt = WhisperSTT()


client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

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
async def authentificate(input: Authentification) -> dict:
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

    medical_history = MedicalHistory.get_medical_history(user=user)

    logger.info("Closing database connection...")
    disconnect_all()

    return {
        "username": input.username,
        "email": user.email,
        "sex": user.sex,
        "date_of_birth": user.date_of_birth,
        "medical_history": medical_history,
    }


@app.post("/update/")
async def update_user(input: UpdateUser):
    hasher = hashlib.blake2b(
        input.password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    database_connection()

    user = User.objects(  # type: ignore[attr-defined]
        username=input.username, password=hasher
    ).first()

    if not user:
        raise Exception("Incorrect username or password.")

    update = dict()

    if input.new_username:
        update["username"] = input.new_username

    if input.new_date_of_birth:
        update["date_of_birth"] = input.new_date_of_birth  # type: ignore[assignment]

    if input.new_email:
        update["email"] = input.new_email

    if input.new_sex:
        update["sex"] = input.new_sex

    if input.new_password:
        update["password"] = hashlib.blake2b(
            input.new_password.encode("utf-8"),
            digest_size=15,
            salt=settings.SALT.encode("utf-8"),
        ).hexdigest()

    user.update(**update)
    disconnect_all()

    return user


@app.post("/stt/")
async def stt(file: UploadFile = File(...)):
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    text = await whisper_stt.transcribe_audio(temp_path)
    parsed = parse_medical_text(text)
    return {"text": text, "parsed": parsed}


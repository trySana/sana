import hashlib

from fastapi import FastAPI
from mongoengine.connection import disconnect_all

from backend.core.config import logger
from backend.core.config import settings
from backend.core.models.user import Authentification
from backend.core.models.user import CreateUser
from backend.core.models.user import User
from backend.core.utils.connection import database_connection


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

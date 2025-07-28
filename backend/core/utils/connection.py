from mongoengine import connect

from core.config import logger
from core.config import settings


def database_connection():
    """Connect to database."""
    logger.info("Connecting to database...")
    connect(
        db=settings.MONGO_DB,
        host=(
            "mongodb+srv://"
            + settings.MONGO_USER
            + ":"
            + settings.MONGO_PWD
            + "@"
            + settings.MONGO_HOST
        ),
    )
    logger.info("Connected to database.")

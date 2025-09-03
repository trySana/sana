from core.config import logger
from core.config import settings
from mongoengine import connect


def database_connection():
    """Connect to database."""
    logger.info("Connecting to database...")

    try:
        if not settings.MONGO_USER and not settings.MONGO_PWD:
            logger.info("Using local MongoDB connection")
            connect(db=settings.MONGO_DB, host=settings.MONGO_HOST)
        else:
            logger.info("Using authenticated MongoDB connection")
            if "localhost" in settings.MONGO_HOST or "127.0.0.1" in settings.MONGO_HOST:
                connect(
                    db=settings.MONGO_DB,
                    host=settings.MONGO_HOST,
                    username=settings.MONGO_USER,
                    password=settings.MONGO_PWD,
                )
            else:
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

        logger.info("Successfully connected to database.")

    except Exception as e:
        logger.error(f"Failed to connect to database: {str(e)}")
        raise Exception(f"Database connection failed: {str(e)}")

from core.config import logger
from core.config import settings
from mongoengine import connect


def database_connection():
    """Connect to database."""
    logger.info("Connecting to database...")

    # Si pas d'utilisateur/mot de passe, connexion locale
    if not settings.MONGO_USER and not settings.MONGO_PWD:
        connect(db=settings.MONGO_DB, host=settings.MONGO_HOST)
    else:
        # Connexion avec authentification
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

import os
from mongoengine import connect


def database_connection():
    """Connect to database.
    """
    
    connect(
        db=os.getenv("MONGO_DB"),
        host=(
            "mongodb+srv"
            f"://{os.getenv('MONGO_USER')}"
            f":{os.getenv('MONGO_PWD')}"
            f"@{os.getenv('MONGO_HOST')}"
            f"/{os.getenv('MONGO_DB')}"
        ),
    )

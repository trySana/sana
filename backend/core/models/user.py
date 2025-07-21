# mypy: ignore-errors
<<<<<<< HEAD
from datetime import date
from typing import Optional

=======
>>>>>>> c7c0aae (refactor: update main)
from mongoengine import DateField
from mongoengine import EmailField
from mongoengine import EnumField
from mongoengine import StringField
from pydantic import BaseModel

from backend.core.models.base import BaseDocument
from backend.core.utils.user import Sex

from backend.core.models.base import BaseDocument
from backend.core.utils.user import Sex


class User(BaseDocument):
    """Document of describing an user."""

    username = StringField(
        required=True,
        unique=True,
        min_length=5,
        max_length=15,
    )
    password = StringField(required=True)
    email = EmailField(required=True, unique=True)
    sex = EnumField(enum=Sex, required=True)
    date_of_birth = DateField(required=True)

    meta = {  # type: ignore
        "collection": "User",
        "indexes": ["username"],
    }


class CreateUser(BaseModel):
    username: str
    password: str
    email: str
    sex: str
    date_of_birth: date


class Authentification(BaseModel):
    username: str
    password: str


class UpdateUser(BaseModel):
    username: Optional[str]
    password: Optional[str]
    email: Optional[str]

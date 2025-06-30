# mypy: ignore-errors
from core.models.base import BaseDocument
from core.utils.user import Sex
from mongoengine import DateField
from mongoengine import EnumField
from mongoengine import StringField


class User(BaseDocument):
    """Document of describing an user."""

    username = StringField(
        required=True,
        unique=True,
        min_length=5,
        max_length=15,
    )
    password = StringField(required=True)
    sex = EnumField(enum=Sex, required=True)
    date_of_birth = DateField(required=True)

    meta = {  # type: ignore
        "collection": "User",
        "indexes": ["username"],
    }

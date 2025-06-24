from mongoengine import StringField, EnumField, DateField

from core.models.base import BaseDocument
from core.utils.user import Sex


class User(BaseDocument):
    """Document of describing an user.
    """

    username = StringField(
        required=True,
        unique=True,
        min_length=5,
        max_length=15,
    )
    password = StringField(required=True)
    sex = EnumField(enum=Sex, required=True)
    date_of_birth = DateField(required=True)

    meta = {
        "collection": "User",
        "indexes": ["username"],
    }

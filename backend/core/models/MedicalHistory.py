# mypy: ignore-errors
from mongoengine import DictField
from mongoengine import LazyReferenceField

from backend.core.models.base import BaseDocument
from backend.core.models.user import User


class MedicalHistory(BaseDocument):
    """Document of a previous ill-sate of an user. The
    symptoms field is a dictionary with symptoms as keys
    and a dictionary (with severities and symptoms duration
    as keys) as value.
    """

    patient = LazyReferenceField("User", passthrough=True, required=True)
    symptoms = DictField(required=True)

    meta = {  # type: ignore
        "collection": "MedicalHistory",
        "indexes": ["created_at"],
    }

    @staticmethod
    def get_medical_history(user: User):
        return list(__class__.objects(patient=user.pk))

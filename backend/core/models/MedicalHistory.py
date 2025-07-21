# mypy: ignore-errors
from backend.core.models.base import BaseDocument
from mongoengine import DictField, LazyReferenceField


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

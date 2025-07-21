# mypy: ignore-errors
from core.models.base import BaseDocument
from mongoengine import DictField
from mongoengine import LazyReferenceField


class MedicalHistory(BaseDocument):
    """Document of a previous ill-sate of an user. The
    symptoms field is a dictionary with symptoms as keys
    and severities as values.
    """

    patient = LazyReferenceField("User", passthrough=True, required=True)
    symptoms = DictField(required=True)

    meta = {  # type: ignore
        "collection": "MedicalHistory",
        "indexes": ["created_at"],
    }

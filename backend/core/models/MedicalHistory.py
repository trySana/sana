from mongoengine import LazyReferenceField, DictField

from core.models.base import BaseDocument


class MedicalHistory(BaseDocument):
    """Document of a previous ill-sate of an user. The
    symptoms field is a dictionary with symptoms as keys
    and severities as values.
    """

    patient = LazyReferenceField("User", passthrough=True, required=True)
    symptoms = DictField(required=True)

    meta = {
        "collection": "MedicalHistory",
        "indexes": ["created_at"],
    }

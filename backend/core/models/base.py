from datetime import datetime

from mongoengine import DateTimeField
from mongoengine import Document


class BaseDocument(Document):
    """Base model of Mongoengine document from which all
    documents will inherit.
    """

    created_at = DateTimeField(required=True)

    meta = {
        "abstract": True,
    }

    def save(self, *_args, **_kwargs):
        """Add the created at field when saving a new document."""
        if not self.created_at:
            self.created_at = datetime.now()
        super().save(force_insert=False, validate=True, clean=True)

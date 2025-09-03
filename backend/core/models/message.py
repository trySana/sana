from mongoengine import LazyReferenceField, DictField

from core.models.base import BaseDocument
from core.models.user import User


class Message(BaseDocument):
    """Document of describing a message."""

    user = LazyReferenceField(User, required=True)
    message = DictField(required=True)

    meta = {  # type: ignore
        "indexes": ["user"],
    }

    @classmethod
    def get_messages_by_user(cls, user: User):
        """Retrieve all messages associated with a specific user.

        Args:
            user (User): The user whose messages are to be retrieved.

        Returns:
            List[Message]: A list of Message instances associated with the user.
        """

        messages = cls.objects(user=user).exclude("user").order_by("-created_at").limit(16)
        messages = messages.order_by("created_at")

        result = list()
        for message in messages:
            message_dict = message.to_mongo().to_dict()
            message_dict["message"]["content"] = message_dict["message"]["content"] + " timestamp: " + message_dict.pop("created_at")
            result.append(message_dict["message"])

        return result

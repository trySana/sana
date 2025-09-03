from typing import Dict
from typing import List

from core.models.base import BaseDocument
from core.models.user import User
from mongoengine import DictField
from mongoengine import LazyReferenceField


class Message(BaseDocument):
    """Document of describing a message."""

    user = LazyReferenceField(User, required=True)
    message = DictField(required=True)

    meta = {  # type: ignore
        "indexes": ["user"],
    }

    @classmethod
    def get_messages_by_user(cls, user: User) -> List[Dict]:
        """Retrieve all Message associated with a specific user and return
        a list of the message field.

        Args:
            user (User): The user whose messages are to be retrieved.

        Returns:
            List[Dict]: A list of Message instances associated with the user.
        """

        messages = (
            cls.objects(user=user).exclude("user").order_by("-created_at").limit(16)
        )
        messages = messages.order_by("created_at")

        result = list()
        for message in messages:
            message_dict = message.to_mongo().to_dict()

            message_dict["message"]["content"] = (
                message_dict["message"]["content"]
                + " timestamp: "
                + message_dict.pop("created_at").isoformat()
            )

            result.append(message_dict["message"])

        return result

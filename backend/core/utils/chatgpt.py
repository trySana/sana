from typing import Dict
from typing import Optional

from core.config import logger
from core.config import settings
from core.models.message import Message
from core.models.user import User
from openai import OpenAI


class Sana:
    MAX_MESSAGES = 8

    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def chat(
        self, user: User, user_message: str, medical_history: Optional[Dict] = None
    ) -> str:

        session = Message.get_messages_by_user(user)
        Message(user=user, message={"role": "user", "content": user_message}).save()

        session.append({"role": "user", "content": user_message})

        role_message = (
            "You are a doctor and a patient asks for your opinion. "
            "Answer in less than 150 characters. "
            "Ask questions to get more information to help you make a diagnosis. "
            "Try to narrow down the possible conditions. "
            "Enquire about symptoms, duration and severity. "
            "Do not add timestamps to your answers."
        )

        system_messages = [
            {
                "role": "system",
                "content": role_message,
            },
        ]

        if medical_history:
            system_messages.append(
                {
                    "role": "system",
                    "content": f"The patient medical history is {medical_history}",
                    }
            )

        if len(session) >= 2 * Sana.MAX_MESSAGES - 1:
            system_messages.append(
                {
                    "role": "system",
                    "content": "This is your final response. Give a diagnosis.",
                }
            )

        messages_to_send = system_messages + session

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini", messages=messages_to_send
            )

            reply = response.choices[0].message.content
            Message(user=user, message={"role": "assistant", "content": reply}).save()
            return reply

        except Exception as e:
            logger.error(e)

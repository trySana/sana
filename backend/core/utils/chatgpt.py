from typing import Dict

from core.models.user import User
from core.models.message import Message
from core.config import logger, settings
from openai import OpenAI


class Sana:

    MAX_MESSAGES = 6

    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def chat(self, user: User, user_message: str, medical_history: Dict = None):

        session = Message.get_messages_by_user(user)
        Message(user=user, message={"role": "user", "content": user_message}).save()

        session.append({"role": "user", "content": user_message})

        system_messages = [
            {
                "role": "system",
                "content": "You are a doctor and a patient asks for your opinion.",
            },
            {
                "role": "system",
                "content": "Answer in less than 150 characters. You can ask questions.",
            },
        ]

        if len(session) == 1 and medical_history:
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

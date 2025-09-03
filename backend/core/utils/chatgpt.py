from typing import Dict
from typing import List

from core.config import logger, settings
from openai import OpenAI


class Sana:

    MAX_MESSAGES = 6

    def __init__(self):
        self.sessions = dict()
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def chat(self, session_id: str, user_message: str, medical_history: Dict = None):
        if session_id not in self.sessions:
            self.sessions[session_id] = []

        session = self.sessions[session_id]
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
            session.append({"role": "assistant", "content": reply})

            if len(session) >= 2 * Sana.MAX_MESSAGES:
                del self.sessions[session_id]

            return reply

        except Exception as e:
            logger.error(e)

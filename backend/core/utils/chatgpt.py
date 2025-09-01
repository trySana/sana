from typing import Dict
from typing import List

from core.config import logger
from openai import OpenAI

MAX_MESSAGES = 6
sessions: Dict[str, List[Dict[str, str]]] = {}


def chat(client: OpenAI, session_id: str, user_message: str, medical_history: Dict):
    if session_id not in sessions:
        sessions[session_id] = []

    session = sessions[session_id]
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

    if len(session) == 1:
        system_messages.append(
            {
                "role": "system",
                "content": f"The patient medical history is {medical_history}",
            }
        )

    if len(session) >= 2 * MAX_MESSAGES - 1:
        system_messages.append(
            {
                "role": "system",
                "content": "This is your final response. Give a diagnosis.",
            }
        )

    messages_to_send = system_messages + session

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", messages=messages_to_send
        )

        reply = response.choices[0].message.content
        session.append({"role": "assistant", "content": reply})

        if len(session) >= 2 * MAX_MESSAGES:
            del sessions[session_id]

        return reply

    except Exception as e:
        logger.error(e)

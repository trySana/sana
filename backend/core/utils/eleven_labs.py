import requests

from backend.core.config import settings


def text_to_speech_file(text: str) -> bytes:
    response = requests.post(
        url=settings.TTS_URL,
        headers={
            "xi-api-key": settings.ELEVENLABS_API_KEY,
        },
        json={"text": text, "model_id": "eleven_multilingual_v2"},
    )

    return response.content

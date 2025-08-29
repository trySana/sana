import httpx
from core.config import logger
from core.config import settings


async def text_to_speech(text: str) -> bytes:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url=settings.TTS_URL,
                headers={
                    "xi-api-key": settings.ELEVENLABS_API_KEY,
                },
                json={"text": text, "model_id": "eleven_multilingual_v2"},
            )

            response.raise_for_status()

        except Exception as e:
            logger.error(e)

        return response.content

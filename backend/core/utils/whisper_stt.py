import asyncio
import logging

import whisper  # noqa: F401


# Configuration du logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Loading model...")
model = whisper.load_model("turbo")
logger.info("Model loaded.")


# Transcribe the audio
async def transcribe_audio(audio_path: str) -> str:
    logger.info(f"Audio file received for transcription : {audio_path}")
    logger.info("Starting transcription...")

    def _transcribe():
        return model.transcribe(audio_path)

    result = await asyncio.to_thread(_transcribe)
    logger.info("Transcription completed.")
    logger.info(f"Transcription : {result['text']}")
    return result["text"]


# Detect the spoken language
async def detect_language(audio_path: str) -> str:
    logger.info(f"Language detection for : {audio_path}")

    def _detect():
        return model.transcribe(audio_path)

    result = await asyncio.to_thread(_detect)
    logger.info(f"Language detected : {result['language']}")
    return result["language"]

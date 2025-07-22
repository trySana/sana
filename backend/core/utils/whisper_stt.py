import asyncio
import logging

import whisper

# Configuration du logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WhisperSTT:
    def __init__(self, model_name: str = "turbo"):
        logger.info("Loading Whisper model...")
        self.model = whisper.load_model(model_name)
        logger.info("Whisper model loaded.")

    async def transcribe_audio(self, audio_path: str) -> str:
        logger.info(f"Audio file received for transcription : {audio_path}")
        logger.info("Starting transcription...")

        def _transcribe():
            return self.model.transcribe(audio_path)

        result = await asyncio.to_thread(_transcribe)
        logger.info("Transcription completed.")
        logger.info(f"Transcription : {result['text']}")
        return result["text"]

    async def detect_language(self, audio_path: str) -> str:
        logger.info(f"Language detection for : {audio_path}")

        def _detect():
            return self.model.transcribe(audio_path)

        result = await asyncio.to_thread(_detect)
        logger.info(f"Language detected : {result['language']}")
        return result["language"]

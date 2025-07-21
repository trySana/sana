import asyncio

import torch
from TTS.api import TTS

from backend.core.config import logger
from backend.core.config import settings


class Jenny:
    def __init__(self):
        logger.info("Initializing Jenny...")
        self.tts = TTS(settings.COQUI_MODEL).to(Jenny.get_device())
        logger.info("Jenny initialized.")

    @staticmethod
    def get_device():
        logger.info("Checking device's hardware...")
        if torch.cuda.is_available():
            logger.info("Selected CUDA.")
            return "cuda"
        elif torch.backends.mps.is_available():
            logger.info("Selected MPS.")
            return "mps"  # macOS Apple Silicon
        else:
            logger.info("Selected CPU.")
            return "cpu"

    async def convert_to_voice(self, text: str, filename: str) -> str:
        """Convert text to voice.

        Args:
            text (str): Text to convert
            filename (str): Name of the file in which the audio is to
            be written

        Returns:
            str: Path of the audio file
        """
        logger.info("Converting text to speech...")
        return await asyncio.to_thread(self.tts.tts_to_file, text, f"/tmp/{filename}")

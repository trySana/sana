import logging

import whisper

# Configuration du logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Loading model...")
model = whisper.load_model("turbo")
logger.info("Model loaded.")


# Transcribe the audio
def transcribe_audio(audio_path: str) -> str:
    logger.info(f"Audio file received for transcription : {audio_path}")
    logger.info("Starting transcription...")
    result = model.transcribe(audio_path)
    logger.info("Transcription completed.")
    logger.info(f"Transcription : {result['text']}")
    return result["text"]


# Detect the spoken language
def detect_language(audio_path: str) -> str:
    logger.info(f"Language detection for : {audio_path}")
    result = model.transcribe(audio_path)
    logger.info(f"Language detected : {result['language']}")
    return result["language"]

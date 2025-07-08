import os

import pytest
import whisper

from backend.core.utils import whisper_stt

# Load the model
print("Loading model...")
model = whisper.load_model("turbo")
print("Model loaded.")

# Replace with the real path of your audio file
audio_path = "../audio/patient.mp3"
result = model.transcribe(audio_path)

print("Transcription :", result["text"])


@pytest.mark.asyncio
async def test_transcribe_audio():
    audio_path = os.path.join(os.path.dirname(__file__), "../audio/patient.mp3")
    # Check if the file exists
    assert os.path.exists(audio_path)
    texte = await whisper_stt.transcribe_audio(audio_path)
    assert isinstance(texte, str)
    assert len(texte) > 0  # The transcribed text should not be empty


@pytest.mark.asyncio
async def test_detect_language():
    audio_path = os.path.join(os.path.dirname(__file__), "../audio/patient.mp3")
    assert os.path.exists(audio_path)
    langue = await whisper_stt.detect_language(audio_path)
    assert isinstance(langue, str)
    assert (
        len(langue) == 2
    )  # The language codes in Whisper are 2 characters long (ex: 'fr', 'en')

import os

import pytest

from backend.core.utils.whisper_stt import WhisperSTT


@pytest.mark.asyncio
async def test_transcribe_audio_real():
    whisper = WhisperSTT()
    audio_path = "audio/patient.mp3"
    assert os.path.exists(audio_path)
    result = await whisper.transcribe_audio(audio_path)
    assert isinstance(result, str)
    assert len(result) > 0


@pytest.mark.asyncio
async def test_detect_language_real():
    whisper = WhisperSTT()
    audio_path = "audio/patient.mp3"
    assert os.path.exists(audio_path)
    lang = await whisper.detect_language(audio_path)
    assert isinstance(lang, str)
    assert len(lang) > 0

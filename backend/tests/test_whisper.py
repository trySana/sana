import os

import pytest

from backend.core.utils.whisper_stt import WhisperSTT  # noqa: F401


@pytest.mark.asyncio
async def test_transcribe_audio_real():
    stt = WhisperSTT(model_name="tiny")  # Utilise un modèle plus léger si possible
    audio_path = "audio/patient.mp3"
    assert os.path.exists(audio_path)
    texte = await stt.transcribe_audio(audio_path)
    assert isinstance(texte, str)
    assert len(texte) > 0


@pytest.mark.asyncio
async def test_detect_language_real():
    stt = WhisperSTT(model_name="tiny")
    audio_path = "audio/patient.mp3"
    assert os.path.exists(audio_path)
    langue = await stt.detect_language(audio_path)
    assert isinstance(langue, str)
    assert len(langue) == 2

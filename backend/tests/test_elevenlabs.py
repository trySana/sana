import pytest
import httpx
from core.utils.eleven_labs import ElevenLabs


@pytest.mark.asyncio
async def test_text_to_speech_success(monkeypatch):
    class MockResponse:

        def __init__(self):
            self.content = b"audio-bytes"

        def raise_for_status(self):
            pass

    async def mock_post(*args, **kwargs):
        return MockResponse()

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    result = await ElevenLabs.text_to_speech("Hello world")
    assert result == b"audio-bytes"


@pytest.mark.asyncio
async def test_text_to_speech_failure(monkeypatch, caplog):
    class MockResponse:
        def __init__(self):
            self.content = b""

        def raise_for_status(self):
            raise httpx.HTTPStatusError("error", request=None, response=None)

    async def mock_post(*args, **kwargs):
        return MockResponse()

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    with caplog.at_level("ERROR"):
        result = await ElevenLabs.text_to_speech("Hello world")
        assert result == b""
        assert "error" in caplog.text.lower()

import pytest
from core.utils.chatgpt import Sana


class DummyResponse:

    class Choices:
        class Message:
            content = "Doctor's reply"
        message = Message()

    choices = [Choices()]


class DummyChatCompletions:
    def create(self, model, messages):
        return DummyResponse()


class DummyChat:
    completions = DummyChatCompletions()


class DummyOpenAIClient:
    chat = DummyChat()


@pytest.fixture
def sana(monkeypatch):
    sana_instance = Sana()
    monkeypatch.setattr(sana_instance, "client", DummyOpenAIClient())
    return sana_instance


def test_chat_basic(sana):
    reply = sana.chat("session1", "Hello doctor")
    assert reply == "Doctor's reply"
    assert sana.sessions["session1"][-1]["role"] == "assistant"


def test_chat_with_medical_history(sana):
    reply = sana.chat("session2", "Hello", medical_history={"age": 30, "condition": "flu"})
    assert reply == "Doctor's reply"
    assert sana.sessions["session2"][0]["role"] == "user"


def test_chat_session_deletion(sana):
    session_id = "session3"
    for i in range(Sana.MAX_MESSAGES * 2):
        sana.chat(session_id, f"msg{i}")
    assert session_id not in sana.sessions

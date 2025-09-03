import pytest
from mongoengine.connection import disconnect_all

from core.utils.chatgpt import Sana
from core.utils.connection import mock_database_connection


class DummyUser:
    username = "testuser"


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


@pytest.fixture
def patch_message(monkeypatch):
    class DummyMessage:
        def __init__(self, user, message):
            self.user = user
            self.message = message

        @staticmethod
        def get_messages_by_user(user):
            return []

        def save(self):
            pass

    monkeypatch.setattr("core.models.message.Message", DummyMessage)


def test_chat_basic(sana, patch_message):
    mock_database_connection()
    user = DummyUser()
    reply = sana.chat(user, "Hello doctor")
    assert reply == "Doctor's reply"
    disconnect_all()


def test_chat_with_medical_history(sana, patch_message):
    mock_database_connection()
    user = DummyUser()
    reply = sana.chat(user, "Hello", medical_history={"age": 30, "condition": "flu"})
    assert reply == "Doctor's reply"
    disconnect_all()


def test_chat_final_response(sana, patch_message, monkeypatch):
    mock_database_connection()
    user = DummyUser()

    class DummyMessage:
        def __init__(self, user, message):
            self.user = user
            self.message = message

        @staticmethod
        def get_messages_by_user(user):
            return [{"role": "user", "content": "msg"}] * (Sana.MAX_MESSAGES * 2 - 1)

        def save(self):
            pass

    monkeypatch.setattr("core.models.message.Message", DummyMessage)
    reply = sana.chat(user, "Final message")
    assert reply == "Doctor's reply"
    disconnect_all()


def test_chat_error(monkeypatch, sana, patch_message):
    mock_database_connection()
    user = DummyUser()

    class FailingCompletions:
        def create(self, model, messages):
            raise Exception("API error")

    class FailingChat:
        completions = FailingCompletions()

    sana.client.chat = FailingChat()
    with pytest.raises(Exception):
        sana.chat(user, "Hello")
    disconnect_all()

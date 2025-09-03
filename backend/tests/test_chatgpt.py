from unittest.mock import MagicMock
from unittest.mock import patch

import pytest
from core.models.message import Message
from core.models.user import User
from core.utils.chatgpt import Sana
from core.utils.connection import mock_database_connection
from core.utils.user import Sex
from mongoengine import disconnect_all


@pytest.fixture(autouse=True)
def mongo_mock():
    mock_database_connection()
    yield
    disconnect_all()


@pytest.fixture
def user():
    user = User(
        username="testuser",
        email="test@example.com",
        password="hashed",  # pragma: allowlist secret
        sex=Sex.MALE,
        date_of_birth="2000-01-01",
    )
    user.save()
    return user


@pytest.fixture
def sana():
    with patch("core.utils.chatgpt.OpenAI") as mock_openai:
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        return Sana()


def test_chat_creates_message_and_returns_reply(user, sana):
    mock_reply = "This is a test reply."
    sana.client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content=mock_reply))]
    )

    reply = sana.chat(
        user, "Hello doctor!", medical_history={"height": 180, "weight": 75}
    )

    assert reply == mock_reply
    messages = Message.objects(user=user)
    assert any(m.message["role"] == "user" for m in messages)
    assert any(m.message["role"] == "assistant" for m in messages)


def test_chat_adds_medical_history_to_system_messages(user, sana):
    sana.client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="reply"))]
    )

    Message.objects(user=user).delete()
    sana.chat(user, "First message", medical_history={"height": 180})
    args, kwargs = sana.client.chat.completions.create.call_args
    messages = kwargs["messages"]
    assert any(
        "medical history" in m["content"] for m in messages if m["role"] == "system"
    )


def test_chat_final_response_when_max_messages(user, sana):
    sana.client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="final diagnosis"))]
    )

    for i in range(2 * Sana.MAX_MESSAGES - 2):
        Message(user=user, message={"role": "user", "content": f"msg{i}"}).save()
    sana.chat(user, "Last message")
    args, kwargs = sana.client.chat.completions.create.call_args
    messages = kwargs["messages"]
    assert any(
        "final response" in m["content"] for m in messages if m["role"] == "system"
    )


def test_chat_logs_error_on_exception(user, sana):
    sana.client.chat.completions.create.side_effect = Exception("API error")
    with patch("core.utils.chatgpt.logger") as mock_logger:
        sana.chat(user, "Hello doctor!")
        mock_logger.error.assert_called_once()
        error_arg = mock_logger.error.call_args[0][0]
        assert isinstance(error_arg, Exception)
        assert str(error_arg) == "API error"

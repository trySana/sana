import pytest
from mongoengine.connection import get_connection, disconnect_all
from core.utils.connection import database_connection, mock_database_connection


def test_mock_database_connection():

    mock_database_connection()
    conn = get_connection()
    assert conn is not None
    assert hasattr(conn, "is_mock") or conn.__class__.__name__ == "MongoClient"
    disconnect_all()


def test_database_connection_local(monkeypatch):

    class DummySettings:
        MONGO_USER = ""
        MONGO_PWD = ""
        MONGO_DB = "testdb"
        MONGO_HOST = "localhost"
    monkeypatch.setattr("core.utils.connection.settings", DummySettings)

    database_connection()
    conn = get_connection()
    assert conn is not None
    disconnect_all()


def test_database_connection_authenticated_local(monkeypatch):

    class DummySettings:
        MONGO_USER = "user"
        MONGO_PWD = "pwd"
        MONGO_DB = "testdb"
        MONGO_HOST = "localhost"
    monkeypatch.setattr("core.utils.connection.settings", DummySettings)

    database_connection()
    conn = get_connection()
    assert conn is not None
    disconnect_all()


def test_database_connection_failure(monkeypatch):
    def fake_connect(*args, **kwargs):
        raise Exception("Connection error")
    monkeypatch.setattr("core.utils.connection.connect", fake_connect)

    class DummySettings:
        MONGO_USER = ""
        MONGO_PWD = ""
        MONGO_DB = "testdb"
        MONGO_HOST = "localhost"
    monkeypatch.setattr("core.utils.connection.settings", DummySettings)

    with pytest.raises(Exception) as excinfo:
        database_connection()
    assert "Database connection failed" in str(excinfo.value)
    disconnect_all()

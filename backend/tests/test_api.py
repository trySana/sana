import asyncio
import hashlib
from datetime import date

from mongoengine.connection import disconnect_all

from backend.core.config import settings
from backend.core.models.user import Authentification
from backend.core.models.user import CreateUser
from backend.core.models.user import User
from backend.core.utils.connection import database_connection
from backend.core.utils.user import Sex
from backend.main import authentificate
from backend.main import create_user


def test_create_user_should_create_user():
    # Given
    input = CreateUser(
        username="Luke Skywalker",
        password="Alabama",  # pragma: allowlist secret
        email="SpaceLeia@nobrain.com",
        sex=Sex.MALE,
        date_of_birth=date.today(),
    )

    # When
    result = asyncio.run(create_user(input=input))

    # Then
    hasher = hashlib.blake2b(
        input.password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    database_connection()

    user = User.objects(
        username=input.username,
        password=hasher,
        email=input.email,
        sex=input.sex,
        date_of_birth=input.date_of_birth,
    ).first()

    assert result is True
    assert user is not None

    if user is not None:
        user.delete()

    disconnect_all()


def test_create_user_should_authentificate():
    # Given
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()

    auth = Authentification(
        username="Luke Skywalker",
        password="Alabama",  # pragma: allowlist secret
    )

    hasher = hashlib.blake2b(
        auth.password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    # When
    database_connection()

    user = User(
        username=auth.username,
        password=hasher,  # pragma: allowlist secret
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )

    user.save()
    result = asyncio.run(authentificate(input=auth))

    # Then
    database_connection()
    user.delete()

    assert result["username"] == auth.username
    assert result["email"] == email
    assert result["sex"] == sex
    assert result["date_of_birth"] == date_of_birth
    assert result["medical_history"] == list()

    disconnect_all()


def test_update_user_should_update():
    # Given
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()

    auth = Authentification(
        username="Luke Skywalker",
        password="Alabama",  # pragma: allowlist secret
    )

    hasher = hashlib.blake2b(
        auth.password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    # When
    database_connection()

    user = User(
        username=auth.username,
        password=hasher,  # pragma: allowlist secret
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )

    user.save()
    result = asyncio.run(authentificate(input=auth))

    # Then
    database_connection()
    user.delete()

    assert result["username"] == auth.username
    assert result["email"] == email
    assert result["sex"] == sex
    assert result["date_of_birth"] == date_of_birth
    assert result["medical_history"] == list()

    disconnect_all()

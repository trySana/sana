import asyncio
import hashlib
from datetime import date
import pytest
from fastapi import HTTPException

from mongoengine.connection import disconnect_all

from core.config import settings
from core.models.user import Authentification
from core.models.user import CreateUser
from core.models.user import User
from core.models.user import UpdateUser
from core.models.user import HealthInfoRequest, ChangePasswordRequest
from core.models.MedicalHistory import MedicalHistory
from core.utils.connection import mock_database_connection
from core.utils.user import Sex
from main import authentificate, change_password, get_health_info_v2, update_health_info
from main import create_user
from main import update_profile


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
    mock_database_connection()
    result = asyncio.run(create_user(input=input))

    # Then
    hasher = hashlib.blake2b(
        input.password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    user = User.objects(
        username=input.username,
        password=hasher,
        email=input.email,
        sex=input.sex,
        date_of_birth=input.date_of_birth,
    ).first()

    assert user is not None
    assert result["success"] is True
    assert result["message"] == "User created successfully"
    assert result["user_id"] == f"{str(user.id)}"

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
    mock_database_connection()

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
    assert user is not None
    assert result["success"] is True
    assert result["message"] == "Authentication successful"
    assert result["user"]["username"] == auth.username
    assert result["user"]["email"] == email
    assert result["user"]["sex"] == sex
    assert result["user"]["date_of_birth"] == date_of_birth.isoformat()

    disconnect_all()


def test_update_user_should_update():
    # Given
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    username = "Luke Skywalker"
    password = "Alabama"  # pragma: allowlist secret
    new_username = "Leia Skywalker"

    hasher = hashlib.blake2b(
        password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    update_user = UpdateUser(username=new_username)

    # When
    mock_database_connection()

    user = User(
        username=username,
        password=hasher,  # pragma: allowlist secret
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )

    user.save()

    result = asyncio.run(update_profile(username=username, update_data=update_user))

    # Then
    assert user is not None
    assert result["success"] is True
    assert result["message"] == "Profile updated successfully"
    assert result["updated_fields"] == ["username"]

    disconnect_all()


def test_update_health_info_should_update():
    # Given
    username = "Luke Skywalker"
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    hasher = hashlib.blake2b(
        "Alabama".encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    health_data = HealthInfoRequest(height=180, weight=75)

    mock_database_connection()
    user = User(
        username=username,
        password=hasher,
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user.save()

    # When
    result = asyncio.run(
        update_health_info(username=username, health_data=health_data)
    )

    # Then
    assert result.success is True
    assert "height" in result.health_data
    assert result.health_data["height"] == 180
    assert result.health_data["weight"] == 75

    disconnect_all()


def test_get_health_info_v2_should_return_data():
    # Given
    username = "Luke Skywalker"
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    hasher = hashlib.blake2b(
        "Alabama".encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    mock_database_connection()
    user = User(
        username=username,
        password=hasher,
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user.save()

    medical_history = MedicalHistory(user=user, height=180, weight=75)
    medical_history.save()

    # When
    result = asyncio.run(get_health_info_v2(username=username))

    # Then
    assert result.success is True
    assert result.health_data["height"] == 180
    assert result.health_data["weight"] == 75

    disconnect_all()


def test_change_password_should_change():
    # Given
    username = "Luke Skywalker"
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    old_password = "Alabama"
    new_password = "NewSecret123"
    hasher = hashlib.blake2b(
        old_password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    mock_database_connection()
    user = User(
        username=username,
        password=hasher,
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user.save()

    password_data = ChangePasswordRequest(
        current_password=old_password,
        new_password=new_password,
        confirm_password=new_password,
    )

    # When
    result = asyncio.run(change_password(username=username, password_data=password_data))

    # Then
    assert result["success"] is True
    assert result["message"] == "Password changed successfully"

    new_hasher = hashlib.blake2b(
        new_password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()

    updated_user = User.objects(username=username, password=new_hasher).first()
    assert updated_user is not None

    disconnect_all()


def test_authentificate_should_fail_with_wrong_password():
    # Given
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    auth = Authentification(
        username="Luke Skywalker",
        password="WrongPassword",
    )
    correct_hasher = hashlib.blake2b(
        "Alabama".encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()
    mock_database_connection()
    user = User(
        username=auth.username,
        password=correct_hasher,
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user.save()

    # When / Then
    with pytest.raises(HTTPException) as excinfo:
        asyncio.run(authentificate(input=auth))
    assert excinfo.value.status_code == 401

    disconnect_all()


def test_update_profile_should_fail_if_user_not_found():
    # Given
    update_user = UpdateUser(username="NewName")
    mock_database_connection()

    # When / Then
    with pytest.raises(HTTPException) as excinfo:
        asyncio.run(update_profile(username="NonExistent", update_data=update_user))
    assert excinfo.value.status_code == 404

    disconnect_all()


def test_update_profile_should_fail_if_username_taken():
    # Given
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    password = "Alabama"
    hasher = hashlib.blake2b(
        password.encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()
    mock_database_connection()
    user1 = User(
        username="Luke Skywalker",
        password=hasher,
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user1.save()
    user2 = User(
        username="Leia Skywalker",
        password=hasher,
        email="leia@nobrain.com",
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user2.save()
    update_user = UpdateUser(username="Leia Skywalker")

    # When / Then
    with pytest.raises(HTTPException) as excinfo:
        asyncio.run(update_profile(username="Luke Skywalker", update_data=update_user))
    assert excinfo.value.status_code == 400

    disconnect_all()


def test_update_health_info_should_fail_if_user_not_found():
    # Given
    health_data = HealthInfoRequest(height=180, weight=75)
    mock_database_connection()

    # When
    result = asyncio.run(update_health_info(username="NonExistent", health_data=health_data))

    # Then
    assert result.success is False
    assert "non trouvé" in result.message

    disconnect_all()


def test_get_health_info_v2_should_fail_if_user_not_found():
    # Given
    mock_database_connection()

    # When
    result = asyncio.run(get_health_info_v2(username="NonExistent"))

    # Then
    assert result.success is False
    assert "non trouvé" in result.message

    disconnect_all()


def test_change_password_should_fail_if_user_not_found():
    # Given
    password_data = ChangePasswordRequest(
        current_password="Alabama",
        new_password="NewSecret123",
        confirm_password="NewSecret123",
    )
    mock_database_connection()

    # When / Then
    with pytest.raises(HTTPException) as excinfo:
        asyncio.run(change_password(username="NonExistent", password_data=password_data))
    assert excinfo.value.status_code == 404

    disconnect_all()


def test_change_password_should_fail_if_wrong_current_password():
    # Given
    username = "Luke Skywalker"
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    hasher = hashlib.blake2b(
        "Alabama".encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()
    mock_database_connection()
    user = User(
        username=username,
        password=hasher,
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user.save()
    password_data = ChangePasswordRequest(
        current_password="WrongPassword",
        new_password="NewSecret123",
        confirm_password="NewSecret123",
    )

    # When / Then
    with pytest.raises(HTTPException) as excinfo:
        asyncio.run(change_password(username=username, password_data=password_data))
    assert excinfo.value.status_code == 401

    disconnect_all()


def test_change_password_should_fail_if_new_passwords_do_not_match():
    # Given
    username = "Luke Skywalker"
    email = "SpaceLeia@nobrain.com"
    sex = Sex.MALE
    date_of_birth = date.today()
    hasher = hashlib.blake2b(
        "Alabama".encode("utf-8"),
        digest_size=15,
        salt=settings.SALT.encode("utf-8"),
    ).hexdigest()
    mock_database_connection()
    user = User(
        username=username,
        password=hasher,
        email=email,
        sex=sex,
        date_of_birth=date_of_birth,
    )
    user.save()
    password_data = ChangePasswordRequest(
        current_password="Alabama",
        new_password="NewSecret123",
        confirm_password="MismatchPassword",
    )

    # When / Then
    with pytest.raises(HTTPException) as excinfo:
        asyncio.run(change_password(username=username, password_data=password_data))
    assert excinfo.value.status_code == 400

    disconnect_all()

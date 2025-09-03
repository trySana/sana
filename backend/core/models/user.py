# mypy: ignore-errors
from datetime import date
from typing import List
from typing import Optional

from core.models.base import BaseDocument
from core.utils.user import Sex
from mongoengine import DateField
from mongoengine import EmailField
from mongoengine import EnumField
from mongoengine import StringField
from pydantic import BaseModel
from pydantic import Field


class User(BaseDocument):
    """Document of describing an user."""

    username = StringField(
        required=True,
        unique=True,
        min_length=3,
        max_length=20,
    )
    password = StringField(required=True)
    email = EmailField(required=True, unique=True)
    sex = EnumField(enum=Sex, required=True)
    date_of_birth = DateField(required=True)
    phone_number = StringField(required=False, max_length=20)
    bio = StringField(required=False, max_length=500)
    profile_image = StringField(required=False, max_length=1000)

    meta = {  # type: ignore
        "collection": "User",
        "indexes": ["username"],
    }


class CreateUser(BaseModel):
    username: str
    password: str
    email: str
    sex: str
    date_of_birth: date

    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "password": "secure_password123",
                "email": "john@example.com",
                "sex": "MALE",
                "date_of_birth": "1990-01-01",
            }
        }


class Authentification(BaseModel):
    username: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {"username": "john_doe", "password": "secure_password123"}
        }


class UpdateUser(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    sex: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "email": "john@example.com",
                "sex": "MALE",
                "date_of_birth": "1990-01-01",
                "phone_number": "+33123456789",
                "bio": "Développeur passionné par la technologie",
                "profile_image": "data:image/jpeg;base64,...",
            }
        }


class ChangePasswordRequest(BaseModel):
    """Modèle pour le changement de mot de passe"""

    current_password: str = Field(..., min_length=1, description="Mot de passe actuel")
    new_password: str = Field(
        ..., min_length=8, description="Nouveau mot de passe (min 8 caractères)"
    )
    confirm_password: str = Field(
        ..., min_length=1, description="Confirmation du nouveau mot de passe"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "current_password": "ancien_mot_de_passe",
                "new_password": "nouveau_mot_de_passe_securise",
                "confirm_password": "nouveau_mot_de_passe_securise",
            }
        }


class HealthInfoRequest(BaseModel):
    """Modèle pour la mise à jour des informations de santé"""

    height: Optional[int] = Field(None, ge=50, le=300, description="Taille en cm")
    weight: Optional[int] = Field(None, ge=20, le=300, description="Poids en kg")
    blood_type: Optional[str] = Field(None, description="Groupe sanguin")
    medical_conditions: Optional[List[str]] = Field(
        None, description="Maladies chroniques"
    )
    allergies: Optional[List[str]] = Field(None, description="Allergies")
    medications: Optional[List[str]] = Field(None, description="Médicaments actuels")
    smoking_status: Optional[str] = Field(None, description="Statut tabagique")
    alcohol_consumption: Optional[str] = Field(
        None, description="Consommation d'alcool"
    )
    exercise_frequency: Optional[str] = Field(None, description="Fréquence d'exercice")
    family_history: Optional[List[str]] = Field(
        None, description="Antécédents familiaux"
    )


class HealthInfoResponse(BaseModel):
    """Modèle de réponse pour les informations de santé"""

    success: bool
    message: str
    health_data: Optional[dict] = None

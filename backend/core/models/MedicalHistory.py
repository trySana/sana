# mypy: ignore-errors
from datetime import datetime

from mongoengine import BooleanField
from mongoengine import DateField
from mongoengine import Document
from mongoengine import IntField
from mongoengine import ListField
from mongoengine import ReferenceField
from mongoengine import StringField

from .user import User


class MedicalHistory(Document):
    """Modèle pour l'historique médical de l'utilisateur"""

    user = ReferenceField(User, required=True, unique=True)

    # Informations personnelles de santé
    height = IntField(required=False, min_value=50, max_value=300)  # en cm
    weight = IntField(required=False, min_value=20, max_value=300)  # en kg
    blood_type = StringField(
        required=False, choices=["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    )

    # Antécédents médicaux
    medical_conditions = ListField(StringField(), required=False)  # maladies chroniques
    allergies = ListField(StringField(), required=False)  # allergies
    medications = ListField(StringField(), required=False)  # médicaments actuels

    # Mode de vie
    smoking_status = StringField(
        required=False, choices=["Jamais", "Ancien fumeur", "Fumeur actuel"]
    )
    alcohol_consumption = StringField(
        required=False, choices=["Aucune", "Occasionnelle", "Modérée", "Élevée"]
    )
    exercise_frequency = StringField(
        required=False,
        choices=["Jamais", "Rarement", "Parfois", "Souvent", "Quotidiennement"],
    )

    # Antécédents familiaux
    family_history = ListField(StringField(), required=False)  # maladies familiales

    # Dernière mise à jour
    last_updated = DateField(default=datetime.utcnow)

    meta = {"collection": "MedicalHistory", "indexes": ["user"]}

    def to_dict(self):
        """Convertit le document en dictionnaire"""
        return {
            "id": str(self.id),
            "user_id": str(self.user.id),
            "height": self.height,
            "weight": self.weight,
            "blood_type": self.blood_type,
            "medical_conditions": self.medical_conditions or [],
            "allergies": self.allergies or [],
            "medications": self.medications or [],
            "smoking_status": self.smoking_status,
            "alcohol_consumption": self.alcohol_consumption,
            "exercise_frequency": self.exercise_frequency,
            "family_history": self.family_history or [],
            "last_updated": self.last_updated.isoformat()
            if self.last_updated
            else None,
        }

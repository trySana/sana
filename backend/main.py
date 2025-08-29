import hashlib
from datetime import datetime

import openai
from core.config import logger
from core.config import settings
from core.models.MedicalHistory import MedicalHistory
from core.models.user import Authentification
from core.models.user import CreateUser
from core.models.user import HealthInfoRequest
from core.models.user import HealthInfoResponse
from core.models.user import UpdateUser
from core.models.user import User
from core.utils.connection import database_connection
from core.utils.llm_parser import parse_medical_text
from core.utils.whisper_stt import WhisperSTT
from fastapi import FastAPI
from fastapi import File
from fastapi import HTTPException
from fastapi import status
from fastapi import UploadFile
from fastapi.middleware.cors import CORSMiddleware
from mongoengine.connection import disconnect_all


# whisper_stt = WhisperSTT()  # Temporairement désactivé pour les tests


client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

logger.info("Starting the API...")
app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:3000",
        "http://localhost:19006",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("API started.")


@app.get("/")
async def read_root():
    logger.info("Route / called")
    return {"message": "Hello World"}


@app.post("/create_user/")
async def create_user(input: CreateUser) -> dict:
    """Create user

    Args:
        input (CreateUser): Input

    Returns:
        dict: User creation result
    """
    try:
        logger.info("Hashing password...")
        hasher = hashlib.blake2b(
            input.password.encode("utf-8"),
            digest_size=15,
            salt=settings.SALT.encode("utf-8"),
        ).hexdigest()

        logger.info("Connecting to database...")
        database_connection()

        logger.info("Creating user...")
        user = User(
            username=input.username,
            password=hasher,
            email=input.email,
            sex=input.sex,
            date_of_birth=input.date_of_birth,
        )
        user.save()

        logger.info("Closing database connection...")
        disconnect_all()

        return {
            "success": True,
            "message": "User created successfully",
            "user_id": str(user.id),
        }

    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        disconnect_all()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}",
        )


@app.post("/authentificate/")
async def authentificate(input: Authentification) -> dict:
    """Authentificate

    Args:
        input (Authentification): Input

    Returns:
        dict: Authentication result
    """
    try:
        logger.info("Hashing password...")
        hasher = hashlib.blake2b(
            input.password.encode("utf-8"),
            digest_size=15,
            salt=settings.SALT.encode("utf-8"),
        ).hexdigest()

        logger.info("Connecting to database...")
        database_connection()

        logger.info("Authenticating...")
        user = User.objects(  # type: ignore[attr-defined]
            username=input.username, password=hasher
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password.",
            )

        logger.info("Closing database connection...")
        disconnect_all()

        return {
            "success": True,
            "message": "Authentication successful",
            "user": {
                "username": user.username,
                "email": user.email,
                "sex": user.sex,
                "date_of_birth": str(user.date_of_birth),
                "phone_number": user.phone_number,
                "bio": user.bio,
                "profile_image": user.profile_image,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during authentication: {str(e)}")
        disconnect_all()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}",
        )

        # @app.post("/stt/")
        # async def stt(file: UploadFile = File(...)):
        #     temp_path = f"/tmp/{file.filename}"
        #     with open(temp_path, "wb") as buffer:
        #         buffer.write(await file.read())
        #     text = await whisper_stt.transcribe_audio(temp_path)
        #     parsed = parse_medical_text(text)
        #     return {"text": text, "parsed": parsed}

        return True


@app.put("/update_profile/{username}")
async def update_profile(username: str, update_data: UpdateUser) -> dict:
    """Update user profile

    Args:
        username (str): Username to update
        update_data (UpdateUser): Update data

    Returns:
        dict: Profile update result
    """
    try:
        logger.info(f"Updating profile for user: {username}")

        # Connect to database
        database_connection()

        # Find user
        user = User.objects(username=username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        # Update fields if provided
        update_fields = {}
        if update_data.username is not None:
            # Check if new username is already taken
            existing_user = User.objects(username=update_data.username).first()
            if existing_user and existing_user.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken",
                )
            update_fields["username"] = update_data.username

        if update_data.email is not None:
            # Check if new email is already taken
            existing_user = User.objects(email=update_data.email).first()
            if existing_user and existing_user.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already taken",
                )
            update_fields["email"] = update_data.email

        if update_data.sex is not None:
            update_fields["sex"] = update_data.sex

        if update_data.date_of_birth is not None:
            update_fields["date_of_birth"] = update_data.date_of_birth

        if update_data.phone_number is not None:
            update_fields["phone_number"] = update_data.phone_number

        if update_data.bio is not None:
            update_fields["bio"] = update_data.bio

        if update_data.profile_image is not None:
            update_fields["profile_image"] = update_data.profile_image

        # Update user
        if update_fields:
            User.objects(id=user.id).update_one(**update_fields)
            logger.info(f"Profile updated successfully for user: {username}")

        # Close database connection
        disconnect_all()

        return {
            "success": True,
            "message": "Profile updated successfully",
            "updated_fields": list(update_fields.keys()),
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        disconnect_all()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}",
        )


@app.post("/health_info/{username}/update")
async def update_health_info(
    username: str, health_data: HealthInfoRequest
) -> HealthInfoResponse:
    """Mettre à jour les informations de santé d'un utilisateur"""
    try:
        # Connect to database
        database_connection()

        # Vérifier que l'utilisateur existe
        user = User.objects(username=username).first()
        if not user:
            return HealthInfoResponse(
                success=False, message=f"Utilisateur {username} non trouvé"
            )

        # Créer ou mettre à jour l'historique médical
        medical_history = MedicalHistory.objects(user=user).first()
        if not medical_history:
            medical_history = MedicalHistory(user=user)

        # Mettre à jour les champs fournis
        update_fields = health_data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            if value is not None:
                setattr(medical_history, field, value)

        medical_history.last_updated = datetime.utcnow()
        medical_history.save()

        return HealthInfoResponse(
            success=True,
            message="Informations de santé mises à jour avec succès",
            health_data=medical_history.to_dict(),
        )

    except Exception as e:
        logger.error(
            f"Erreur lors de la mise à jour des informations de santé: {str(e)}"
        )
        return HealthInfoResponse(
            success=False, message=f"Erreur lors de la mise à jour: {str(e)}"
        )


@app.get("/health_info_v2/{username}")
async def get_health_info_v2(username: str) -> HealthInfoResponse:
    """Récupérer les informations de santé d'un utilisateur - VERSION CORRIGEE"""
    try:
        # Connect to database
        logger.info("DEBUG: About to call database_connection()")
        database_connection()
        logger.info("DEBUG: database_connection() called successfully")

        # Vérifier que l'utilisateur existe
        user = User.objects(username=username).first()
        if not user:
            logger.info(f"DEBUG: User {username} not found")
            return HealthInfoResponse(
                success=False, message=f"Utilisateur {username} non trouvé"
            )

        # Récupérer l'historique médical
        medical_history = MedicalHistory.objects(user=user).first()

        if not medical_history:
            logger.info(f"DEBUG: No medical history found for user {username}")
            return HealthInfoResponse(
                success=True,
                message="Aucune information de santé trouvée",
                health_data={},
            )

        logger.info(f"DEBUG: Medical history found for user {username}")
        return HealthInfoResponse(
            success=True,
            message="Informations de santé récupérées avec succès",
            health_data=medical_history.to_dict(),
        )

    except Exception as e:
        logger.error(f"DEBUG: Error in get_health_info_v2: {str(e)}")
        return HealthInfoResponse(
            success=False, message=f"Erreur lors de la récupération: {str(e)}"
        )

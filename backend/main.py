from fastapi import FastAPI
from mongoengine.connection import disconnect_all

from backend.core.config import logger
from backend.core.utils.connection import database_connection
from backend.core.utils.text_to_speech import Jenny


jenny = Jenny()

logger.info("Starting the API...")
app = FastAPI()
logger.info("API started.")


@app.on_event("startup")
async def startup_db_client():
    logger.info("Connecting to MongoDB...")
    database_connection()
    logger.info("Connected to MongoDB.")


@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Disconnecting from MongoDB...")
    disconnect_all()
    logger.info("Disconnected from MongoDB.")


@app.get("/")
async def read_root():
    logger.info("Route / called")
    return {"message": "Hello World"}

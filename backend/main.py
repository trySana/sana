from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import logger, settings

app = FastAPI()
mongodb_client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global mongodb_client, db
    logger.info("Connecting to MongoDB...")
    mongodb_client = AsyncIOMotorClient(settings.MONGO_URI)
    db = mongodb_client[settings.MONGO_DB]
    logger.info("Connected to MongoDB.")

@app.on_event("shutdown")
async def shutdown_db_client():
    global mongodb_client
    logger.info("Disconnecting from MongoDB...")
    mongodb_client.close()
    logger.info("Disconnected from MongoDB.")

@app.get("/")
async def read_root():
    logger.info("Route / called")
    return {"message": "Hello World"}       


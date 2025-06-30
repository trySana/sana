

Sana, built with **FastAPI**, **MongoDB**, and **OpenAI** integration.


# Setup Instructions

### 1. Create a Virtual Environment

```bash
pip install virtualenv
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```
pip install -r requirements.txt
```
### Configure Environment Variables
```
MONGO_DB=your_database_name
MONGO_URI=mongodb://localhost:27017
OPENAI_API_KEY=your_openai_api_key

MONGO_USER=your_mongo_user
MONGO_PWD=your_mongo_password
MONGO_HOST=your_mongo_host  # Example: cluster0.mongodb.net
```

These variables are used by the Pydantic Settings class in config.py.


### 4. Run the Backend Server

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

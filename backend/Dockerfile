# ---- Base image ----
FROM python:3.10-slim

# ---- Set working directory ----
WORKDIR /app

# ---- Install system dependencies ----
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ---- Install Python dependencies ----
COPY requirements.txt .
COPY requirement-dev.txt .

RUN pip install --no-cache-dir -r requirement-dev.txt

# ---- Copy the source code ----
COPY . .

# ---- Expose FastAPI port ----
EXPOSE 8000

# ---- Command to run the app ----
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
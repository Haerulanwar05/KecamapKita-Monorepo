# Stage 1: Build & Dependencies
FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY kecamapkita-backend/requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production Runtime
FROM python:3.12-slim

WORKDIR /app

COPY --from=builder /install /usr/local

COPY kecamapkita-backend .

# Jalankan seeder database SQLite saat proses build kontainer
RUN python seed.py

# Hugging Face Spaces menggunakan port standar 7860
EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

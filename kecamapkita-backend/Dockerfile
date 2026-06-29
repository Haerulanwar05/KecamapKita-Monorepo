# Stage 1: Build & Dependencies
FROM python:3.12-slim AS builder

WORKDIR /app

# Install system dependencies required for compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production Runtime
FROM python:3.12-slim

WORKDIR /app

# Copy python dependencies from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY . .

# Expose standard FastAPI port
EXPOSE 8000

# Start Uvicorn worker (single worker required for SQLite file concurrency)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

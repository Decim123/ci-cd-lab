FROM python:3.11-slim

RUN ulimit -s unlimited && \
    ulimit -n 65536

# рабочая директория
WORKDIR /app

# Копирование зависимостей
COPY requirements.txt .

# Установка зависимостей
RUN pip install --progress-bar off -r requirements.txt

# Копирование приложения
COPY ./app ./app

# Запуск uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

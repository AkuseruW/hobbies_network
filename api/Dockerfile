# FROM python:3.11-slim
# WORKDIR /api
# COPY requirements.txt /api/requirements.txt
# RUN pip install --no-cache-dir --upgrade -r requirements.txt
# COPY . /api

FROM python:3.10.6-slim

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt
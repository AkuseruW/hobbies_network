from sqlalchemy import create_engine
import redis
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os

load_dotenv()

postgres_url = os.getenv('POSTGRES_URL')
redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')
redis_password = os.getenv('REDIS_PASSWORD')

SQLALCHEMY_DATABASE_URL = postgres_url

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_session():
    with SessionLocal() as session:
        yield session
        
redis_client = redis.Redis(
    host=redis_host,
    port=redis_port,
    password=redis_password,
)
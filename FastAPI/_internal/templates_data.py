main = '''
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.api.main_router import api_router
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,host=settings.HOST,port=settings.PORT)

'''

dockerfile = '''

FROM python:3.10

ENV PYTHONUNBUFFERED=1

WORKDIR /app/

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.5.11 /uv /uvx /bin/

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/app/.venv/bin:$PATH"

# Compile bytecode
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#compiling-bytecode
ENV UV_COMPILE_BYTECODE=1

# uv Cache
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#caching
ENV UV_LINK_MODE=copy

# Install dependencies
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

ENV PYTHONPATH=/app

COPY ./scripts /app/scripts

COPY ./pyproject.toml ./uv.lock ./alembic.ini /app/

COPY ./app /app/app

# Sync the project
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync

CMD ["fastapi", "run", "--workers", "4", "app/main.py"]
'''

dockerignore='''
__pycache__
*.pyc
.venv
.env
.git
*.egg-info
.pytest_cache
.coverage
'''

gitignore = '''
# Python-generated files
__pycache__/
*/__pycache__/*
*.py[oc]

# Distribution / packaging
.Python
build/
downloads/
lib/
lib64/
parts/
sdist/
pip-wheel-metadata/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Translations
*.mo
*.pot

# dist/
wheels/
*.egg-info

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/
*env

# pyenv
.python-version
 
# C extensions
*.so

'''

docker_compose = '''
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+psycopg2://postgres:password@db:5432/fastapi_db
      - SECRET_KEY=your-secret-key-here
      - DEBUG=True
    depends_on:
      - db
    volumes:
      - .:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=fastapi_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
'''

env = '''
# ───── Application Config ─────
PROJECT_NAME=FastAPI_Template
DEBUG=True
ENVIRONMENT=local
API_V1_PREFIX=/api/v1

# ───── Server Config ─────
HOST=0.0.0.0
PORT=8000
RELOAD=True

# ───── Database Config ─────
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/project_db
# POSTGRES_URI="postgresql+psycopg2://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
# ───── OR ─────
# POSTGRES_DB=my_db
# POSTGRES_PASSWORD=postgres
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
# POSTGRES_SCHEMA=postgresql
# POSTGRES_USERNAME=postgres

# ───── Security Config ─────
SECRET_KEY=MSBCXDFHSDFHSDFHSDFHSDFHJSDFHJSDFHJSDFHJSDFHJSDFHJSDFHJSDFHJSDFHJSDFH
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

#───── Hash Functions ─────
HASHING_ALGORITHM=bcrypt

# ───── Email Service ─────
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
EMAILS_FROM_EMAIL=your_email@example.com
EMAILS_FROM_NAME=FastAPI App

# ───── Other Services ─────
REDIS_URL=redis://localhost:6379/0

'''

requirements = '''
annotated-types==0.7.0
anyio==4.10.0
bcrypt==4.3.0
cffi==1.17.1
click==8.1.8
colorama==0.4.6
cryptography==45.0.7
dnspython==2.7.0
email-validator==2.3.0
exceptiongroup==1.3.0
fastapi==0.116.1
greenlet==3.2.4
h11==0.16.0
idna==3.10
jwt==1.4.0
passlib==1.7.4
psycopg2-binary==2.9.10
pycparser==2.22
pydantic==2.11.7
pydantic-core==2.33.2
pydantic-settings==2.10.1
pyjwt==2.10.1
python-decouple==3.8
python-dotenv==1.1.1
python-multipart==0.0.20
sniffio==1.3.1
sqlalchemy==2.0.43
starlette==0.47.3
typing-extensions==4.15.0
typing-inspection==0.4.1
uvicorn==0.35.0
'''

pyproject_toml = '''
[project]
name = "fastapi-boilerplate"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.9"
dependencies = [
    "bcrypt>=4.3.0",
    "fastapi>=0.116.1",
    "jwt>=1.4.0",
    "passlib>=1.7.4",
    "psycopg2-binary>=2.9.10",
    "pydantic-settings>=2.10.1",
    "pydantic[email]>=2.11.7",
    "pyjwt>=2.10.1",
    "python-decouple>=3.8",
    "python-multipart>=0.0.20",
    "sqlalchemy>=2.0.43",
    "uvicorn>=0.35.0",
]
'''

alembic_ini = '''
# A generic, single database configuration.

[alembic]
# path to migration scripts
script_location = app/alembic

# template used to generate migration files
# file_template = %%(rev)s_%%(slug)s

# timezone to use when rendering the date
# within the migration file as well as the filename.
# string value is passed to dateutil.tz.gettz()
# leave blank for localtime
# timezone =

# max length of characters to apply to the
# "slug" field
#truncate_slug_length = 40

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false

# set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
# sourceless = false

# version location specification; this defaults
# to alembic/versions.  When using multiple version
# directories, initial revisions must be specified with --version-path
# version_locations = %(here)s/bar %(here)s/bat alembic/versions

# the output encoding used when revision files
# are written from script.py.mako
# output_encoding = utf-8

# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
'''

readme = '''
# FastAPI Project - Backend

## Description
This is a boilerplate project for building a backend using FastAPI. It includes essential configurations, modules, and utilities to get you started quickly.

## Features
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Docker**: Containerization support for easy deployment.
- **Alembic**: Database migration tool.
- **Pydantic**: Data validation and parsing using Python type annotations.
- **SQLAlchemy**: ORM for database interactions.
- **Security**: Basic authentication and authorization using JWT tokens.
- **Logging**: Configured logging for better debugging and monitoring.

## Installation

### Option 1: Using `pip`

1.  **Create virtual environment**
    ``` sh
    python -m venv .venv
    ```
2.  **Activate environment**

    ``` sh
    .venv\Scripts\activate   # Windows
    source .venv/bin/activate  # Linux/Mac
    ```

3.  **Install dependencies**

    ``` sh
    pip install -r requirements.txt
    ```

4.  **Set up environment variables**

    -   Update `.env` with your configuration values (DB URL, JWT
        secret, etc.).

------------------------------------------------------------------------

### Option 2: Using `uv` (recommended ⚡)

[`uv`](https://github.com/astral-sh/uv) is a modern, fast Python package
manager.

1.  **Initialize environment**

    ``` sh
    uv init
    ```

2.  **Install dependencies**

    ``` sh
    uv add -r requirements.txt
    ```

3.  **Run the app**

    ``` sh
    uv run uvicorn main:app --reload
    ```

✅ `uv` automatically handles virtual environments, caching, and
dependency resolution.
## Usage
- **API Endpoints:**
  - **Auth Module:**
    - `/auth/login`: POST - User login
    - `/auth/register`: POST - User registration
  - **User Module:**
    - `/user/list`: GET - List all users
    - `/user/create`: POST - Create a new user
    - `/user/{user_id}`: GET - Get user details by ID

- **Database Migrations:**
  - **Create alembic init:**
    ```sh
    alembic init app/alembic
    ```
  - **Create a new migration:**
    ```sh
    alembic revision --autogenerate -m "Initial migration"
    ```
  - **Apply migrations:**
    ```sh
    alembic upgrade head
    ```
## Code Linting
We use Ruff to keep our Python code clean and consistent.

### Run the following commands to use Ruff:

```sh
pip install ruff      # Install Ruff

python -m ruff --version    # Check Ruff version

python -m ruff check        # Lint all Python files

python -m ruff check --fix  # Automatically fix issues
```
'''
retry_utils = '''
# retry_utils.py

from tenacity import (
    retry,
    stop_after_attempt,
    wait_fixed,
    retry_if_exception_type,
    AsyncRetrying
)

# --- Synchronous Retry Decorator ---
def retry_on_exception(
    exception_type=Exception,
    max_attempts=3,
    wait_seconds=5,
):
    """
    Decorator to retry sync functions on specific exception types.

    Usage:
        @retry_on_exception(SomeError)
        def your_func(): ...
    """
    return retry(
        stop=stop_after_attempt(max_attempts),
        wait=wait_fixed(wait_seconds),
        retry=retry_if_exception_type(exception_type),
        reraise=True
    )


# --- Async Retry Function Wrapper ---
async def async_retry_on_exception(
    func,
    exception_type=Exception,
    max_attempts=3,
    wait_seconds=2,
    *args,
    **kwargs
):
    """
    Retry wrapper for async functions. Pass the function and its arguments.

    Usage:
        result = await async_retry_on_exception(your_async_func, args...)

    Example:
        await async_retry_on_exception(fetch_data, httpx.RequestError)
    """
    async for attempt in AsyncRetrying(
        stop=stop_after_attempt(max_attempts),
        wait=wait_fixed(wait_seconds),
        retry=retry_if_exception_type(exception_type),
        reraise=True
    ):
        with attempt:
            return await func(*args, **kwargs)
'''
# -----------------CORE FOLDER-----------#
core_config = '''
# app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "FastAPI Template"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"  # development | staging | production
    API_V1_PREFIX: str = "/api/v1"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    HASHING_ALGORITHM: str
    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    # Other services
    REDIS_URL: Optional[str] = None

    # ✅ Pydantic v2 config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        case_sensitive=True,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
'''
core_security = '''
# app/core/security.py

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ───── Password Hashing ─────
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed one."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)
'''
core_middleware='''
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import logging
from logging.handlers import RotatingFileHandler
import os
import json
import time
from typing import Any, Dict
from fastapi import HTTPException
from fastapi.responses import JSONResponse

# --- Setup logger (file + console) ---
os.makedirs("logs", exist_ok=True)
log_file = "logs/api.log"

logger = logging.getLogger("api-logger")
logger.setLevel(logging.INFO)

formatter = logging.Formatter("%(asctime)s | LEVEL: %(levelname)s | %(message)s")

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)

file_handler = RotatingFileHandler(
    log_file, maxBytes=5*1024*1024, backupCount=5, encoding="utf-8"
)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(formatter)

if not logger.handlers:
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

# --- Sensitive fields ---
SENSITIVE_KEYS = {"password", "token", "secret", "authorization"}


def mask_sensitive(data: Any) -> Any:
    if isinstance(data, dict):
        return {
            k: ("***" if k.lower() in SENSITIVE_KEYS else mask_sensitive(v))
            for k, v in data.items()
        }
    elif isinstance(data, list):
        return [mask_sensitive(i) for i in data]
    return data


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_ip = request.client.host if request.client else "unknown"

        try:
            body_bytes = await request.body()
            body = body_bytes.decode("utf-8")
            try:
                parsed_body = mask_sensitive(json.loads(body))
            except Exception:
                parsed_body = body[:500]
        except Exception:
            parsed_body = None

        headers = {
            k: ("***" if k.lower() in SENSITIVE_KEYS else v)
            for k, v in dict(request.headers).items()
            if k.lower() in {"content-type", "user-agent", "authorization"}
        }

        
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            response_body = b""
            async for chunk in response.body_iterator:
                response_body += chunk

            response = Response(
                content=response_body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type,
            )

            try:
                body_str = response_body.decode("utf-8")
                parsed_response = mask_sensitive(json.loads(body_str))
            except Exception:
                parsed_response = body_str[:500] if body_str else None

        except Exception as e:
            # ✅ If the route raises an exception, catch it here
            process_time = (time.time() - start_time) * 1000
            parsed_response = {"error": str(e)}
            response = JSONResponse(content=parsed_response, status_code=500)

            # --- Build log line ---
            log_line = (
                f"client_ip={client_ip} | "
                f"method={request.method} | "
                f"path={request.url.path} | "
                f"query_params={dict(request.query_params)} | "
                f"headers={headers} | "
                f"request_body={parsed_body} | "
                f"status_code={response.status_code} | "
                f"response_time_ms={round(process_time, 2)} | "
                f"response_body={parsed_response}"
            )

            if response.status_code >= 500:
                logger.error(log_line)
            elif response.status_code >= 400:
                logger.warning(log_line)
            else:
                logger.info(log_line)

            return response
        return response
'''

redis_client = '''import redis
from redis import Redis


class RedisError(Exception):
    """Custom exception for Redis errors."""


class RedisClient:
    """
    A Redis client wrapper class for simplified interaction with Redis.
    """

    def __init__(
        self,
        client: Redis = None,
        host: str = "localhost",
        port: int = 6379,
        db: int = 0,
    ):
        """
        Initializes the Redis client.

        Args:
            host (str): Redis server host. Defaults to "localhost".
            port (int): Redis server port. Defaults to 6379.
            db (int): Redis database index. Defaults to 0.
        """
        if client is not None and isinstance(client, Redis):
            self.client = client
        else:
            self.client = redis.Redis(host=host, port=port, db=db)

    def get(self, key: str):
        """
        Retrieves the value associated with the given key from Redis.

        Args:
            key (str): The key to retrieve the value for.

        Returns:
            str: The value associated with the key, or None if the key does not exist.

        Raises:
            RedisError: If there is an error during the Redis operation.
        """
        try:
            return self.client.get(key)
        except redis.RedisError as e:
            raise RedisError(str(e))

    def set(self, key: str, value: str, ex: int):
        """
        Sets the value for the given key in Redis.

        Args:
            key (str): The key to set the value for.
            value (str): The value to be set.
            ex (int): Expiration time in seconds for the key.

        Raises:
            RedisError: If there is an error during the Redis operation.
        """
        try:
            self.client.set(key, value, ex=ex)
        except redis.RedisError as e:
            raise RedisError(str(e))

    def incr(self, key: str):
        """
        Increments the value associated with the given key in Redis.

        Args:
            key (str): The key to increment.

        Returns:
            int: The incremented value.

        Raises:
            RedisError: If there is an error during the Redis operation.
        """
        try:
            return self.client.incr(key)
        except redis.RedisError as e:
            raise RedisError(str(e))

    def expire(self, key: str, ex: int):
        """
        Sets an expiration time for the given key in Redis.

        Args:
            key (str): The key to set the expiration for.
            ex (int): Expiration time in seconds for the key.

        Raises:
            RedisError: If there is an error during the Redis operation.
        """
        try:
            self.client.expire(key, ex)
        except redis.RedisError as e:
            raise RedisError(str(e))
 



 '''



# ----------------DATABASE---------------#
db_base = '''
# app/db/base.py

from sqlalchemy.orm import declarative_base

Base = declarative_base()
'''

db_session = '''
# app/db/session.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create the SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True,
)

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

'''

# ----------------AUTH MODULE---------------#
auth_crud = '''
from decouple import config
from typing import Annotated,Optional

from jwt import PyJWTError
from app.modules.auth.models import TokenData
from app.modules.auth.utility import verify_password

from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from datetime import datetime, timedelta, timezone
import jwt
from app.db.session import get_db
from app.modules.user.models import User
from app.modules.user.crud import get_user_by_username
from app.core.config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def authenticate_user(username: str, password: str, db:Session = Depends(get_db)):
    user = get_user_by_username(db,username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db:Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
        
    except PyJWTError:
        raise credentials_exception
    user = get_user_by_username(db, username = token_data.username)#type:ignore
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user
'''
auth_router = '''
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from typing import Annotated
from app.modules.auth.models import Token
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.modules.auth.crud import authenticate_user, create_access_token
from app.db.session import get_db

auth_router = APIRouter(
    prefix='/auth',
    tags=['Auth'],
)


@auth_router.post('/token')
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
) -> Token:
    user = authenticate_user(form_data.username, form_data.password, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=1440)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")
'''
auth_models = '''
from pydantic import BaseModel
from typing import Optional
class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    username: Optional[str] = None
'''
auth_utils = '''
from bcrypt import hashpw, gensalt, checkpw

def get_password_hash(password: str) -> str:
    return hashpw(password.encode("utf-8"), gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except ValueError:
        return False
'''

# ----------------USER MODULE---------------#
user_crud='''
from sqlalchemy.orm import Session

from app.modules.auth.utility import get_password_hash
from app.modules.user.models import User
from app.modules.user.schemas import UserCreate


def get_users(db: Session):
    return db.query(User).all()


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username:str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        email=str(user.email),
        username=user.username,
        password=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return
'''
user_router = '''
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.modules.auth.crud import get_current_active_user
from app.db.session import get_db
from app.modules.user.models import User
from app.modules.user.schemas import UserSchema, UserCreate
from app.modules.user.crud import get_users, create_user, get_user, delete_user

user_router = APIRouter(
    prefix='/users',
    tags=['Users']
)


@user_router.get('/', response_model=list[UserSchema])
def users_list(db: Session = Depends(get_db)):
    db_users = get_users(db)

    return db_users


@user_router.get('/me', response_model=UserSchema)
def user_list(current_user: User = Depends(get_current_active_user)):
    return current_user



@user_router.get('/{user_id}', response_model=UserSchema)
def user_detail(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user


@user_router.delete('/{user_id}')
def user_delete(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    delete_user(db, db_user.id)
    return {"message": "User deleted"}


@user_router.post("/", response_model=UserSchema)
def user_post(user: UserCreate, db:Session = Depends(get_db)):
    return create_user(db, user)
'''
user_models = '''
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, DateTime
from app.db.base import Base
from datetime import datetime, timezone


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int]                 = mapped_column(Integer, primary_key=True)
    username: Mapped[str]           = mapped_column(String(32), unique=True, nullable=False)
    email: Mapped[str]              = mapped_column(String(64), unique=True, nullable=False)
    password: Mapped[str]           = mapped_column(String(128), nullable=False)
    is_active: Mapped[bool]         = mapped_column(Boolean, default=True)
    created_at: Mapped[DateTime]    = mapped_column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[DateTime]    = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
'''
user_schemas = '''
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserSchema(UserBase):
    id: int

    class Config:
        from_attributes = True
'''
#------------------API ----------------#
main_router = '''
from fastapi import APIRouter

from app.core.config import settings
# -------- ALL modules import ----------#
from app.modules.auth.router import auth_router
from app.modules.user.router import user_router


api_router = APIRouter()
# Example router import
api_router.include_router(auth_router)
api_router.include_router(user_router)
'''

# --------------------alembic---------------#
alembic_env = '''
# alembic/env.py

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

import sys
import pathlib

# Add app folder to sys.path for imports
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1] / "app"))

from app.core.config import settings
from app.db.base import Base  # Import your Base for autogenerate

# ---------------------- Import all models here for Alembic -------------------#
# Import all models here so Alembic sees 

# from app.modules.user import models as user_models
# from app.modules.auth import models as auth_models
# from app.modules.books import models as book_models

# ------------------------------------------------------------------------------#

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set DB URL dynamically from settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

target_metadata = Base.metadata

# 
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
'''

# --------------------helpers---------------#

message = '''

# ============================================================
# Centralized Message Repository for API & CLI
# ============================================================

# =====================
# General Errors
# =====================
GENERAL_ERRORS = {
    "invalid_input": "The input provided is invalid.",
    "bad_request": "The request could not be understood or was missing parameters.",
    "not_found": "The requested resource was not found.",
    "method_not_allowed": "The HTTP method is not allowed for this endpoint.",
    "internal_server_error": "An unexpected error occurred. Please try again later.",
    "service_unavailable": "The service is temporarily unavailable. Please try again later.",
    "unsupported_media": "Unsupported media type in request.",
    "too_many_requests": "Too many requests. Please try again later.",
}

# =====================
# Authentication & Authorization
# =====================
AUTH_ERRORS = {
    "unauthorized": "You are not authorized. Please provide valid credentials.",
    "forbidden": "You do not have permission to perform this action.",
    "token_expired": "Authentication token has expired. Please login again.",
    "invalid_token": "Invalid authentication token provided.",
    "missing_token": "Authentication token is required.",
    "invalid_credentials": "Invalid username or password.",
    "account_locked": "Your account is locked. Contact support.",
    "account_inactive": "Your account is inactive. Please verify your email.",
}

# =====================
# Validation Errors
# =====================
VALIDATION_ERRORS = {
    "missing_fields": "Required fields are missing.",
    "invalid_type": "Invalid data type provided.",
    "invalid_email": "Please provide a valid email address.",
    "invalid_id": "The provided ID is invalid.",
    "invalid_format": "Data format is incorrect.",
    "min_length": "Input is too short.",
    "max_length": "Input is too long.",
    "value_out_of_range": "Input value is out of allowed range.",
    "password_strength": "Password must contain uppercase, lowercase, numbers, and special characters.",
}

# =====================
# Database Errors
# =====================
DB_ERRORS = {
   50010: "Token is expired, please re login.",
    50009: "Token is not valid, Please provide valid token.",
    50008: "Incorrect username or password.",
    50001: "User email already exists in system, please provide valid user email.",
    50006: "User not exists in system, please provide valid user details.",
    50011: "User '{}' is locked, please contact administrator for it.",
    50012: "User '{}' is inactive, please contact administrator for it.",
}

# =====================
# Request Errors
# =====================
REQUEST_ERRORS = {
    "invalid_query": "The query parameters are invalid.",
    "invalid_body": "The request body is invalid or malformed.",
    "invalid_headers": "Invalid or missing headers.",
    "timeout": "The request timed out.",
    "payload_too_large": "The request payload is too large.",
}

# =====================
# File Handling Errors
# =====================
FILE_ERRORS = {
    "file_not_found": "The requested file does not exist.",
    "file_too_large": "The uploaded file exceeds the allowed size limit.",
    "unsupported_file": "Unsupported file type.",
    "upload_failed": "File upload failed.",
    "read_error": "Failed to read the file.",
    "write_error": "Failed to write the file.",
    "permission_error": "Insufficient permissions to access the file.",
}


# =====================
# Network/External API Errors
# =====================
NETWORK_ERRORS = {
    "api_unreachable": "External API is unreachable.",
    "api_timeout": "External API request timed out.",
    "api_invalid_response": "External API returned an invalid response.",
    "dns_error": "DNS resolution failed.",
    "connection_refused": "Connection to external service was refused.",
    "ssl_error": "SSL certificate validation failed.",
}

# =====================
# Success Messages
# =====================
SUCCESS_MESSAGES = {
    "created": "Resource created successfully.",
    "updated": "Resource updated successfully.",
    "deleted": "Resource deleted successfully.",
    "fetched": "Data retrieved successfully.",
    "executed": "Command executed successfully.",
    "login_success": "Logged in successfully.",
    "logout_success": "Logged out successfully.",
    "email_sent": "Email has been sent successfully.",
    "file_uploaded": "File uploaded successfully.",
}

# =====================
# Informational / Warnings
# =====================
INFO_MESSAGES = {
    "deprecated": "This endpoint is deprecated and will be removed in future versions.",
    "retry": "The operation failed. Please try again later.",
    "partial_success": "The operation completed with partial success.",
}

'''



# ----------------APP MODULE TEMPLATES---------------#
def get_app_model_template(app_name: str) -> str:
    return f'''from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime
from app.db.base import Base
from datetime import datetime, timezone


class {app_name.capitalize()}(Base):
    __tablename__ = '{app_name}s'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
'''

def get_app_schema_template(app_name: str) -> str:
    return f'''from pydantic import BaseModel
from datetime import datetime


class {app_name.capitalize()}Base(BaseModel):
    name: str


class {app_name.capitalize()}Create({app_name.capitalize()}Base):
    pass


class {app_name.capitalize()}Schema({app_name.capitalize()}Base):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
'''

def get_app_crud_template(app_name: str) -> str:
    return f'''from sqlalchemy.orm import Session
from .models import {app_name.capitalize()}
from .schemas import {app_name.capitalize()}Create


def get_{app_name}s(db: Session):
    return db.query({app_name.capitalize()}).all()


def get_{app_name}(db: Session, {app_name}_id: int):
    return db.query({app_name.capitalize()}).filter({app_name.capitalize()}.id == {app_name}_id).first()


def create_{app_name}(db: Session, {app_name}: {app_name.capitalize()}Create):
    db_{app_name} = {app_name.capitalize()}(**{app_name}.dict())
    db.add(db_{app_name})
    db.commit()
    db.refresh(db_{app_name})
    return db_{app_name}


def delete_{app_name}(db: Session, {app_name}_id: int):
    db_{app_name} = db.query({app_name.capitalize()}).filter({app_name.capitalize()}.id == {app_name}_id).first()
    if db_{app_name}:
        db.delete(db_{app_name})
        db.commit()
    return db_{app_name}
'''

def get_app_router_template(app_name: str) -> str:
    return f'''from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from .schemas import {app_name.capitalize()}Schema, {app_name.capitalize()}Create
from .crud import get_{app_name}s, get_{app_name}, create_{app_name}, delete_{app_name}

{app_name}_router = APIRouter(
    prefix='/{app_name}s',
    tags=['{app_name.capitalize()}s']
)


@{app_name}_router.get('/', response_model=list[{app_name.capitalize()}Schema])
def list_{app_name}s(db: Session = Depends(get_db)):
    return get_{app_name}s(db)


@{app_name}_router.get('/{{id}}', response_model={app_name.capitalize()}Schema)
def get_{app_name}_detail(id: int, db: Session = Depends(get_db)):
    {app_name} = get_{app_name}(db, id)
    if not {app_name}:
        raise HTTPException(status_code=404, detail="{app_name.capitalize()} not found")
    return {app_name}


@{app_name}_router.post('/', response_model={app_name.capitalize()}Schema)
def create_{app_name}_endpoint({app_name}: {app_name.capitalize()}Create, db: Session = Depends(get_db)):
    return create_{app_name}(db, {app_name})


@{app_name}_router.delete('/{{id}}')
def delete_{app_name}_endpoint(id: int, db: Session = Depends(get_db)):
    {app_name} = delete_{app_name}(db, id)
    if not {app_name}:
        raise HTTPException(status_code=404, detail="{app_name.capitalize()} not found")
    return {{"message": "{app_name.capitalize()} deleted"}}
'''

execeptions = '''

from app.core.helpers.message import GENERAL_ERRORS, AUTH_ERRORS, VALIDATION_ERRORS, DB_ERRORS, REQUEST_ERRORS, FILE_ERRORS, NETWORK_ERRORS, SUCCESS_MESSAGES, INFO_MESSAGES

class AppException(Exception):
    """Base exception for all custom app errors."""
    def __init__(self, message: str, code: int = 400):
        self.message = message
        self.code = code
        super().__init__(self.message)

    def to_dict(self):
        return {"error": self.message, "code": self.code}


# ==== General Errors ====
class InvalidInputError(AppException):
    def __init__(self):
        super().__init__(GENERAL_ERRORS["invalid_input"], code=400)


class NotFoundError(AppException):
    def __init__(self):
        super().__init__(GENERAL_ERRORS["not_found"], code=404)


class InternalServerError(AppException):
    def __init__(self):
        super().__init__(GENERAL_ERRORS["internal_server_error"], code=500)


# ==== Auth Errors ====
class UnauthorizedError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["unauthorized"], code=401)


class TokenExpiredError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["token_expired"], code=401)


class InvalidTokenError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["invalid_token"], code=401)


class ForbiddenError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["forbidden"], code=403)


class MissingTokenError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["missing_token"], code=401)


class InvalidCredentialsError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["invalid_credentials"], code=401)


class AccountLockedError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["account_locked"], code=403)


class AccountInactiveError(AppException):
    def __init__(self):
        super().__init__(AUTH_ERRORS["account_inactive"], code=403)


# ==== Validation Errors ====
class MissingFieldsError(AppException):
    def __init__(self):
        super().__init__(VALIDATION_ERRORS["missing_fields"], code=400)


class InvalidTypeError(AppException):
    def __init__(self):
        super().__init__(VALIDATION_ERRORS["invalid_type"], code=400)


class InvalidEmailError(AppException):
    def __init__(self):
        super().__init__(VALIDATION_ERRORS["invalid_email"], code=400)


class InvalidFormatError(AppException):
    def __init__(self):
        super().__init__(VALIDATION_ERRORS["invalid_format"], code=400)


# ==== Database Errors ====
class DatabaseError(AppException):
    def __init__(self, code: int):
        message = DB_ERRORS.get(code, "Database operation failed")
        super().__init__(message, code=500)


# ==== Request Errors ====
class InvalidQueryError(AppException):
    def __init__(self):
        super().__init__(REQUEST_ERRORS["invalid_query"], code=400)


class InvalidBodyError(AppException):
    def __init__(self):
        super().__init__(REQUEST_ERRORS["invalid_body"], code=400)


class RequestTimeoutError(AppException):
    def __init__(self):
        super().__init__(REQUEST_ERRORS["timeout"], code=408)


# ==== File Errors ====
class FileNotFoundError(AppException):
    def __init__(self):
        super().__init__(FILE_ERRORS["file_not_found"], code=404)


class FileTooLargeError(AppException):
    def __init__(self):
        super().__init__(FILE_ERRORS["file_too_large"], code=413)


class UnsupportedFileError(AppException):
    def __init__(self):
        super().__init__(FILE_ERRORS["unsupported_file"], code=400)


# ==== Network Errors ====
class APIUnreachableError(AppException):
    def __init__(self):
        super().__init__(NETWORK_ERRORS["api_unreachable"], code=503)


class APITimeoutError(AppException):
    def __init__(self):
        super().__init__(NETWORK_ERRORS["api_timeout"], code=504)


# ==== Success Messages ====
class AppSuccess:
    """Base class for success responses."""
    def __init__(self, message: str, code: int = 200):
        self.message = message
        self.code = code

    def to_dict(self):
        return {"message": self.message, "code": self.code}


class CreatedSuccess(AppSuccess):
    def __init__(self):
        super().__init__(SUCCESS_MESSAGES["created"], code=201)


class UpdatedSuccess(AppSuccess):
    def __init__(self):
        super().__init__(SUCCESS_MESSAGES["updated"], code=200)


class DeletedSuccess(AppSuccess):
    def __init__(self):
        super().__init__(SUCCESS_MESSAGES["deleted"], code=200)


class FetchedSuccess(AppSuccess):
    def __init__(self):
        super().__init__(SUCCESS_MESSAGES["fetched"], code=200)


class LoginSuccess(AppSuccess):
    def __init__(self):
        super().__init__(SUCCESS_MESSAGES["login_success"], code=200)


class FileUploadedSuccess(AppSuccess):
    def __init__(self):
        super().__init__(SUCCESS_MESSAGES["file_uploaded"], code=201)


# ==== Info Messages ====
class AppInfo:
    """Base class for informational messages."""
    def __init__(self, message: str, code: int = 200):
        self.message = message
        self.code = code

    def to_dict(self):
        return {"info": self.message, "code": self.code}


class DeprecatedInfo(AppInfo):
    def __init__(self):
        super().__init__(INFO_MESSAGES["deprecated"], code=200)


class RetryInfo(AppInfo):
    def __init__(self):
        super().__init__(INFO_MESSAGES["retry"], code=200)


class PartialSuccessInfo(AppInfo):
    def __init__(self):
        super().__init__(INFO_MESSAGES["partial_success"], code=206)


 '''




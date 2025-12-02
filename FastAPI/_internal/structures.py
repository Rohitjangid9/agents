# structures.py

# --- Base Project Structure ---
BASE_STRUCTURE = {
    "app": [
        "__init__.py",
        "modules/",
        "dependencies.py",
        "core/__init__.py",
        "core/config.py",
        "core/logger.py",
        "core/middleware.py",
        "core/security.py",
        "api/__init__.py",
        "api/main_router.py",
        "utils/retry_utils.py",
        "core/helpers/message.py",
        "core/helpers/exception.py",
        "core/redis_client.py"
       
    ],
    "tests": ["__init__.py"],
    "": [
        "Dockerfile",
        "docker-compose.yml",
        "main.py",
        ".env",
        ".gitignore",
        "requirements.txt",
        "README.md",
    ]
}

DB_STRUCTURE = {
    "app/db": ["__init__.py", "base.py", "session.py"],
    
}

AUTH_STRUCTURE = {
    "app/core": ["security.py"],
    "app/modules/auth": [
        "__init__.py",
        "models.py",
        "schemas.py",
        "crud.py",
        "router.py",
    ],
    "app/modules/user": [
        "__init__.py",
        "models.py",
        "schemas.py",
        "crud.py",
        "router.py",
    ],
    "tests": ["test_auth.py", "test_users.py"],
}

# App module structure template
APP_MODULE_STRUCTURE = {
    "app/modules/{app_name}": [
        "__init__.py",
        "models.py",
        "schemas.py",
        "crud.py",
        "router.py",
    ]
}

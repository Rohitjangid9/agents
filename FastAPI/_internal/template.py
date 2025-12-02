# template.py
import templates_data as data

FILE_TEMPLATES = {
    # Root files
    "main.py": data.main,
    "Dockerfile": data.dockerfile,
    "docker-compose.yml": data.docker_compose,
    ".dockerignore": data.dockerignore,
    ".gitignore": data.gitignore,
    ".env": data.env,
    "requirements.txt": data.requirements,
    "pyproject.toml": data.pyproject_toml,

    "README.md": data.readme,

    # Core
    "app/core/config.py": data.core_config,
    "app/core/security.py": data.core_security,
    'app/core/middleware.py': data.core_middleware,
    'app/core/helpers/message.py': data.message,
    'app/core/helpers/exception.py': data.execeptions,
    'app/core/redis_client.py': data.redis_client,
   

    # Database
    "app/db/base.py": data.db_base,
    "app/db/session.py": data.db_session,

    # Auth module
    "app/modules/auth/crud.py": data.auth_crud,
    "app/modules/auth/router.py": data.auth_router,
    "app/modules/auth/models.py": data.auth_models,
    "app/modules/auth/utility.py": data.auth_utils,

    # User module
    "app/modules/user/crud.py": data.user_crud,
    "app/modules/user/router.py": data.user_router,
    "app/modules/user/models.py": data.user_models,
    "app/modules/user/schemas.py": data.user_schemas,

    # API
    "app/api/main_router.py": data.main_router,

    # Alembic
    "alembic/env.py": data.alembic_env,

    # Utils
    "app/utils/retry_utils.py" :data.retry_utils,
}
def app_module_templates(app_name: str):
     return {
         f"app/modules/{app_name}/__init__.py": "",
         f"app/modules/{app_name}/models.py": data.get_app_model_template(app_name),
         f"app/modules/{app_name}/schemas.py": data.get_app_schema_template(app_name),
         f"app/modules/{app_name}/crud.py": data.get_app_crud_template(app_name),
         f"app/modules/{app_name}/router.py": data.get_app_router_template(app_name),
     }

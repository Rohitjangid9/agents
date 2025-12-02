import os
import subprocess
# Boilerplate code templates for the default app files
APP_TEMPLATE = {
    "models.py": """from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator
from project_name.logger import logger_object

logger = logger_object('app_name.models')

class SampleModel(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]
    
    title = models.CharField(
        max_length=100,
        validators=[
            MinLengthValidator(3, 'Title must be at least 3 characters long'),
            RegexValidator(r'^[a-zA-Z0-9\s]+$', 'Title can only contain letters, numbers and spaces')
        ],
        help_text='Enter a descriptive title (3-100 characters)'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Sample Model'
        verbose_name_plural = 'Sample Models'
        indexes = [
            models.Index(fields=['status', 'created_at']),
        ]
        # constraints = [
        #     models.CheckConstraint(
        #         check=models.Q(title__length__gte=3),
        #         name='title_min_length'
        #     ),
        # ]

    def __str__(self):
        logger.debug(f"String representation called for: {self.title}")
        return self.title
    
    def clean(self):
        if self.title:
            self.title = self.title.strip().title()
    
    def save(self, *args, **kwargs):
        try:
            logger.info(f"Saving SampleModel: {self.title}")
            super().save(*args, **kwargs)
            logger.info(f"Successfully saved SampleModel: {self.pk}")
        except Exception as e:
            logger.error(f"Error saving SampleModel: {e}")
            raise
    
    def delete(self, *args, **kwargs):
        try:
            logger.warning(f"Deleting SampleModel: {self.pk}")
            result = super().delete(*args, **kwargs)
            logger.info(f"Successfully deleted SampleModel")
            return result
        except Exception as e:
            logger.error(f"Error deleting SampleModel: {e}")
            raise
""",

    "views.py": """from django.shortcuts import render
from django.core.paginator import Paginator
from django.db import DatabaseError
from app_name.models import SampleModel
from project_name.logger import logger_object

logger = logger_object('app_name.views')

def index(request):
    try:
        logger.info(f"Index view accessed by user: {request.user}")
        logger.debug("Fetching all SampleModel objects")
        
        items = SampleModel.objects.select_related().order_by('-created_at')
        
        # Add pagination
        paginator = Paginator(items, 25)  # Show 25 items per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        logger.info(f"Retrieved page {page_obj.number} of {paginator.num_pages}")
        return render(request, 'app_name/index.html', {'page_obj': page_obj})
        
    except DatabaseError as e:
        logger.error(f"Database error in index view: {e}")
        return render(request, 'app_name/error.html', {'error': 'Database connection error'})
    except Exception as e:
        logger.error(f"Unexpected error in index view: {e}")
        return render(request, 'app_name/error.html', {'error': 'An unexpected error occurred'})

""",

    "urls.py": """from django.urls import path
from app_name.views import index
from project_name.logger import logger_object

logger = logger_object('app_name.urls')

urlpatterns = [
    path('', index, name='index'),
]

logger.info("app_name URL patterns loaded")

""",

    "admin.py": """from django.contrib import admin
from app_name.models import SampleModel
from project_name.logger import logger_object

logger = logger_object('app_name.admin')

@admin.register(SampleModel)
class SampleModelAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        try:
            logger.info(f"Admin saving SampleModel by {request.user}")
            super().save_model(request, obj, form, change)
            logger.info(f"Admin saved SampleModel: {obj.pk}")
        except Exception as e:
            logger.error(f"Error saving SampleModel in admin: {e}")
            raise
    
    def delete_model(self, request, obj):
        try:
            logger.warning(f"Admin deleting SampleModel: {obj.pk}")
            super().delete_model(request, obj)
            logger.info(f"Admin deleted SampleModel")
        except Exception as e:
            logger.error(f"Error deleting SampleModel in admin: {e}")
            raise

""",

    "tests.py": """from django.test import TestCase, Client
from django.urls import reverse
from django.core.exceptions import ValidationError
from app_name.models import SampleModel
from django.contrib.auth.models import User

class SampleModelTest(TestCase):
    def setUp(self):
        self.sample_data = {
            'title': 'Test Sample',
            'status': 'active'
        }
    
    def test_model_creation(self):
        obj = SampleModel.objects.create(**self.sample_data)
        self.assertEqual(obj.title, 'Test Sample')
        self.assertEqual(obj.status, 'active')
        self.assertTrue(obj.created_at)
        self.assertTrue(obj.updated_at)
    
    def test_model_str_representation(self):
        obj = SampleModel.objects.create(**self.sample_data)
        self.assertEqual(str(obj), 'Test Sample')
    
    def test_model_validation(self):
        with self.assertRaises(ValidationError):
            obj = SampleModel(title='AB', status='active')
            obj.full_clean()
    
    def test_model_choices(self):
        valid_statuses = ['active', 'inactive', 'pending']
        for status in valid_statuses:
            obj = SampleModel.objects.create(title='Test', status=status)
            self.assertEqual(obj.status, status)

class SampleModelViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        for i in range(30):
            SampleModel.objects.create(
                title=f'Test Item {i}',
                status='active'
            )
    
    def test_index_view_status_code(self):
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)
    
    def test_index_view_pagination(self):
        response = self.client.get(reverse('index'))
        self.assertContains(response, 'page_obj')
        self.assertTrue('page_obj' in response.context)
    
    def test_index_view_with_authenticated_user(self):
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)
""",



    "forms.py": """from django import forms
from app_name.models import SampleModel
from project_name.logger import logger_object

logger = logger_object('app_name.forms')

class SampleModelForm(forms.ModelForm):
    class Meta:
        model = SampleModel
        fields = ['title', 'status']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Enter title (3-100 characters)'}),
            'status': forms.Select(attrs={'class': 'form-select'}),
        }
    
    def clean_title(self):
        title = self.cleaned_data.get('title')
        if title:
            title = title.strip()
            if len(title) < 3:
                raise forms.ValidationError('Title must be at least 3 characters long')
            if not title.replace(' ', '').isalnum():
                raise forms.ValidationError('Title can only contain letters, numbers and spaces')
        logger.debug(f"Validating title: {title}")
        return title
    
    def clean(self):
        cleaned_data = super().clean()
        title = cleaned_data.get('title')
        if title:
            cleaned_data['title'] = title.title()
        return cleaned_data
    
    def save(self, commit=True):
        try:
            logger.info("Saving SampleModelForm")
            instance = super().save(commit)
            logger.info(f"Form saved: {instance.pk}")
            return instance
        except Exception as e:
            logger.error(f"Error saving form: {e}")
            raise

"""
}

# Custom User model boilerplate for auth-enabled app
AUTH_MODEL = """from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MaxLengthValidator

class CustomUser(AbstractUser):
    bio = models.TextField(
        blank=True,
        max_length=500,
        validators=[MaxLengthValidator(500, 'Bio cannot exceed 500 characters')],
        help_text='Optional bio (max 500 characters)'
    )
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
        ]
"""

# Template for README.md content with placeholders
README_TEMPLATE = """# {project_name}

## 🚀 Setup Instructions

1. Create virtual environment 
   `python -m venv venv && source venv/bin/activate`

2. Install dependencies 
   `pip install -r requirements.txt`

3. Run migrations 
   `python manage.py migrate`

4. Start development server
   `python manage.py runserver`

## 🧱 Apps Included
{apps_list}
"""

GITIGNORE_TEMPLATE = """# Python-generated files
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

# C extensions
*.so
"""

DOCKERFILE_TEMPLATE = """# Stage 1: Base build stage
FROM python:3.13-slim AS builder
 
# Install PostgreSQL client library and build tools
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create the app directory
RUN mkdir /app
 
# Set the working directory
WORKDIR /app
 
# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 
 
# Upgrade pip and install dependencies
RUN pip install --upgrade pip 
 
# Copy the requirements file first (better caching)
COPY requirements.txt /app/
 
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
 
# Stage 2: Production stage
FROM python:3.13-slim
 
# Install PostgreSQL client library for runtime
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -r appuser && \
   mkdir /app && \
   chown -R appuser /app
 
# Copy the Python dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
 
# Set the working directory
WORKDIR /app
 
# Copy application code
COPY --chown=appuser:appuser . .
 
# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 
 
# Switch to non-root user
USER appuser
 
# Expose the application port
EXPOSE 8000 
 
# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "{project_name}.wsgi:application"]
"""

DOCKER_COMPOSE_TEMPLATE = """services:
 db:
   image: postgres:15
   environment:
     POSTGRES_DB: ${DB_NAME}
     POSTGRES_USER: ${DB_USER}
     POSTGRES_PASSWORD: ${DB_PASSWORD}
   ports:
     - "${DB_PORT}:${DB_PORT}"
   volumes:
     - postgres_data:/var/lib/postgresql/data
   env_file:
     - .env
 
 web:
   build: .
   container_name: django-docker
   ports:
     - "8000:8000"
   depends_on:
     - db
   environment:
     SECRET_KEY: ${SECRET_KEY}
     DEBUG: ${DEBUG}
     ALLOWED_HOSTS: ${ALLOWED_HOSTS}
     DB_NAME: ${DB_NAME}
     DB_USER: ${DB_USER}
     DB_PASSWORD: ${DB_PASSWORD}
     DB_HOST: ${DB_HOST}
     DB_PORT: ${DB_PORT}
   env_file:
     - .env
volumes:
   postgres_data:
"""

DOCKER_COMPOSE_PROD_TEMPLATE = """services:
 db:
   image: postgres:15
   environment:
     POSTGRES_DB: ${DB_NAME}
     POSTGRES_USER: ${DB_USER}
     POSTGRES_PASSWORD: ${DB_PASSWORD}
   ports:
     - "${DB_PORT}:${DB_PORT}"
   volumes:
     - postgres_data:/var/lib/postgresql/data
   env_file:
     - .env
 
 web:
   build: .
   container_name: django-docker
   ports:
     - "8000:8000"
   depends_on:
     - db
   environment:
     SECRET_KEY: ${SECRET_KEY}
     DEBUG: ${DEBUG}
     ALLOWED_HOSTS: ${ALLOWED_HOSTS}
     DB_NAME: ${DB_NAME}
     DB_USER: ${DB_USER}
     DB_PASSWORD: ${DB_PASSWORD}
     DB_HOST: ${DB_HOST_PROD}
     DB_PORT: ${DB_PORT}
   env_file:
     - .env
volumes:
   postgres_data:
"""

REQUIREMENTS_TEMPLATE = """# Django core framework for building web applications
Django>=4.2,<5.0

# PostgreSQL database adapter for Python (modern async-friendly version)
psycopg>=3.2.10

# Testing framework for Python
pytest>=7.0

# Pytest plugin for testing Django apps
pytest-django>=4.5.0

# Plugin to measure test coverage
pytest-cov>=4.0.0

# Factory library for generating test data
factory-boy>=3.3.0

# HTTP library for making API calls (used in integrations or external service calls)
requests>=2.31.0

# Production-grade WSGI server for running Django apps
gunicorn>=21.2.0

# Middleware for handling Cross-Origin Resource Sharing (CORS) in Django
django-cors-headers>=4.3.0

# Useful Django extensions for development (e.g., shell_plus, runscript)
django-extensions>=3.2.0

# Library for reading environment variables from `.env` files
python-decouple>=3.8


# Coding conventions
ruff>=0.1.0
"""

REQUIREMENTS_WITH_API = """# Django REST Framework for API development
djangorestframework>=3.14.0
 
# Swagger/OpenAPI documentation for DRF
drf-yasg>=1.21.0
"""

DOCKERIGNORE_TEMPLATE = """# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env
venv
.venv
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode
.idea
*.swp
*.swo
*~

# Project
.env
.env.local
.env.*.local
node_modules
"""

ENV_TEMPLATE = """# Django Settings
# SECURITY WARNING: Generate a new secret key for production!
# Use: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY={KEY}
ALLOWED_HOSTS=localhost,127.0.0.1
DEBUG=True
DJANGO_SETTINGS_MODULE={project_name}.settings

# Database Configuration
DB_NAME={project_name}_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_HOST_PROD=db
DB_PORT=5432

"""

HEALTH_CHECK_TEMPLATE = """
from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def health_check(request):
    db_conn = connections['default']
    try:
        db_conn.cursor()
        db_status = "ok"
    except OperationalError:
        db_status = "unhealthy"

    data = {
        "message": "Service is running",
        "database": db_status,
    }
    return JsonResponse(data)
"""


logger_settings = """DYNAMIC_LOG_PATH = os.path.join(BASE_DIR, "Logs")


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}
"""

logger_template = """import os
import logging
import logging.config
from logging.handlers import TimedRotatingFileHandler
from datetime import date
from django.conf import settings

def logger_object(api_module: str) -> logging.Logger:
    '''
    Returns a logger for the given module.
    - Logs to console and file.
    - Rotates daily.
    - Keeps last 5 logs.
    '''
    # Directory setup
    dynamic_log_path = getattr(settings, "DYNAMIC_LOG_PATH", os.path.join(settings.BASE_DIR, "Logs"))
    log_directory = os.path.join(dynamic_log_path, "server_logs")
    os.makedirs(log_directory, exist_ok=True)

    # File name: 2025-10-10.log
    logger_file_name = os.path.join(log_directory, f"{date.today()}.log")

    logging_schema = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "json": {
                "format": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "module": "%(name)s", "message": "%(message)s"}',
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "standard",
                "level": "DEBUG",
            },
            "file": {
                "class": "logging.handlers.TimedRotatingFileHandler",
                "formatter": "standard",
                "level": "DEBUG",
                "filename": logger_file_name,
                "encoding": "utf-8",
                "when": "midnight",  # rotate daily
                "backupCount": 5,    # keep last 5 logs
            },
        },
        "loggers": {
            api_module: {
                "handlers": ["console", "file"],
                "level": "DEBUG",
                "propagate": False,
            },
        },
    }

    logging.config.dictConfig(logging_schema)
    return logging.getLogger(api_module)
"""

# Microservices templates (clean imports)
MICROSERVICES_TEMPLATE = {
    "views.py": """from django.shortcuts import render
from django.core.paginator import Paginator
from django.db import DatabaseError
from app_name.models.entity1_model import Entity1
from app_name.models.entity2_model import Entity2
from project_name.logger import logger_object

logger = logger_object('app_name.views')

def index(request):
    try:
        logger.info(f"Index view accessed by user: {request.user}")
        logger.debug("Fetching all Entity1 objects")
        
        items = Entity1.objects.select_related().order_by('-created_at')
        
        # Add pagination
        paginator = Paginator(items, 25)  # Show 25 items per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        logger.info(f"Retrieved page {page_obj.number} of {paginator.num_pages}")
        return render(request, 'app_name/index.html', {'page_obj': page_obj})
        
    except DatabaseError as e:
        logger.error(f"Database error in index view: {e}")
        return render(request, 'app_name/error.html', {'error': 'Database connection error'})
    except Exception as e:
        logger.error(f"Unexpected error in index view: {e}")
        return render(request, 'app_name/error.html', {'error': 'An unexpected error occurred'})

""",

    "admin.py": """from django.contrib import admin
from app_name.models.entity1_model import Entity1
from app_name.models.entity2_model import Entity2
from project_name.logger import logger_object

logger = logger_object('app_name.admin')

@admin.register(Entity1)
class Entity1Admin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25

@admin.register(Entity2)
class Entity2Admin(admin.ModelAdmin):
    list_display = ['title', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25

"""
}

# Microservices model templates
MICROSERVICES_MODELS = {
    "entity1_model.py": """from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator

class Entity1(models.Model):
    name = models.CharField(
        max_length=100,
        validators=[
            MinLengthValidator(2, 'Name must be at least 2 characters long'),
            MaxLengthValidator(100, 'Name cannot exceed 100 characters')
        ],
        db_index=True,
        help_text='Enter entity name (2-100 characters)'
    )
    description = models.TextField(
        blank=True,
        max_length=1000,
        help_text='Optional description (max 1000 characters)'
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text='Whether this entity is active'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Entity 1'
        verbose_name_plural = 'Entity 1 Records'
        indexes = [
            models.Index(fields=['is_active', 'created_at']),
            models.Index(fields=['name']),
        ]
        # constraints = [
        #     models.CheckConstraint(
        #         check=models.Q(name__length__gte=2),
        #         name='entity1_name_min_length'
        #     ),
        ]

    def __str__(self):
        return self.name
    
    def clean(self):
        if self.name:
            self.name = self.name.strip()
""",

    "entity2_model.py": """from django.db import models
from django.core.validators import MinLengthValidator

class Entity2(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('draft', 'Draft'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(
        max_length=100,
        validators=[
            MinLengthValidator(3, 'Title must be at least 3 characters long')
        ],
        db_index=True,
        help_text='Enter title (3-100 characters)'
    )
    content = models.TextField(
        blank=True,
        max_length=5000,
        help_text='Optional content (max 5000 characters)'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True,
        help_text='Current status of the entity'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Entity 2'
        verbose_name_plural = 'Entity 2 Records'
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['title']),
        ]
        # constraints = [
        #     models.CheckConstraint(
        #         check=models.Q(title__length__gte=3),
        #         name='entity2_title_min_length'
        #     ),
        ]

    def __str__(self):
        return self.title
    
    def clean(self):
        if self.title:
            self.title = self.title.strip()
"""
}

def create_microservices_structure(app_path: str):
    """Create tests folder structure and delete tests.py"""
    try:
        # Delete tests.py
        tests_file = os.path.join(app_path, "tests.py")
        if os.path.exists(tests_file):
            os.remove(tests_file)
        
        # Create tests folder structure
        tests_dir = os.path.join(app_path, "tests")
        os.makedirs(tests_dir, exist_ok=True)
        os.makedirs(os.path.join(tests_dir, "unit"), exist_ok=True)
        os.makedirs(os.path.join(tests_dir, "integration"), exist_ok=True)
        os.makedirs(os.path.join(tests_dir, "fixtures"), exist_ok=True)
        
        # Create __init__.py files
        with open(os.path.join(tests_dir, "__init__.py"), "w") as f:
            f.write("# Tests package\n")
        with open(os.path.join(tests_dir, "unit", "__init__.py"), "w") as f:
            f.write("# Unit tests\n")
        with open(os.path.join(tests_dir, "integration", "__init__.py"), "w") as f:
            f.write("# Integration tests\n")
        with open(os.path.join(tests_dir, "fixtures", "__init__.py"), "w") as f:
            f.write("# Test fixtures\n")
    except OSError as e:
        print(f"Error creating microservices structure: {e}")
        raise

def create_api_structure(project_name: str, app_name: str):
    """Create APIs folder structure in project root (same level as settings.py)"""
    try:
        project_root = os.path.join(os.getcwd(), project_name)
        apis_dir = os.path.join(project_root, "apis", "v1", app_name)
        
        # Create directory structure
        os.makedirs(apis_dir, exist_ok=True)
        os.makedirs(os.path.join(apis_dir, "serializers"), exist_ok=True)
        os.makedirs(os.path.join(apis_dir, "views"), exist_ok=True)
        
        # Create __init__.py files
        with open(os.path.join(apis_dir, "__init__.py"), "w") as f:
            f.write("# API package\n")
    except OSError as e:
        print(f"Error creating API structure: {e}")
        raise
    
    # Create serializer files
    entity1_serializer = f"""from rest_framework import serializers
from {app_name}.models.entity1_model import Entity1

class Entity1Serializer(serializers.ModelSerializer):
    class Meta:
        model = Entity1
        fields = '__all__'

class Entity1CreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity1
        fields = '__all__'

class Entity1UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity1
        fields = '__all__'
"""
    
    entity2_serializer = f"""from rest_framework import serializers
from {app_name}.models.entity2_model import Entity2

class Entity2Serializer(serializers.ModelSerializer):
    class Meta:
        model = Entity2
        fields = '__all__'

class Entity2CreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity2
        fields = '__all__'

class Entity2UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity2
        fields = '__all__'
"""
    
    with open(os.path.join(apis_dir, "serializers", "entity1_serializers.py"), "w") as f:
        f.write(entity1_serializer)

    with open(os.path.join(apis_dir, "serializers", "entity2_serializers.py"), "w") as f:
        f.write(entity2_serializer)
    
    # Create view files
    entity1_view = f"""from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from {app_name}.models.entity1_model import Entity1
from {project_name}.apis.v1.{app_name}.serializers.entity1_serializers import Entity1Serializer, Entity1CreateSerializer, Entity1UpdateSerializer

class Entity1ViewSet(viewsets.ModelViewSet):
    queryset = Entity1.objects.all()
    serializer_class = Entity1Serializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return Entity1CreateSerializer
        elif self.action in ['update', 'partial_update']:
            return Entity1UpdateSerializer
        return Entity1Serializer
"""
    
    entity2_view = f"""from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from {app_name}.models.entity2_model import Entity2
from {project_name}.apis.v1.{app_name}.serializers.entity2_serializers import Entity2Serializer, Entity2CreateSerializer, Entity2UpdateSerializer

class Entity2ViewSet(viewsets.ModelViewSet):
    queryset = Entity2.objects.all()
    serializer_class = Entity2Serializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return Entity2CreateSerializer
        elif self.action in ['update', 'partial_update']:
            return Entity2UpdateSerializer
        return Entity2Serializer
"""
    
    with open(os.path.join(apis_dir, "views", "entity1_views.py"), "w") as f:
        f.write(entity1_view)
    with open(os.path.join(apis_dir, "views", "entity2_views.py"), "w") as f:
        f.write(entity2_view)

def generate_app_boilerplate(app_name: str, project_name: str, microservices: bool = False) -> None:
    """
    Generates default boilerplate files for a Django app.

    It writes default models.py, views.py, urls.py, admin.py, tests.py,
    serializers.py, and forms.py files from APP_TEMPLATE, replacing the
    placeholder 'app_name' with the actual app name.

    Also creates a templates directory with a basic index.html.

    If auth=True, generates a CustomUser model in models.py.

    Args:
        app_name (str): The app name to generate boilerplate for.
        auth (bool, optional): If True, generate custom auth user model. Defaults to False.

    Returns:
        None
    """
    app_path = os.path.join(os.getcwd(), app_name)
    
    if microservices:
        # Create models folder with separate model files
        models_dir = os.path.join(app_path, "models")
        os.makedirs(models_dir, exist_ok=True)
        
        # Delete models.py
        models_file = os.path.join(app_path, "models.py")
        if os.path.exists(models_file):
            os.remove(models_file)
        
        # Create __init__.py for models package
        with open(os.path.join(models_dir, "__init__.py"), "w") as f:
            f.write("# Models package\n")
        
        # Create separate model files
        for filename, content in MICROSERVICES_MODELS.items():
            file_path = os.path.join(models_dir, filename)
            with open(file_path, "w") as f:
                app_change = content.replace("app_name", app_name)
                project_name_change = app_change.replace("project_name", project_name)
                f.write(project_name_change)
        
        # Create microservices structure
        create_microservices_structure(app_path)
        
        # Create API structure for microservices
        create_api_structure(project_name, app_name)
        
        # Use microservices templates for views.py and admin.py
        for filename, content in MICROSERVICES_TEMPLATE.items():
            file_path = os.path.join(app_path, filename)
            with open(file_path, "w") as f:
                app_change = content.replace("app_name", app_name)
                project_name_change = app_change.replace("project_name", project_name)
                f.write(project_name_change)
        
        # Use standard templates for urls.py only
        for filename, content in APP_TEMPLATE.items():
            if filename in ["urls.py"]:
                file_path = os.path.join(app_path, filename)
                with open(file_path, "w") as f:
                    app_change = content.replace("app_name", app_name)
                    project_name_change = app_change.replace("project_name", project_name)
                    f.write(project_name_change)
        
        # Delete forms.py and tests.py (handled separately)
        forms_file = os.path.join(app_path, "forms.py")
        if os.path.exists(forms_file):
            os.remove(forms_file)
    else:
        # Standard app structure with single models.py
        for filename, content in APP_TEMPLATE.items():
            file_path = os.path.join(app_path, filename)
            with open(file_path, "w") as f:
                app_change = content.replace("app_name", app_name)
                project_name_change = app_change.replace("project_name", project_name)
                f.write(project_name_change)

        # Create template folder with placeholder index.html
        template_dir = os.path.join(app_path, "templates", app_name)
        os.makedirs(template_dir, exist_ok=True)
        with open(os.path.join(template_dir, "index.html"), "w") as f:
            f.write(f"<h1>{app_name.capitalize()} Index Page</h1>")



def generate_readme(project_name: str, apps: list[str], API: bool=False) -> None:
    """
    Generates a README.md file for the Django project.

    It lists all apps included in the project with setup instructions.

    Args:
        project_name (str): Name of the Django project.
        apps (list[str]): List of app names included in the project.

    Returns:
        None
    """
    apps_list = "\n".join([f"- {app}" for app in apps])

    readme_content = README_TEMPLATE.format(
        project_name=project_name,
        apps_list=apps_list,
    )

    generate_project_files(project_name, readme_content, API)

def generate_project_files(project_name: str, readme_content: str, API: bool=False) -> None:
    """
    Generates common project files like README.md, .gitignore, Dockerfile and docker-compose.yml

    Args:
        project_name (str): Name of the Django project
        readme_content (str): Content for the README.md file

    Returns:
        None
    """
    ALL_REQUIREMENTS = REQUIREMENTS_TEMPLATE + (REQUIREMENTS_WITH_API if API else "")
    result = subprocess.run(
        ['python', '-c', 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'],
        capture_output=True,
        text=True
    )
    django_key = result.stdout.strip()
    # Dictionary mapping filenames to their content
    files_to_create = {
        "README.md": readme_content,
        ".gitignore": GITIGNORE_TEMPLATE,
        ".env": ENV_TEMPLATE.format(project_name=project_name, KEY=django_key),
        "Dockerfile": DOCKERFILE_TEMPLATE,
        "docker-compose.yml": DOCKER_COMPOSE_TEMPLATE,
        "docker-compose.prod.yml": DOCKER_COMPOSE_PROD_TEMPLATE,
        "requirements.txt": ALL_REQUIREMENTS,
        ".dockerignore": DOCKERIGNORE_TEMPLATE
    }

    # Create all files in the project directory
    for filename, content in files_to_create.items():
        try:
            file_path = os.path.join(project_name, filename)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
        except IOError as e:
            print(f"Error creating file {filename}: {e}")
            raise

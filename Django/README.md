# ⚡ Django CLI Tool

A command-line tool for scaffolding Django projects with apps, boilerplate code, and microservices architecture.

## 🚀 Features

- ✅ **Auto Django Installation**: Checks and installs Django if missing
- ✅ **Project Scaffolding**: Creates complete Django project structure
- ✅ **App Generation**: Creates apps with complete boilerplate code
- ✅ **Microservices Support**: Create multiple independent Django services
- ✅ **Auto Configuration**: Updates settings.py and urls.py automatically
- ✅ **PostgreSQL Integration**: Environment-based database configuration
- ✅ **Health Checks**: Built-in health monitoring endpoints
- ✅ **Logging**: Structured logging configuration
- ✅ **API Documentation**: Swagger UI integration
- ✅ **Template Generation**: Creates basic HTML templates for each app
- ✅ **Ready-to-Use**: Includes models, views, forms, serializers, and tests

## 📥 Installation

Download the `Django_CLI_tool.exe` from releases and place it in your desired directory.

## ⚡ Usage

### Create New Project

```bash
# Create project with multiple apps
Django_CLI_tool.exe startproject project_name app1 app2 app3

# Create project with --app flags
Django_CLI_tool.exe startproject project_name --app app1 --app app2 --app app3

# Create basic project (no apps)
Django_CLI_tool.exe startproject project_name

# Create project with API documentation
Django_CLI_tool.exe startproject project_name --api

# Create project in specific directory
Django_CLI_tool.exe startproject project_name --path /custom/path
```

### Add App to Existing Project

```bash
# Add single app to existing project
Django_CLI_tool.exe startapp --app app_name --project project_name

# If project is in seperated folder
Django_CLI_tool.exe startapp --app app_name --project "/path/to/project"
```

### Create Microservices Architecture

```bash
# Create multiple independent Django services
Django_CLI_tool.exe startservices auth:auth_app user:user_app,profile_app payment

# Create services in specific directory
Django_CLI_tool.exe startservices auth user payment --path /microservices

# Create service without apps
Django_CLI_tool.exe startservices gateway
```

### Arguments

**startproject:**
- `project_name`: Name of your Django project
- `app_names`: Space-separated list of apps to create
- `--app`: Specify individual apps (can be used multiple times)
- `--path`: Custom directory path where project will be created
- `--api`: Include Django REST Framework with Swagger UI

**startapp:**
- `--app`: Name of the app to create
- `--project`: Target project for new app

**startservices:**
- `services`: Service definitions in format 'service:app1,app2' or just 'service'
- `--path`: Base path where to create services

## 📂 Generated Project Structure

### Single Project Structure
```
project_name/
├── project_name/
│   ├── __init__.py
│   ├── settings.py           # Auto-updated with new apps & env vars
│   ├── urls.py              # Auto-updated with app routes & health check
│   ├── health_check.py      # Health monitoring endpoint
│   ├── logger.py            # Logging configuration
│   ├── wsgi.py
│   └── asgi.py
├── app1/                    # Generated app
│   ├── __init__.py
│   ├── models.py           # Sample model included
│   ├── views.py            # Basic view function
│   ├── urls.py             # URL patterns
│   ├── admin.py            # Admin registration
│   ├── tests.py            # Sample test case
│   ├── forms.py            # Django form
│   ├── serializers.py      # DRF serializer
│   ├── apps.py
│   ├── migrations/
│   └── templates/app1/
│       └── index.html      # Basic template
├── manage.py
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker compose setup
├── requirements.txt        # Python dependencies
├── .dockerignore          # Docker ignore rules
└── README.md               # Auto-generated setup guide
```

### Microservices Structure
```
microservices/
├── auth/                    # Authentication service
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── settings.py     # Environment-based config
│   │   ├── urls.py         # Service URLs with health check
│   │   ├── health_check.py # Service health endpoint
│   │   ├── logger.py       # Service logging
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── auth_app/           # Authentication app
│   │   ├── models/         # Separate model files
│   │   │   ├── __init__.py
│   │   │   ├── user_model.py
│   │   │   └── token_model.py
│   │   ├── tests/          # Organized test structure
│   │   │   ├── __init__.py
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── fixtures/
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── forms.py
│   │   ├── serializers.py
│   │   └── apps.py
│   ├── apis/               # API structure
│   │   └── v1/
│   │       └── auth_app/
│   │           ├── serializers/
│   │           └── views/
│   ├── manage.py
│   ├── .env                # Environment variables
│   ├── .gitignore         # Git ignore rules
│   ├── Dockerfile         # Docker configuration
│   ├── docker-compose.yml # Docker compose setup
│   ├── requirements.txt   # Python dependencies
│   ├── .dockerignore     # Docker ignore rules
│   └── README.md          # Service-specific setup guide
├── user/                   # User management service
│   ├── user/              # Same structure as auth
│   ├── user_app/          # User app with models/ and tests/
│   ├── profile_app/       # Profile app with models/ and tests/
│   ├── apis/v1/           # API endpoints
│   ├── manage.py
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── .dockerignore
│   └── README.md
└── payment/                # Payment service
    ├── payment/           # Same complete structure
    ├── manage.py
    ├── .env
    ├── .gitignore
    ├── Dockerfile
    ├── docker-compose.yml
    ├── requirements.txt
    ├── .dockerignore
    └── README.md
```

## 🛠️ After Project Generation

### 1. Navigate to Project

```bash
cd project_name  # For single project
# OR
cd microservices/auth  # For microservice
```

### 2. Setup Environment

```bash
# Create virtual environment
python -m venv venv         # Windows
python3 -m venv venv   # Linux/Mac

# Activate environment
venv\Scripts\activate      # Windows
source venv/bin/activate   # Linux/Mac

# Install dependencies (auto-installed by tool)
pip install django psycopg[binary] python-decouple
```

### 3. Configure Environment Variables

Update the `.env` file with your settings:
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```

### 4. Database Setup

```bash
# Create and apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

### 6. Access Your Application

- **Main App**: `http://127.0.0.1:8000/`
- **Health Check**: `http://127.0.0.1:8000/health/`
- **Admin Panel**: `http://127.0.0.1:8000/admin/`
- **API Documentation**: `http://127.0.0.1:8000/swagger/` (if --api flag used)

### 7. Running Microservices

For microservices, each service runs independently:
```bash
# Terminal 1 - Auth Service
cd auth 
python manage.py runserver 8001

# Terminal 2 - User Service  
cd user 
python manage.py runserver 8002

# Terminal 3 - Payment Service
cd payment 
python manage.py runserver 8003
```

## 🧩 Generated Boilerplate Per App

### Standard Project Apps
- **models.py**: Sample model with title and created_at fields
- **views.py**: Basic index view rendering template
- **urls.py**: URL pattern for the index view
- **admin.py**: Admin registration for the sample model
- **tests.py**: Basic test case for model creation
- **forms.py**: ModelForm for the sample model
- **serializers.py**: DRF serializer (ready for API development)
- **templates/app_name/index.html**: Basic HTML template

### Microservices Apps (Enhanced Structure)
- **models/**: Separate model files (user_model.py, token_model.py)
- **tests/**: Organized testing structure (unit/, integration/, fixtures/)
- **apis/v1/**: Versioned API structure with serializers and views
- **views.py**: Enhanced views with logging
- **urls.py**: URL patterns
- **admin.py**: Admin registration
- **forms.py**: ModelForm
- **serializers.py**: DRF serializer

### Project-Level Files (All Projects)
- **.env**: Environment variables configuration
- **.gitignore**: Git ignore rules for Python/Django
- **Dockerfile**: Container configuration
- **docker-compose.yml**: Multi-service orchestration
- **requirements.txt**: Python dependencies
- **.dockerignore**: Docker ignore rules
- **README.md**: Project-specific setup instructions

## 🔗 Generated URLs & Features

### Single Project URLs
- **App URLs**: `http://127.0.0.1:8000/app_name/`
- **Health Check**: `http://127.0.0.1:8000/health/`
- **Admin Panel**: `http://127.0.0.1:8000/admin/`
- **API Documentation**: `http://127.0.0.1:8000/swagger/` (with --api flag)

### Microservice URLs
Each service runs on different ports:
- **Auth Service**: `http://127.0.0.1:8001/`
- **User Service**: `http://127.0.0.1:8002/`
- **Payment Service**: `http://127.0.0.1:8003/`

### Built-in Features
- ✅ **Environment Variables**: Secure configuration management
- ✅ **PostgreSQL Ready**: Database configuration included
- ✅ **Health Monitoring**: `/health/` endpoint for service monitoring
- ✅ **Structured Logging**: File and console logging configured
- ✅ **API Documentation**: Swagger UI for API endpoints
- ✅ **Admin Interface**: Django admin with model registration
- ✅ **Docker Ready**: Dockerfile and docker-compose.yml included
- ✅ **Git Ready**: .gitignore and .dockerignore configured
- ✅ **Dependency Management**: requirements.txt with all dependencies
- ✅ **Organized Testing**: Separate unit, integration, and fixture folders (microservices)
- ✅ **API Versioning**: v1 API structure for future scalability (microservices)

## 📋 Requirements

- **Python 3.9+**
- **Django** (auto-installed by tool)
- **psycopg[binary]** (auto-installed for PostgreSQL support)
- **python-decouple** (auto-installed for environment variables)
- **Docker** (optional, for containerized deployment)
- **Git** (optional, for version control)

### Auto-Installed Dependencies
The tool automatically installs:
- Django
- psycopg[binary] (PostgreSQL adapter)
- python-decouple (environment variables)
- djangorestframework (with --api flag)
- drf-yasg (Swagger UI with --api flag)

## 🚀 Quick Start Examples

### Single Project Example
```bash
# Create a blog project with multiple apps
Django_CLI_tool.exe startproject myblog post comment user --api

cd myblog

# Activate environment (auto-created)
venv\Scripts\activate      # Windows
source venv/bin/activate   # Linux/Mac

# Configure .env file
# Update database credentials and secret key

# Setup database
python manage.py makemigrations
python manage.py migrate

# Run server
python manage.py runserver
```

### Microservices Example
```bash
# Create microservices architecture
Django_CLI_tool.exe startservices auth:auth_app user:user_app,profile_app payment:payment_app --path ./microservices

cd microservices

# Start each service in separate terminals
# Terminal 1
cd auth  
python manage.py runserver 8001

# Terminal 2  
cd user 
python manage.py runserver 8002

# Terminal 3
cd payment 
python manage.py runserver 8003
```

### Access Your Applications
- **Single Project**: `http://127.0.0.1:8000/`
- **Auth Service**: `http://127.0.0.1:8001/`
- **User Service**: `http://127.0.0.1:8002/`
- **Payment Service**: `http://127.0.0.1:8003/`

## 💡 Tips

- Run commands from the directory where you want to create the project
- App names should follow Python naming conventions (lowercase, underscores)
- The tool automatically handles Django installation if missing
- Each generated project/service includes its own README.md with specific setup instructions
- Use microservices for scalable, independent deployments
- Configure environment variables in `.env` files for security
- Health check endpoints help with monitoring and load balancing
- Swagger UI provides interactive API documentation when using --api flag

## 🔧 Advanced Usage

### Environment Variables
Each project includes environment-based configuration:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated allowed hosts
- `DB_*`: Database connection settings

### Docker Support
Every project includes Docker configuration:
```bash
# Build and run with Docker
docker-compose up --build

# Run individual service
docker build -t myproject .
docker run -p 8000:8000 myproject
```

### Microservices Benefits
- **Independent Deployment**: Each service can be deployed separately
- **Technology Flexibility**: Different services can use different technologies
- **Scalability**: Scale individual services based on demand
- **Fault Isolation**: Issues in one service don't affect others
- **Team Independence**: Different teams can work on different services
- **Organized Structure**: Separate models, tests, and API folders
- **Version Control**: Each service has its own git repository structure
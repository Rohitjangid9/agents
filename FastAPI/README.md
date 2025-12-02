# ⚡ FastAPI CLI Tool

A command-line tool for scaffolding FastAPI projects with optional database and authentication modules.

## 🚀 Features

- ✅ **Base FastAPI Project**: Core structure with routing, middleware, and configuration
- ✅ **Database Integration**: SQLAlchemy + Alembic migrations (optional `--db`)
- ✅ **JWT Authentication**: Complete auth system with user management (optional `--auth`)
- ✅ **Docker Support**: Dockerfile and docker-compose.yml included
- ✅ **Modern Python**: Pydantic v2, type hints, and best practices
- ✅ **Production Ready**: Logging, security, and environment configuration

## 📥 Installation

Download the `FastAPI_CLI_tool.exe` from releases and place it in your desired directory.

## ⚡ Usage

### Basic Commands

```bash
# Create basic FastAPI project
FastAPI_CLI_tool.exe startproject project_name

# Create with database support
FastAPI_CLI_tool.exe startproject project_name --db

# Create with authentication
FastAPI_CLI_tool.exe startproject project_name --auth

# Create with both database and auth
FastAPI_CLI_tool.exe startproject project_name --db --auth

# Create project in specific directory
FastAPI_CLI_tool.exe startproject project_name --path /custom/path

# Create app module in existing project
FastAPI_CLI_tool.exe startapp app_name --project  "/path/to/project"
```

### Arguments

- `project_name`: Name of your FastAPI project
- `--db`: Include SQLAlchemy database setup with Alembic migrations
- `--auth`: Include JWT authentication with user management system
- `--path`: Custom directory path where project will be created
- `--app`: Create additional app module during project creation
- `--project`: Specify existing project path for startapp command

## 📂 Generated Project Structure

```
my_api/
├── app/
│   ├── __init__.py
│   ├── dependencies.py
│   ├── modules/              # Module directory
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py         # Settings and environment variables
│   │   ├── logger.py         # Logging configuration
│   │   ├── middleware.py     # Custom middleware
│   │   ├── security.py       # Password hashing utilities
│   │   └── helpers/
│   │       └── message.py    # Helper messages
│   ├── api/
│   │   ├── __init__.py
│   │   └── main_router.py    # Main API router
│   ├── utils/
│   │   └── retry_utils.py    # Retry utilities
│   ├── db/                   # (--db flag)
│   │   ├── __init__.py
│   │   ├── base.py          # SQLAlchemy base
│   │   └── session.py       # Database session
│   └── modules/             # (--auth flag)
│       ├── auth/            # Authentication endpoints
│       │   ├── __init__.py
│       │   ├── models.py    # Token models
│       │   ├── schemas.py   # Auth schemas
│       │   ├── crud.py      # Auth logic
│       │   └── router.py    # Auth routes
│       └── user/            # User management
│           ├── __init__.py
│           ├── models.py    # User database model
│           ├── schemas.py   # Pydantic schemas
│           ├── crud.py      # User operations
│           └── router.py    # User endpoints
├── tests/
│   ├── __init__.py
│   ├── test_auth.py         # (--auth flag)
│   └── test_users.py        # (--auth flag)
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── pyproject.toml          # Project configuration
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── Dockerfile             # Docker container setup
├── docker-compose.yml     # Multi-container setup
└── README.md              # Project documentation
```

## 🛠️ After Project Generation

### 1. Setup Environment

```bash
cd project_name

# Create virtual environment
python -m venv venv    # Windows
python3 -m venv venv   # Linux/Mac

# Activate environment
venv\Scripts\activate      # Windows
source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Edit `.env` file with your settings:

```env
# Database (if using --db)
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/my_api_db

# Security (if using --auth)
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### 3. Database Setup (if using --db)

```bash
# Initialize Alembic
alembic init app/alembic

# Create first migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 4. Run the Application

```bash
# Development server
uvicorn main:app --reload

# Or using the built-in runner
python main.py
```

## 🔗 API Endpoints

### Base Project
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

### With Authentication (`--auth`)
- `POST /auth/token` - Login and get access token
- `GET /users/` - List all users
- `GET /users/me` - Get current user profile
- `GET /users/{user_id}` - Get user by ID
- `POST /users/` - Create new user
- `DELETE /users/{user_id}` - Delete user

## 🐳 Docker Support

```bash
# Build and run with Docker
docker-compose up --build

# Or build manually
docker build -t my-fastapi-app .
docker run -p 8000:8000 my-fastapi-app
```

## 📋 Requirements

- **Python 3.9+**
- **PostgreSQL** (if using `--db` flag)
- **Docker** (optional, for containerization)

## 🔧 Key Features Included

### Security
- Password hashing with bcrypt
- JWT token authentication
- CORS middleware
- Request/response logging

### Database
- SQLAlchemy ORM with async support
- Alembic migrations
- Connection pooling
- Database session management

### Development
- Hot reload support
- Comprehensive logging
- Environment-based configuration
- Type hints throughout
- Pydantic data validation

## 🚀 Quick Start Example

```bash
# Create a complete e-commerce API
FastAPI_CLI_tool.exe startproject ecommerce_api --db --auth

cd ecommerce_api

# Setup environment
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Configure database in .env
# DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/ecommerce_db

# Run migrations
alembic init app/alembic
alembic revision --autogenerate -m "Initial"
alembic upgrade head

# Start development server
uvicorn main:app --reload
```

Visit `http://localhost:8000/docs` to see your API documentation!
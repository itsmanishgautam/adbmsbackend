# EHCIDB - Complete Project Structure Documentation

This document provides a comprehensive overview of the Electronic Health Care Information Database (EHCIDB) project structure. It details the folders, files, and architectural organization of both the frontend (Next.js) and backend (FastAPI) applications.

## 🏗️ High-Level Overview

*   **`app/`**: The FastAPI backend application containing all business logic, database models, schemas, and API routing.
*   **`frontend/`**: The Next.js React application containing the user interface, state management, and API integrations.
*   **`alembic/`**: SQLAlchemy database migration scripts to manage schema versions.
*   **`scripts/`**: Utility scripts for populating the database with mock data or testing.

---

## 📁 Detailed Directory Tree

```text
c:\Users\Manish Gautam\Downloads\code\adbmsbackend\
+--- alembic/                        # Provides database schema migration (SQLAlchemy)
|   +--- env.py                      # Configurations for Alembic migrations
|   +--- script.py.mako              # Template for generating new migration scripts
|   \--- versions/                   # Directory containing all actual DB migration scripts
|       +--- 1bfb0bc7fe8c_add_bloodbank_table.py
|       +--- 40a511f9459d_add_approval_status.py
|       +--- 51cf6374d444_add_phone_number_to_user.py
|       +--- 81626c726411_schema_fixes.py
|       +--- fb814350383c_add_resource_and_details_to_log.py
|       \--- fff214937e8b_init.py    # Initial database schema setup
|
+--- app/                            # The FastAPI Backend Source Code
|   +--- main.py                     # Entry point for the FastAPI application
|   +--- api/                        # API routes and endpoints configuration
|   |   +--- api.py                  # API router aggregator
|   |   \--- routes/                 # Specific API domain routes
|   |       +--- admin.py            # Administrative actions (e.g. managing users)
|   |       +--- auth.py             # Login, signup, token generation
|   |       +--- blood_bank.py       # Inventory management for blood donations
|   |       +--- doctors.py          # Doctor profiles and role features
|   |       +--- incidents.py        # Managing reports and patient safety incidents
|   |       +--- insurance.py        # Operations handling patient insurance details
|   |       +--- medical.py          # Medical records endpoints
|   |       \--- patients.py         # Patient profile endpoints
|   |
|   +--- core/                       # Core system configurations
|   |   +--- config.py               # Environment variable loading & project settings
|   |   +--- dependencies.py         # FastAPI dependency injection (e.g., getting DB session, Current User)
|   |   \--- security.py             # Password hashing and JWT verification processes
|   |
|   +--- crud/                       # Create, Read, Update, Delete (CRUD) operations on DB models
|   |   +--- __init__.py
|   |   +--- base.py                 # Abstract generic CRUD class for basic DB operations
|   |   +--- crud_blood_bank.py      # CRUD specific to the blood bank records
|   |   \--- crud_user.py            # CRUD operations specific to the User authentication/authorization
|   |
|   +--- db/                         # Database and connections setup
|   |   +--- base.py                 # Exports all models so Alembic can discover them
|   |   +--- init_admin.py           # Script/function to seed the initial Administrator user
|   |   \--- session.py              # Configuration of SQLAlchemy `SessionLocal` and engine
|   |
|   +--- models/                     # SQLAlchemy Database Models (Tables mapped to Python objects)
|   |   +--- __init__.py
|   |   +--- blood_bank.py           # Blood donation inventory table
|   |   +--- doctor.py               # Expanded doctor properties table
|   |   +--- hospital.py             # Details about hospitals (if applicable)
|   |   +--- incident.py             # Incidents tracking table
|   |   +--- insurance.py            # Insurance policy tracking table
|   |   +--- log.py                  # Table for audit trails and activity logs
|   |   +--- medical.py              # Patient medical history definitions
|   |   +--- patient.py              # Expanded patient features
|   |   \--- user.py                 # Core authentication entity (Base User)
|   |
|   +--- schemas/                    # Pydantic Schemas (Used for data validation, typing, and serialization)
|   |   +--- __init__.py
|   |   +--- blood_bank.py
|   |   +--- doctor.py
|   |   +--- hospital.py
|   |   +--- incident.py
|   |   +--- insurance.py
|   |   +--- log.py
|   |   +--- medical.py
|   |   +--- patient.py
|   |   +--- token.py                # Schema for JWT Token responses
|   |   \--- user.py
|   |   
|   \--- services/                   # Abstracted system-level services
|       \--- log_service.py          # Centralized utility handler for recording activity logs
|
+--- frontend/                       # The Next.js Frontend Source Code
|   +--- Dockerfile                  # Container instructions to serve the Next app
|   +--- package.json                # NPM configuration, dependencies, and project scripts
|   +--- tsconfig.json               # TypeScript compiler options
|   +--- next.config.ts              # Next.js specific application configuration
|   +--- eslint.config.mjs           # Linter setup
|   +--- public/                     # Static assets (images, icons) served over HTTP
|   |   \--- (various .svg assets + favicon)
|   |
|   \--- src/                        # Core application code
|       +--- api/                    # Axios-based libraries communicating with FastAPI backend
|       |   +--- axios.ts            # Base API client and token interceptors setup
|       |   +--- admin.ts            # Admin API library
|       |   +--- auth.ts             # Login/registration queries
|       |   +--- blood_bank.ts       # Querying blood bank inventories
|       |   +--- insurance.ts        # Insurance query fetchers
|       |   +--- medical.ts          # Medical record fetchers
|       |   \--- patients.ts         # User related fetch handling
|       |
|       +--- app/                    # Next.js App Router root
|       |   +--- globals.css         # Global stylesheets (Tailwind / Vanilla Base)
|       |   +--- layout.tsx          # Root application layout wrapping and context setup
|       |   +--- page.tsx            # Main landing page for the project
|       |   +--- admin/              # Administrator dashboard interfaces
|       |   |   +--- blood-bank/
|       |   |   +--- insurance/
|       |   |   +--- logs/
|       |   |   +--- notifications/
|       |   |   +--- users/
|       |   |   |   +--- [id]/       # Dynamic endpoint for managing a single distinct user account
|       |   |   |   \--- page.tsx
|       |   |   \--- components/     # UI features exclusively bound to the administration pages
|       |   +--- doctor/             # Dashboard and views intended for registered and approved Doctors
|       |   |   +--- incidents/      # Doctor view for tracking incidents
|       |   |   +--- profile/        # Setting up a doctor's personal specialty profile
|       |   |   \--- page.tsx        # Doctor landing
|       |   +--- patient/            # Dashboard for Patients
|       |   |   +--- card/           # Medical Card overview
|       |   |   +--- incidents/      # Managing incidents
|       |   |   +--- insurance/      # Details of insurance
|       |   |   +--- page.tsx        # Base patient dashboard
|       |   |   \--- components/     # Local visual artifacts to form the patient interfaces
|       |   +--- login/              # Login interface
|       |   \--- signup/             # Registration interface
|       |
|       +--- components/             # Reusable global React visual elements
|       |   +--- auth/               # Components like `ProtectedRoute.tsx` & `RoleGuard.tsx` for securing pages
|       |   +--- cards/              # Stylized containers for data representation (`EmergencyCard.tsx`)
|       |   +--- forms/              # Highly interactive user input setups (`DoctorSearch.tsx`)
|       |   +--- layout/             # Framework shells (`Navbar.tsx`, `Sidebar.tsx`)
|       |   +--- tables/             # Generic data iterators (`AdminUserTable.tsx`)
|       |   \--- ui/                 # Basic building blocks (Buttons, Inputs, etc.)
|       |
|       +--- context/                # React Context APIs and state tracking
|       |   \--- userStore.ts        # Primary global user tracking (using Zustand)
|       |
|       \--- types/                  # Global Typescript Declarations and Schema Interfaces
|           \--- index.ts
|
+--- scripts/                        # Utility operations and database provisioning
|   +--- seed.py                     # Populates the initial baseline parameters into an empty database
|   +--- seed_faker.py               # Generates randomized, varied data models suitable for testing workflows
|   \--- test_api.py                 # Programmatic verification of core API endpoints
|
+--- ignore/                         # General file exclusion folder (often holds reference screenshots)
|
+--- .env                            # Essential environmental keys (Database passwords, ports, endpoints, API keys)
+--- alembic.ini                     # High-level database migration mappings mapped to backend definitions
+--- create_admin.py                 # Convenience script explicitly ensuring an administration account is boot-strapped
+--- docker-compose.yml              # Definition to launch Frontend, Backend, and DB services in uniform
+--- Dockerfile                      # Application's primary instructions to be converted to a docker image
+--- entrypoint.sh                   # Startup process bound to container executions that ensure migration happens before API launch
\--- requirements.txt                # Lists exactly which Python libraries `pip` will need to install into the backend container
```

## 🚀 Component Execution Flow

1. **Docker environment:** Uses `docker-compose.yml` to spin up services matching the backend `Dockerfile`, frontend Next.js properties, and Postgres.
2. **Migrations:** `entrypoint.sh` executes `alembic upgrade head` before it yields execution context over to `uvicorn` giving the database valid schemas.
3. **Application Interaction:** The Next.js react pages situated inside `/frontend` negotiate with `http://localhost:8000` executing the endpoints built cleanly within `app/api/routers`.

--- 

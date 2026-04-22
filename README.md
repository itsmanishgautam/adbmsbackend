# EHCIDB - Electronic Health Care Information Database

Welcome to the **Electronic Health Care Information Database (EHCIDB)** project! This is a comprehensive full-stack platform designed to handle healthcare data management, seamlessly bridging the gap between administrators, doctors, and patients.

## 🚀 Features & Capabilities

- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Admins, Doctors, and Patients.
- **Admin Dashboard:** Fully equipped interface to manage users, track medical logs, oversee the blood bank, and check notifications.
- **Doctor Portal:** Access incident reports and specialized patient records, including profiles and medical approvals.
- **Patient Interface:** Manage insurance, track safety incidents, and view comprehensive digital medical cards.
- **Blood Bank & Insurance Modules:** Built-in models and APIs to integrate clinical resources and billing properties.
- **Audit Logging:** System-wide centralized activity and incident logging mechanism.

## 🛠 Technology Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database ORM:** SQLAlchemy with Alembic for database migrations
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **Database Engine:** MySQL (with `aiomysql` and `pymysql`)
- **Validation:** Pydantic

### Frontend
- **Framework:** Next.js (React 19)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form with Zod validation
- **Data Fetching:** Axios
- **Icons & Charts:** Lucide-React & Recharts

### Infrastructure
- **Containerization:** Docker & Docker Compose (`docker-compose.yml`)

## 🏗️ Project Structure Highlights

The repository strictly separates backend operations from frontend interfaces. Check out [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for a deep dive into every file and folder, but here is a quick overview:

```text
├── alembic/        # Database schema migrations
├── app/            # FastAPI backend (Models, Routers, Core Logic)
├── frontend/       # Next.js frontend application 
├── scripts/        # Data seeding and testing utility scripts
├── docker-compose.yml # Container orchestration
└── entrypoint.sh   # Backend startup tasks (like running migrations)
```

## ⚙️ How to Run Locally

The entire project is containerized for a smooth setup experience using Docker Compose.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Services

1. Open a terminal in the project root director.
2. Spin up the containers using Docker compose:
   ```bash
   docker-compose up --build
   ```

**This command will start:**
- `db`: The MySQL database (Port `3307` externally, `3306` internally)
- `api`: The FastAPI Python backend (Port `8000`)
- `frontend`: The Next.js UI (Port `3000`)

3. **Access the application:**
   - **Frontend UI:** Open your browser to [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs (Swagger):** Open your browser to [http://localhost:8000/docs](http://localhost:8000/docs)

*(Note: Database migrations run automatically via `entrypoint.sh` when the backend container starts).*

## 🧩 Utilities and Scripts

The project comes with several helpful scripts located in the `scripts/` folder or root to help bootstrap your environment:
- **`create_admin.py`**: Ensuring an administration account is boot-strapped locally.
- **`scripts/seed.py`**: Populates the database with initial parameter data. 
- **`scripts/seed_faker.py`**: Generates varied, randomized test records for exploring UI features.
- **`scripts/test_api.py`**: Verifications of core backend endpoints.

---
*Built to ensure scalability, security, and exceptional care management capabilities.*

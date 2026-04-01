

## 📌 Overview

The **College Placement Portal** is a comprehensive platform designed to digitize and streamline the campus recruitment workflow. It connects three roles — **Students** and **Companies** — with a secure, role-based system where each user sees only what they need.

---

## ✨ Features

### 🎓 Student
- Register & login (email/password or **Google OAuth**)
- Complete a **multi-step profile wizard** (personal info, academic details, skills)
- Upload resume (stored via **Cloudinary**)
- **Search jobs by title** and filter by branch/eligibility
- Apply to jobs with one click (duplicate prevention enforced)
- Track **real-time application status** — `Applied`, `Shortlisted`, `Rejected`, `Selected`
- View **Recent Activity** feed on the Student Dashboard

### 🏢 Company
- Register & login (email/password or **Google OAuth**)
- Account becomes active after **Admin verification**
- Post job openings with title, description, salary, eligible branch, min CGPA, and required skills
- View all applications received for each job posting
- **Update application status** (Shortlist / Reject / Select applicants)


### 🌐 General
- Interactive **Landing Page** with job listings and company showcase
- Fully **Dockerized** for one-command deployment
- **Swagger UI** for complete API documentation
- Global exception handling & input validation
- JWT-secured stateless REST API

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite 8 | Core framework & build tool |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP client for API calls |
| `@react-oauth/google` | Google One-Tap / Sign-In OAuth |
| Lucide React | Icon library |
| Bootstrap 5 | Utility classes |
| Vanilla CSS | Premium glassmorphism design system |

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Core language |
| Spring Boot 3.2.5 | Application framework |
| Spring Security | Authentication & authorization |
| JJWT 0.11.5 | JWT token generation & validation |
| Google API Client | Google OAuth ID token verification |
| Spring Data JPA + Hibernate | ORM & database interaction |
| MySQL 8 | Relational database |
| Cloudinary SDK | Cloud-based resume storage |
| SpringDoc OpenAPI 2.3 | Swagger UI & API docs |
| Lombok | Boilerplate reduction |
| Maven | Build & dependency management |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |

---

## 🏗️ Project Structure

```
placement-portal-full/
│
├── backend/                          # Spring Boot application (Java 21, Maven)
│   ├── src/main/java/com/placement/portal/
│   │   ├── controller/               # REST API endpoints
│   │   │   ├── AuthController.java       (POST /auth/register, /auth/login, /auth/google)
│   │   │   ├── StudentController.java    (GET/POST /students/*)
│   │   │   ├── CompanyController.java    (GET/POST /company/*)
│   │   │   ├── JobController.java        (GET/POST /jobs/*)
│   │   │   ├── ApplicationController.java(POST/GET/PATCH /applications/*)
│   │   │   └── NotificationController.java
│   │   ├── service/                  # Business logic layer
│   │   ├── repository/               # Spring Data JPA repositories
│   │   ├── entity/                   # JPA entities (User, Student, Company, Job, Application, Notification)
│   │   ├── dto/                      # Request & Response DTOs
│   │   ├── security/                 # JWT filter, SecurityConfig, AuthServiceImpl
│   │   ├── exception/                # Global exception handler
│   │   ├── config/                   # CORS & Web config
│   │   └── CloudinaryConfig.java     # Cloudinary bean setup
│   ├── src/main/resources/
│   │   └── application.properties    # App configuration & env variables
│   ├── pom.xml                       # Maven dependencies
│   └── Dockerfile
│
├── frontend/                         # React 19 + Vite 8 application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Public landing page with jobs & companies
│   │   │   ├── LoginPage.jsx         # Email & Google OAuth login
│   │   │   ├── RegisterPage.jsx      # Role-based registration
│   │   │   ├── StudentDashboard.jsx  # Job search, apply, status tracking
│   │   │   ├── CompanyDashboard.jsx  # Job posting, application management
│   │   │   ├── AdminDashboard.jsx    # Company verification
│   │   │   ├── ProfilePage.jsx       # Multi-step profile wizard
│   │   │   └── JobsPage.jsx          # Full jobs listing page
│   │   ├── api/                      # Axios API call helpers
│   │   ├── auth/                     # Auth context & Google OAuth config
│   │   ├── components/               # Reusable UI components (Navbar, etc.)
│   │   └── routes/                   # Protected & role-based route guards
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
└── docker-compose.yml                # Orchestrates backend + frontend + mysql
```

---

## 🔐 Authentication & Roles

The app supports two authentication strategies, both producing a JWT for subsequent requests.

| Method | Endpoint | Description |
|---|---|---|
| Register | `POST /auth/register` | Email + password + role |
| Login | `POST /auth/login` | Returns a signed JWT |
| Google OAuth | `POST /auth/google` | Verifies Google ID token, returns JWT |
| Current User | `GET /auth/me` | Returns email & role from JWT |

### Role Permissions

| Role | Capabilities |
|---|---|
| `STUDENT` | Complete profile, search & apply to jobs, track application status |
| `COMPANY` | Post jobs, view applicants, shortlist/reject/select candidates |

---

## 📡 API Endpoints

### Auth — `/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT |
| POST | `/auth/google` | Login via Google OAuth |
| GET | `/auth/me` | Get current authenticated user |

### Jobs — `/jobs`
| Method | Path | Description |
|---|---|---|
| POST | `/jobs/post` | Company posts a new job |
| GET | `/jobs/All` | Get all job listings |
| GET | `/jobs/{id}` | Get a specific job |
| GET | `/jobs/branch/{branch}` | Filter jobs by branch |
| GET | `/jobs/company` | Get jobs posted by authenticated company |

### Applications — `/applications`
| Method | Path | Description |
|---|---|---|
| POST | `/applications/apply/{jobId}` | Student applies to a job |
| GET | `/applications/my` | Get logged-in student's applications |
| GET | `/applications/job/{jobId}` | Get all applicants for a job (Company) |
| PATCH | `/applications/{id}/status` | Update application status (Company) |

### Students — `/students`
| Method | Path | Description |
|---|---|---|
| POST | `/students/profile` | Create/update student profile |
| GET | `/students/profile` | Get logged-in student's profile |

---


---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose *(recommended)*
- **OR** manually:
  - Node.js v18+
  - Java 21+ & Maven
  - MySQL 8

---

### 🐳 Option 1 — Docker Compose (Recommended)

Run the entire application (Frontend, Backend, MySQL) with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/harshchaubey/placement-portal-full.git
cd placement-portal-full

# 2. Start all services
docker-compose up --build
```

Once running, access:

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8080 |
| 📄 Swagger UI | http://localhost:8080/swagger-ui/index.html |
| 🗄️ MySQL | `localhost:3307` (host) |

To stop all services:
```bash
docker-compose down
```

---

### 💻 Option 2 — Manual Local Setup

#### Backend

```bash
cd backend

# Configure database and secrets in:
# src/main/resources/application.properties

# Run the Spring Boot server
./mvnw spring-boot:run
```
> API will be available at `http://localhost:8081`

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create a .env file (copy from .env.example if present)
# Set VITE_API_BASE_URL=http://localhost:8081

# Start the development server
npm run dev
```
> App will be available at `http://localhost:5173`

---

## 🗄️ Database Schema (Entities)

### `users`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT (PK) | Auto-generated primary key |
| `email` | VARCHAR (unique) | User's email address — used as login username |
| `password` | VARCHAR | Hashed password (nullable for Google OAuth users) |
| `googleId` | VARCHAR | Google OAuth subject ID (nullable for email users) |
| `role` | ENUM | `STUDENT` · `COMPANY` · `ADMIN` |

---

### `students`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT (PK) | Auto-generated primary key |
| `name` | VARCHAR | Full name of the student |
| `email` | VARCHAR | Linked to user account email |
| `rollNo` | VARCHAR | College roll number |
| `branch` | VARCHAR | Engineering branch (e.g., CSE, ECE) |
| `cgpa` | DOUBLE | Current CGPA — used for job eligibility checks |
| `year` | INT | Academic year |
| `skills` | List\<String\> | List of technical/soft skills (stored as element collection) |
| `resumePath` | VARCHAR | Cloudinary URL of the uploaded resume |

---

### `companies`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT (PK) | Auto-generated primary key |
| `companyName` | VARCHAR | Name of the company |
| `email` | VARCHAR | Company contact email, linked to user account |
| `location` | VARCHAR | Office location |
| `verified` | BOOLEAN | `false` until Admin approves; gates company login |

---

### `jobs`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT (PK) | Auto-generated primary key |
| `title` | VARCHAR | Job title (e.g., "Software Engineer") |
| `description` | TEXT | Full job description |
| `salary` | VARCHAR | Offered CTC or salary range |
| `minCgpa` | DOUBLE | Minimum CGPA required to apply |
| `eligibleBranch` | VARCHAR | Branch restriction (e.g., "CSE", "All") |
| `lastDate` | VARCHAR | Application deadline |
| `skills` | List\<String\> | Required skills (stored as element collection) |
| `company_id` | BIGINT (FK) | References `companies.id` |

---

### `applications`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT (PK) | Auto-generated primary key |
| `student_id` | BIGINT (FK) | References `students.id` |
| `job_id` | BIGINT (FK) | References `jobs.id` |
| `status` | VARCHAR | Application state: `Applied` · `Shortlisted` · `Rejected` · `Selected` |
| `fileName` | VARCHAR | Original filename of the submitted resume |
| `resumePath` | VARCHAR | Cloudinary URL of the resume submitted with this application |

---

### `notifications`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT (PK) | Auto-generated primary key |
| *(fields)* | — | Emitted when application status changes, visible in student dashboard |

---

## 📸 Pages at a Glance

| Page | Route | Role |
|---|---|---|
| Landing / Home | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Student Dashboard | `/student/dashboard` | Student |
| Student Profile Wizard | `/student/profile` | Student |
| Company Dashboard | `/company/dashboard` | Company |
| Admin Dashboard | `/admin/dashboard` | Admin |
| Jobs Listing | `/jobs` | Public |

---

## 📖 API Documentation

Interactive Swagger UI is available at:

```
http://localhost:8080/swagger-ui/index.html
```

Full OpenAPI spec available at:
```
http://localhost:8080/v3/api-docs
```

---

## 🔮 Future Enhancements

- [ ] Email notifications on status change
- [ ] ML-based job recommendations for students
- [ ] Advanced analytics dashboard for Admin
- [ ] Resume parsing & auto-fill profile
- [ ] Interview scheduling & calendar integration

---

## 👨‍💻 Author

**Harsh Chaubey**
-GitHub:https://github.com/harshchaubey
-Email:harshchaubey189@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

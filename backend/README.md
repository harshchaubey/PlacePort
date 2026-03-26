# Placement Portal Backend

## 📌 Project Overview
A Spring Boot backend application designed to manage a college placement portal with secure role-based access using JWT authentication.

---

## 🚀 Features
- JWT-based Authentication & Authorization
- Role-based access control (ADMIN, COMPANY, STUDENT)
- Student registration and job application
- Company registration and admin verification
- Job posting with eligibility criteria
- Duplicate job application prevention
- Global exception handling & validation
- API documentation using Swagger

---

## 🛠️ Tech Stack
- Java
- Spring Boot
- Spring Security (JWT)
- Hibernate / JPA
- MySQL
- Swagger (OpenAPI)
- Maven

---

## 🔐 Roles & Access
| Role | Permissions |
|-----|------------|
| ADMIN | Verify companies, manage system |
| COMPANY | Post jobs, view applications |
| STUDENT | Apply for jobs |

---

## ▶️ How to Run
1. Configure MySQL database
2. Update `application.properties`
3. Run the Spring Boot application
4. Open Swagger:
http://localhost:8080/swagger-ui/index.html

---

## 📂 Project Structure
controller/
service/
repository/
entity/
dto/
exception/
security/

---

## 📎 Future Enhancements
- Email notifications
- ML-based job recommendations
- Frontend integration (React)

---

## 👨‍💻 Author
**Harsh Chaubey**
